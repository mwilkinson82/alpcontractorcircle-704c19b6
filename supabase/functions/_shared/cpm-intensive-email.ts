import { confirmationEmailFrame } from "./confirmation-email-frame.ts";
import { escapeHtml, sendEmail } from "./intensive.ts";

export const CPM_PORTAL_URL = "https://alpcontractorcircle.com/cpm-intensive/onboarding";

export type CpmEnrollmentRow = {
  id: string;
  access_token: string;
  purchaser_email: string;
  purchaser_name: string | null;
};

export function cpmWelcomeEmail(enrollment: CpmEnrollmentRow, datesLabel: string | null) {
  const firstName = escapeHtml(enrollment.purchaser_name?.split(" ")[0] || "there");
  const portalLink = `${CPM_PORTAL_URL}?access=${encodeURIComponent(enrollment.access_token)}`;
  const ticket = `CPM-${enrollment.id.slice(0, 8).toUpperCase()}`;
  const dates = escapeHtml(datesLabel || "Dates confirmed in your attendee hub");
  const body = `<p style="margin:0 0 20px;font-size:19px;line-height:28px;font-weight:700">Your CPM seat is confirmed, ${firstName}.</p><p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#1C1A17">Your private attendee hub is where you will find your e-ticket, the two-day schedule, the live room link when it is released, and the class materials.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#1C1A17;color:#F7F2EA"><tr><td style="padding:22px"><p style="margin:0 0 16px;color:#F76A16;font-size:10px;letter-spacing:.15em;text-transform:uppercase">Official e-ticket</p><p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:26px">CPM Schedule Intensive</p><p style="margin:0 0 18px;color:#F7F2EA;font-size:13px">${dates} &middot; Two days, 10 a.m.&ndash;5 p.m. each day</p><table role="presentation" width="100%"><tr><td style="font-size:11px;color:#F7F2EA">PASS</td><td style="font-size:11px;color:#F7F2EA">SEATS</td></tr><tr><td style="padding-top:5px;font-size:14px">${escapeHtml(ticket)}</td><td style="padding-top:5px;font-size:14px">1</td></tr></table></td></tr></table><p style="margin:0 0 14px"><a href="${portalLink}" style="display:inline-block;background:#F76A16;color:#1C1A17;text-decoration:none;padding:15px 22px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Open your attendee hub</a></p><p style="margin:0 0 25px;color:#625D55;font-size:12px;line-height:1.6">This link is personal to your purchase. Do not forward it.</p><div style="padding:16px;border-left:3px solid #F76A16;background:#E9E3DA"><strong style="font-size:13px">Before Day 1: install Primavera P6 Professional on a Windows machine.</strong><p style="margin:6px 0 0;color:#625D55;font-size:13px;line-height:1.55">Start the free 30-day Oracle trial close to the class dates, or use your company license. Full setup steps are in your attendee hub.</p></div>`;
  return {
    subject: "Your ALP CPM Schedule Intensive e-ticket + attendee hub",
    html: confirmationEmailFrame("Your CPM seat is confirmed. Open your private attendee hub.", "CPM Schedule Intensive", "CPM.<br>YOU’RE IN.", body),
  };
}

// One welcome email per enrollment, safe under duplicate Stripe deliveries.
export async function deliverCpmWelcomeEmail(
  db: { from: (table: string) => any },
  enrollment: CpmEnrollmentRow,
  datesLabel: string | null,
) {
  const kind = "cpm_welcome";
  const { data: existing } = await db.from("cpm_intensive_email_events")
    .select("id,status,attempt_count").eq("enrollment_id", enrollment.id).eq("email_kind", kind).maybeSingle();
  if (existing?.status === "sent") return { skipped: true, reason: "already_sent" };
  const attempts = Number(existing?.attempt_count || 0) + 1;
  const record = {
    enrollment_id: enrollment.id,
    email_kind: kind,
    recipient: enrollment.purchaser_email,
    status: "pending",
    attempt_count: attempts,
    last_error: null,
    updated_at: new Date().toISOString(),
  };
  if (existing) await db.from("cpm_intensive_email_events").update(record).eq("id", existing.id);
  else await db.from("cpm_intensive_email_events").insert(record);
  try {
    const email = cpmWelcomeEmail(enrollment, datesLabel);
    const providerMessageId = await sendEmail(enrollment.purchaser_email, email.subject, email.html);
    await db.from("cpm_intensive_email_events").update({
      status: "sent",
      provider_message_id: providerMessageId,
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("enrollment_id", enrollment.id).eq("email_kind", kind);
    return { sent: true, providerMessageId };
  } catch (error) {
    await db.from("cpm_intensive_email_events").update({
      status: "failed",
      last_error: error instanceof Error ? error.message.slice(0, 1000) : "Unknown email error",
      updated_at: new Date().toISOString(),
    }).eq("enrollment_id", enrollment.id).eq("email_kind", kind);
    throw error;
  }
}
