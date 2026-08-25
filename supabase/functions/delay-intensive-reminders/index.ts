import {
  CORS_HEADERS,
  adminClient,
  deliverEnrollmentEmail,
  json,
  notifyMarshallOfClaim,
  type Enrollment,
} from "../_shared/intensive.ts";

const reminders = [
  { kind: "seven_day", dueAt: "2026-08-28T17:00:00.000Z" },
  { kind: "forty_eight_hour", dueAt: "2026-09-02T17:00:00.000Z" },
  { kind: "materials_release", dueAt: "2026-09-03T16:00:00.000Z" },
  { kind: "event_day_one", dueAt: "2026-09-04T12:00:00.000Z" },
];

const onboardingReminderKinds = [
  "onboarding_reminder_1",
  "onboarding_reminder_2",
  "onboarding_reminder_3",
] as const;
const FIRST_ONBOARDING_REMINDER_DELAY_MS = 24 * 60 * 60 * 1000;
const NEXT_ONBOARDING_REMINDER_DELAY_MS = 48 * 60 * 60 * 1000;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  try {
    const now = new Date();
    const supabase = adminClient();
    const results: Array<Record<string, unknown>> = [];

    const { data: incompleteEnrollments, error: incompleteError } = await supabase
      .from("intensive_enrollments")
      .select("*")
      .eq("payment_status", "paid")
      .is("onboarding_completed_at", null);
    if (incompleteError) throw incompleteError;

    for (const enrollment of (incompleteEnrollments || []) as Enrollment[]) {
      const { data: events, error: eventError } = await supabase
        .from("intensive_email_events")
        .select("email_kind,status,sent_at")
        .eq("enrollment_id", enrollment.id)
        .in("email_kind", [...onboardingReminderKinds]);
      if (eventError) throw eventError;

      const sentAtByKind = new Map(
        (events || [])
          .filter((event) => event.status === "sent" && event.sent_at)
          .map((event) => [event.email_kind, new Date(event.sent_at)]),
      );
      const nextIndex = onboardingReminderKinds.findIndex((kind) => !sentAtByKind.has(kind));
      if (nextIndex === -1) continue;

      const dueAt = nextIndex === 0
        ? new Date(new Date(enrollment.created_at).getTime() + FIRST_ONBOARDING_REMINDER_DELAY_MS)
        : (() => {
          const previousKind = onboardingReminderKinds[nextIndex - 1];
          const previousSentAt = sentAtByKind.get(previousKind);
          return previousSentAt
            ? new Date(previousSentAt.getTime() + NEXT_ONBOARDING_REMINDER_DELAY_MS)
            : null;
        })();
      if (!dueAt || now < dueAt) continue;

      const kind = onboardingReminderKinds[nextIndex];
      try {
        const delivery = await deliverEnrollmentEmail(enrollment, kind);
        results.push({ enrollment_id: enrollment.id, kind, due_at: dueAt.toISOString(), ...delivery });
      } catch (error) {
        results.push({
          enrollment_id: enrollment.id,
          kind,
          due_at: dueAt.toISOString(),
          error: error instanceof Error ? error.message : "Delivery failed",
        });
      }
    }

    for (const reminder of reminders) {
      const dueAt = new Date(reminder.dueAt);
      if (now < dueAt) continue;
      const { data, error } = await supabase
        .from("intensive_enrollments")
        .select("*")
        .eq("payment_status", "paid")
        .lte("created_at", dueAt.toISOString());
      if (error) throw error;
      for (const enrollment of (data || []) as Enrollment[]) {
        try {
          const delivery = await deliverEnrollmentEmail(enrollment, reminder.kind);
          results.push({ enrollment_id: enrollment.id, kind: reminder.kind, ...delivery });
        } catch (error) {
          results.push({
            enrollment_id: enrollment.id,
            kind: reminder.kind,
            error: error instanceof Error ? error.message : "Delivery failed",
          });
        }
      }
    }
    const { data: unnotifiedClaims, error: claimError } = await supabase
      .from("intensive_claim_submissions")
      .select("id")
      .eq("submitted_via_portal", true)
      .is("review_notified_at", null);
    if (claimError) throw claimError;
    for (const claim of unnotifiedClaims || []) {
      try {
        const delivery = await notifyMarshallOfClaim(claim.id);
        results.push({ claim_id: claim.id, kind: "claim_review", ...delivery });
      } catch (error) {
        results.push({ claim_id: claim.id, kind: "claim_review", error: error instanceof Error ? error.message : "Delivery failed" });
      }
    }

    const { data: portalClaims, error: portalClaimError } = await supabase
      .from("intensive_claim_submissions")
      .select("id,enrollment_id")
      .eq("submitted_via_portal", true)
      .not("enrollment_id", "is", null);
    if (portalClaimError) throw portalClaimError;
    for (const claim of portalClaims || []) {
      const { data: receipt, error: receiptLookupError } = await supabase
        .from("intensive_email_events")
        .select("status")
        .eq("enrollment_id", claim.enrollment_id)
        .eq("email_kind", CLAIM_RECEIPT_KIND)
        .maybeSingle();
      if (receiptLookupError) throw receiptLookupError;
      if (receipt?.status === "sent") continue;
      try {
        const delivery = await deliverClaimSubmissionReceipt(claim.id);
        results.push({ claim_id: claim.id, kind: CLAIM_RECEIPT_KIND, ...delivery });
      } catch (error) {
        results.push({
          claim_id: claim.id,
          kind: CLAIM_RECEIPT_KIND,
          error: error instanceof Error ? error.message : "Delivery failed",
        });
      }
    }
    return json({ ok: true, checked_at: now.toISOString(), results });
  } catch (error) {
    console.error("delay-intensive-reminders", error);
    return json({ error: "Reminder processing failed." }, 500);
  }
});
