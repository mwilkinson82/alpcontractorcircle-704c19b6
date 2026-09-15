import { CPM_PAYMENT_LINK_ID, objectId, paidCpmPurchase, paymentBlockReason } from "./cpm-intensive-validation.ts";

type CpmWelcomeSender = (
  db: { from: (table: string) => any },
  enrollment: { id: string; access_token: string; purchaser_email: string; purchaser_name: string | null },
  datesLabel: string | null,
) => Promise<unknown>;


// Called ONLY after the existing dispatcher verifies the Stripe signature.
// This branch writes no Delay records; its only email is the CPM welcome.
export async function handleCpmEvent(
  event: { livemode?: boolean; type: string; data?: { object?: Record<string, any> } },
  dependencies: {
    adminClient: () => { from: (table: string) => any };
    randomToken: () => string;
    deliverWelcome?: CpmWelcomeSender;
  },
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
  // Welcome email carries the personal attendee-hub link; guarded against duplicates.
  const { data: enrollment, error: readError } = await db.from("cpm_intensive_enrollments")
    .select("id,access_token,purchaser_email,purchaser_name").eq("stripe_checkout_session_id", object.id).maybeSingle();
  if (readError) throw readError;
  if (!enrollment) return { cpm: true, enrolled: true, welcome: { skipped: true, reason: "enrollment_unavailable" } };
  const { data: settings } = await db.from("cpm_intensive_settings").select("dates_label").eq("id", 1).maybeSingle();
  if (!dependencies.deliverWelcome) return { cpm: true, enrolled: true, welcome: { skipped: true, reason: "no_mailer" } };
  const welcome = await dependencies.deliverWelcome(db, enrollment, settings?.dates_label ?? null);
  return { cpm: true, enrolled: true, welcome };
}
