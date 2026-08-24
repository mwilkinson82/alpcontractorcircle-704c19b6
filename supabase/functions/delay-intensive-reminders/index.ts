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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  try {
    const now = new Date();
    const supabase = adminClient();
    const results: Array<Record<string, unknown>> = [];
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
    return json({ ok: true, checked_at: now.toISOString(), results });
  } catch (error) {
    console.error("delay-intensive-reminders", error);
    return json({ error: "Reminder processing failed." }, 500);
  }
});
