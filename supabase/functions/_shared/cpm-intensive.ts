import { CPM_PAYMENT_LINK_ID, objectId, paidCpmPurchase, paymentBlockReason } from "./cpm-intensive-validation.ts";
import type { CpmEnrollment } from "./cpm-intensive-email.ts";

type CpmDependencies = {
  adminClient: () => { from: (table: string) => any };
  randomToken: () => string;
  /** Injected in unit tests; production uses Resend via deliverCpmWelcomeEmail. */
  deliverWelcome?: (enrollment: CpmEnrollment) => Promise<unknown>;
};

// Called ONLY after the existing dispatcher verifies the Stripe signature.
// Writes CPM enrollment, then sends the attendee welcome with personal portal link.
// Never writes Delay enrollment records.
export async function handleCpmEvent(
  event: { livemode?: boolean; type: string; data?: { object?: Record<string, any> } },
  dependencies: CpmDependencies,
) {
  const object = event.data?.object;
  if (!object || event.livemode !== true) return null;
  const db = dependencies.adminClient();
  const blockReason = paymentBlockReason(event.type, object);
  if (blockReason) {
    const intentId = objectId(object.payment_intent);
    if (!intentId) return null;
    // Minimal references also catch revocations delivered before enrollment.
    const { error } = await db.from("cpm_intensive_payment_blocks").upsert({ stripe_payment_intent_id: intentId, reason: blockReason }, { onConflict: "stripe_payment_intent_id", ignoreDuplicates: true });
    if (error) throw error;
    // Continue through the pre-existing Delay revocation handler afterward.
    return null;
  }
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") return null;
  if (objectId(object.payment_link) !== CPM_PAYMENT_LINK_ID) return null;
  if (!paidCpmPurchase(object)) return { cpm: true, ignored: true, reason: "not_a_paid_cpm_seat" };
  const intentId = objectId(object.payment_intent)!;
  const { data: blocked, error: blockError } = await db.from("cpm_intensive_payment_blocks").select("stripe_payment_intent_id").eq("stripe_payment_intent_id", intentId).maybeSingle();
  if (blockError) throw blockError;
  if (blocked) return { cpm: true, ignored: true, reason: "payment_revoked" };

  // Retried or concurrent Stripe deliveries keep the same personal pass.
  const { error } = await db.from("cpm_intensive_enrollments").upsert({
    stripe_checkout_session_id: object.id,
    stripe_payment_intent_id: intentId,
    access_token: dependencies.randomToken(),
    purchaser_email: String(object.customer_details?.email || object.customer_email).trim().toLowerCase(),
    purchaser_name: object.customer_details?.name || null,
  }, { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true });
  if (error) throw error;

  const { data: enrollment, error: loadError } = await db
    .from("cpm_intensive_enrollments")
    .select("*")
    .eq("stripe_checkout_session_id", object.id)
    .maybeSingle();
  if (loadError) throw loadError;
  if (!enrollment || enrollment.revoked_at) {
    return { cpm: true, ignored: true, reason: "enrollment_unavailable" };
  }

  const deliver = dependencies.deliverWelcome ?? (async (row: CpmEnrollment) => {
    const { deliverCpmWelcomeEmail } = await import("./cpm-intensive-email.ts");
    return deliverCpmWelcomeEmail(row, dependencies.adminClient);
  });
  const welcome = await deliver(enrollment as CpmEnrollment);
  return { cpm: true, enrolled: true, welcome };
}
