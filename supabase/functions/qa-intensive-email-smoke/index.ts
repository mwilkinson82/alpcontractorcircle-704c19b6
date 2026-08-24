// TEMPORARY QA smoke-test function. Deployed to verify the onboarding email path,
// then removed. Not referenced by the app.
import {
  adminClient,
  deliverEnrollmentEmail,
  type Enrollment,
  json,
  randomToken,
} from "../_shared/intensive.ts";

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  const token = request.headers.get("x-qa-token") || "";
  if (token !== Deno.env.get("QA_SMOKE_TOKEN")) return json({ error: "Forbidden." }, 403);
  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from("intensive_enrollments")
      .insert({
        stripe_checkout_session_id: `qa_smoke_${Date.now()}`,
        stripe_payment_link_id: "qa_smoke",
        purchaser_email: "marshall@marshallwilkinson.com",
        purchaser_name: "QA Smoke Test",
        company_name: "ALP QA SMOKE",
        enrollment_type: "individual",
        seats: 1,
        currency: "usd",
        payment_status: "paid",
        access_token: randomToken(),
      })
      .select("*")
      .single();
    if (error) throw error;
    const enrollment = data as Enrollment;
    const result = await deliverEnrollmentEmail(enrollment, "onboarding");
    return json({ ok: true, enrollment_id: enrollment.id, result });
  } catch (error) {
    console.error("qa-intensive-email-smoke", error);
    return json({ error: error instanceof Error ? error.message : "failed" }, 500);
  }
});
