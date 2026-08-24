import {
  adminClient,
  COMPANY_PAYMENT_LINK,
  deliverEnrollmentEmail,
  type Enrollment,
  INDIVIDUAL_PAYMENT_LINK,
  json,
  randomToken,
  timingSafeEqual,
} from "../_shared/intensive.ts";

const encoder = new TextEncoder();

async function hmacSha256Hex(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );
  return Array.from(
    new Uint8Array(signature),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function verifyStripeSignature(
  body: string,
  signatureHeader: string,
  secret: string,
) {
  const parts = signatureHeader.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((
    part,
  ) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;
  const expected = await hmacSha256Hex(secret, `${timestamp}.${body}`);
  return signatures.some((candidate) => timingSafeEqual(candidate, expected));
}

function asId(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) {
    return String((value as { id: unknown }).id);
  }
  return null;
}

async function enrollFromCheckout(session: Record<string, any>) {
  const paymentLinkId = asId(session.payment_link);
  if (
    paymentLinkId !== INDIVIDUAL_PAYMENT_LINK &&
    paymentLinkId !== COMPANY_PAYMENT_LINK
  ) {
    return { ignored: true, reason: "unrelated_payment_link" };
  }
  if (session.livemode !== true || session.payment_status !== "paid") {
    return { ignored: true, reason: "not_a_paid_live_session" };
  }

  const email = String(
    session.customer_details?.email || session.customer_email || "",
  ).trim().toLowerCase();
  if (!email) {
    throw new Error("Paid Checkout Session did not include an email address.");
  }
  const enrollmentType = paymentLinkId === COMPANY_PAYMENT_LINK
    ? "company"
    : "individual";
  const supabase = adminClient();
  const values = {
    stripe_checkout_session_id: String(session.id),
    stripe_payment_intent_id: asId(session.payment_intent),
    stripe_customer_id: asId(session.customer),
    stripe_payment_link_id: paymentLinkId,
    purchaser_email: email,
    purchaser_name: session.customer_details?.name || null,
    company_name:
      session.custom_fields?.find?.((field: any) =>
        field.key === "company" || field.key === "company_name"
      )?.text?.value || null,
    enrollment_type: enrollmentType,
    seats: enrollmentType === "company" ? 2 : 1,
    amount_total: typeof session.amount_total === "number"
      ? session.amount_total
      : null,
    currency: session.currency || "usd",
    payment_status: "paid",
    updated_at: new Date().toISOString(),
  };

  const { data: existing, error: existingError } = await supabase
    .from("intensive_enrollments")
    .select("id,access_token")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();
  if (existingError) throw existingError;

  const mutation = existing
    ? supabase.from("intensive_enrollments").update(values).eq(
      "id",
      existing.id,
    ).select("*").single()
    : supabase.from("intensive_enrollments").insert({
      ...values,
      access_token: randomToken(),
    }).select("*").single();
  const { data, error } = await mutation;
  if (error) throw error;

  const enrollment = data as Enrollment;
  await deliverEnrollmentEmail(enrollment, "onboarding");
  return { enrolled: true, enrollmentId: enrollment.id };
}

async function revokeByPaymentIntent(
  paymentIntentId: string | null,
  status: "refunded" | "disputed",
) {
  if (!paymentIntentId) {
    return { ignored: true, reason: "missing_payment_intent" };
  }
  const { data, error } = await adminClient()
    .from("intensive_enrollments")
    .update({ payment_status: status, updated_at: new Date().toISOString() })
    .eq("stripe_payment_intent_id", paymentIntentId)
    .select("id");
  if (error) throw error;
  return { revoked: data?.length || 0, status };
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  const secret = Deno.env.get("STRIPE_INTENSIVE_WEBHOOK_SECRET");
  if (!secret) return json({ error: "Webhook secret is not configured." }, 500);
  const signature = request.headers.get("stripe-signature") || "";
  const rawBody = await request.text();
  if (!(await verifyStripeSignature(rawBody, signature, secret))) {
    return json({ error: "Invalid Stripe signature." }, 400);
  }

  try {
    const event = JSON.parse(rawBody);
    const object = event?.data?.object as Record<string, any> | undefined;
    if (!object) return json({ received: true, ignored: true });

    let result: unknown = { ignored: true, reason: "event_not_used" };
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      result = await enrollFromCheckout(object);
    } else if (event.type === "charge.refunded" && object.refunded === true) {
      result = await revokeByPaymentIntent(
        asId(object.payment_intent),
        "refunded",
      );
    } else if (event.type === "charge.dispute.created") {
      result = await revokeByPaymentIntent(
        asId(object.payment_intent),
        "disputed",
      );
    }
    return json({ received: true, result });
  } catch (error) {
    console.error("delay-intensive-webhook", error);
    return json({ error: "Webhook processing failed." }, 500);
  }
});
