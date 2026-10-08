import { octoberDelayOffer } from "./delay-confirmation-cohort.ts";

// Called only after Stripe signature verification, and only for checkout events.
// The gate is off by default. Enabling production enrollment needs release approval.
export async function enrollOctoberDelayCheckout(
  session: Record<string, any>,
  eventLive: unknown,
  dependencies: {
    enabled: boolean;
    adminClient: () => { from: (table: string) => any };
    randomToken: () => string;
    deliver: (enrollment: any, kind: string) => Promise<unknown>;
  },
) {
  const link = typeof session.payment_link === "string" ? session.payment_link : session.payment_link?.id;
  const offer = octoberDelayOffer(link);
  if (!offer) return { ignored: true, reason: "unrelated_payment_link" };
  if (eventLive !== true || session.livemode !== true || session.payment_status !== "paid" || session.mode !== "payment" || session.status !== "complete") {
    return { ignored: true, reason: "not_a_paid_live_october_checkout" };
  }
  if (typeof session.id !== "string" || !/^cs_live_[A-Za-z0-9]+$/.test(session.id)) throw new Error("Invalid October checkout session ID.");
  const intent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (typeof intent !== "string" || !/^pi_[A-Za-z0-9]+$/.test(intent)) throw new Error("October checkout payment intent is unavailable.");
  const email = String(session.customer_details?.email || session.customer_email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("October checkout purchaser email is unavailable.");
  if (!Number.isSafeInteger(session.amount_total) || session.amount_total < 0 || typeof session.currency !== "string" || !/^[a-zA-Z]{3}$/.test(session.currency)) throw new Error("October checkout purchase values are unavailable.");
  // Throw instead of acknowledging a paid checkout that cannot yet be fulfilled.
  if (!dependencies.enabled) throw new Error("October Delay fulfillment is not enabled for release.");
  const db = dependencies.adminClient();
  // Existing dispatcher records refund/dispute intents here before routing Delay.
  // Read only: do not create or alter CPM enrollment, email, or personal queues.
  const { data: blocked, error: blockError } = await db.from("cpm_intensive_payment_blocks").select("stripe_payment_intent_id").eq("stripe_payment_intent_id", intent).maybeSingle();
  if (blockError) throw blockError;
  if (blocked) return { ignored: true, reason: "payment_revoked" };
  const { error: insertError } = await db.from("intensive_enrollments").upsert({
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: intent,
    stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id || null,
    stripe_payment_link_id: link,
    purchaser_email: email,
    purchaser_name: session.customer_details?.name || null,
    company_name: session.custom_fields?.find?.((field: any) => field.key === "company" || field.key === "company_name")?.text?.value || null,
    enrollment_type: offer.enrollmentType,
    seats: offer.seats,
    amount_total: session.amount_total,
    currency: session.currency.toLowerCase(),
    payment_status: "paid",
    pass_kind: "purchaser",
    audience_channel: offer.audience,
    access_token: dependencies.randomToken(),
    // PostgreSQL infinity means no release is scheduled. Never inherit September.
    // The October portal exposes null/pending until approved cohort config exists.
    materials_release_at: "infinity",
  }, { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true });
  if (insertError) throw insertError;
  const { data: enrollment, error: readError } = await db.from("intensive_enrollments").select("*").eq("stripe_checkout_session_id", session.id).maybeSingle();
  if (readError) throw readError;
  if (!enrollment) throw new Error("October enrollment could not be loaded.");
  // Never overwrite identity, tokens, quantities, or revocation on repeat delivery.
  if (enrollment.stripe_payment_link_id !== link || enrollment.stripe_payment_intent_id !== intent) throw new Error("October checkout identity mismatch.");
  if (enrollment.payment_status !== "paid") return { ignored: true, reason: "enrollment_not_paid" };
  const welcome = await dependencies.deliver(enrollment, "onboarding");
  return { enrolled: true, enrollmentId: enrollment.id, cohort: offer.cohort, welcome };
}
