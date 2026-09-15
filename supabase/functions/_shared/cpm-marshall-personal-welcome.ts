// Marshall's personal welcome note. Queued only; Lane sends it by hand from
// Gmail as marshall@. Nothing here touches Resend or the hub mailer.
export const MARSHALL_PERSONAL_WELCOME_KIND = "marshall_personal_welcome";
export const MARSHALL_PERSONAL_WELCOME_SUBJECT = "Welcome to the ALP CPM Schedule Intensive";

export type PersonalWelcomeEnrollment = {
  id: string;
  purchaser_email: string;
  purchaser_name: string | null;
};

export function personalWelcomeFirstName(purchaserName: string | null | undefined): string {
  const first = String(purchaserName || "").trim().split(/\s+/)[0];
  return first || "there";
}

// Archived gold body (Gmail 1a0a69894f8217cf). Word for word; the greeting is generated.
const GOLD_BODY =
  `Hello and welcome to the ALP Contractor Circle CPM Intensive. I wanted to reach out personally and welcome you. I’m looking forward to meeting you on Friday, September 25 and Saturday, September 26, 2026 (10 a.m.–5 p.m. Eastern each day).

We call it an intensive because it is intense. We’re covering a lot of ground over two days, so come prepared, ready to take notes. Come hydrated, and be ready to focus and commit. We’ll have a few intermissions as we go.

Here’s how the two days break down:

Friday (Day 1) — Build and update the CPM.
We get hands-on in Primavera P6. You build your own schedule: activities, durations, sequencing and logic, a credible baseline, and the critical path. Then we update — actuals, remaining duration, data date — and keep each update tied to the baseline. We work concurrent-delay discipline, insert delay and change-order fragments into the logic, track how the path and finish move, and write reports/narratives the owner can follow. P6 is the camera; the schedule is how you see risk early.

Saturday (Day 2) — Analyze and prove delay.
We take that schedule work into delay analysis: plan vs as-built, collapsed as-built, windows analysis through successive updates. You learn to prove delay (event → affected activities → critical path → finish), test overlapping delays, follow fragments and resequencing, and connect trade stacking and disruption to the time record behind extensions and delay-damage calculations — then write a delay narrative the schedule and job records support.

You should already have your attendee portal from the automated welcome. Get P6 open before Friday (company license or the Oracle 30-day trial link in your portal). Bring a job example with sensitive info stripped if you can.

Looking forward to working with you.

Marshall`;

export function marshallPersonalWelcomeText(enrollment: PersonalWelcomeEnrollment): string {
  return `${personalWelcomeFirstName(enrollment.purchaser_name)} —\n\n${GOLD_BODY}`;
}

export function marshallPersonalWelcomeHtml(enrollment: PersonalWelcomeEnrollment): string {
  const escape = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return marshallPersonalWelcomeText(enrollment)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escape(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

// Queues the note when the ops flag is on. Never sends; never inserts while off.
export async function enqueueMarshallPersonalWelcome(
  db: { from: (table: string) => any },
  enrollment: PersonalWelcomeEnrollment,
) {
  const { data: settings, error: settingsError } = await db.from("cpm_intensive_settings")
    .select("marshall_personal_welcome_auto").eq("id", 1).maybeSingle();
  if (settingsError) throw settingsError;
  if (settings?.marshall_personal_welcome_auto !== true) {
    return { skipped: true, reason: "flag_off" };
  }

  const { data: existing, error: existingError } = await db.from("cpm_intensive_email_events")
    .select("id,status").eq("enrollment_id", enrollment.id)
    .eq("email_kind", MARSHALL_PERSONAL_WELCOME_KIND).maybeSingle();
  if (existingError) throw existingError;
  if (existing?.status === "sent") return { skipped: true, reason: "already_sent" };

  const now = new Date().toISOString();
  const { error } = await db.from("cpm_intensive_email_events").upsert({
    enrollment_id: enrollment.id,
    email_kind: MARSHALL_PERSONAL_WELCOME_KIND,
    recipient: enrollment.purchaser_email,
    status: "pending",
    updated_at: now,
  }, { onConflict: "enrollment_id,email_kind" });
  if (error) throw error;
  return { queued: true };
}
