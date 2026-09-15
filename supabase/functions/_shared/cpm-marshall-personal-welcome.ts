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

// PENDING: replace with the exact archived gold body (Gmail 1a0a69894f8217cf).
// Everything after the greeting line must match that message word for word.
const GOLD_BODY = `Thanks for enrolling. I wanted to reach out personally rather than let an automated note be the only thing you hear from me.

We run Friday, September 25 and Saturday, September 26, 2026, 10 a.m. to 5 p.m. Eastern both days.

Before Day 1, get Primavera P6 Professional installed on a Windows machine. Start the free 30-day Oracle trial close to the class dates, or use your company license. The setup steps are in your attendee hub.

Bring a real schedule and a real dispute if you have one. The two days work best when we are building and proving time on live work instead of a sample file.

If anything comes up between now and then, reply straight to this note.

Marshall`;

export function marshallPersonalWelcomeText(enrollment: PersonalWelcomeEnrollment): string {
  return `${personalWelcomeFirstName(enrollment.purchaser_name)} — ${GOLD_BODY}`;
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
