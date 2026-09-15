export const CPM_PORTAL_URL = "https://alpcontractorcircle.com/cpm-intensive/onboarding";

export type CpmWelcomeEnrollment = {
  id: string;
  access_token: string;
  purchaser_email: string;
  purchaser_name: string | null;
  welcome_email_status?: string | null;
  welcome_email_attempts?: number | null;
};

export type CpmMailer = (to: string, subject: string, html: string) => Promise<string>;

function escapeHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailFrame(preheader: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>ALP CPM Schedule Intensive</title></head><body style="margin:0;background:#eee9df;color:#11110f;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eee9df"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#f7f3eb;border:1px solid #cfc7b9"><tr><td style="padding:20px 24px;border-bottom:1px solid #cfc7b9;font-size:13px;font-weight:700;letter-spacing:.12em">ALP <span style="font-weight:400;color:#6b645b">CPM SCHEDULE INTENSIVE</span></td></tr><tr><td style="padding:30px 24px">${body}</td></tr><tr><td style="padding:18px 24px;border-top:1px solid #cfc7b9;color:#6b645b;font-size:12px;line-height:1.6">Questions: <a href="mailto:marshall@marshallwilkinson.com" style="color:#11110f">marshall@marshallwilkinson.com</a><br>Advanced professional education. Not legal advice or a project-specific engagement.</td></tr></table></td></tr></table></body></html>`;
}

export function cpmWelcomeEmail(
  enrollment: CpmWelcomeEnrollment,
  settings?: { dates_label?: string | null; timezone?: string | null } | null,
) {
  const firstName = escapeHtml(enrollment.purchaser_name?.split(/\s+/)[0] || "there");
  const portalLink = `${CPM_PORTAL_URL}?access=${encodeURIComponent(enrollment.access_token)}`;
  const dates = escapeHtml(settings?.dates_label || "September 25–26, 2026");
  const timezone = settings?.timezone === "America/New_York"
    ? "Eastern Time"
    : escapeHtml(settings?.timezone?.replace(/_/g, " ") || "Eastern Time");
  const ticket = `CPM-${enrollment.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const body = `<p style="margin:0 0 10px;color:#c9482e;font-size:11px;letter-spacing:.14em;text-transform:uppercase">Enrollment confirmed</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:38px;line-height:1.05;font-weight:400">You are in the room, ${firstName}.</h1><p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#49443d">Your $1,997 seat in the ALP CPM Schedule Intensive (2-Day) is confirmed. Your private attendee portal is where you will open your e-ticket, get live access on the class days, and download materials when they are released.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#11110f;color:#f4f0e8"><tr><td style="padding:22px"><p style="margin:0 0 16px;color:#dc7e68;font-size:10px;letter-spacing:.15em;text-transform:uppercase">Official pass</p><p style="margin:0 0 4px;font-family:Georgia,serif;font-size:26px">CPM Schedule Intensive (2-Day)</p><p style="margin:0 0 18px;color:#c8c0b4;font-size:13px">${dates} · 10 a.m.–5 p.m. · ${timezone}</p><table role="presentation" width="100%"><tr><td style="font-size:11px;color:#aaa196">PASS</td><td style="font-size:11px;color:#aaa196">SEAT</td><td style="font-size:11px;color:#aaa196">PAID</td></tr><tr><td style="padding-top:5px;font-size:14px">${escapeHtml(ticket)}</td><td style="padding-top:5px;font-size:14px">1</td><td style="padding-top:5px;font-size:14px">$1,997.00</td></tr></table></td></tr></table><p style="margin:0 0 14px"><a href="${portalLink}" style="display:inline-block;background:#c9482e;color:#fff;text-decoration:none;padding:15px 22px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Open your attendee portal</a></p><p style="margin:0 0 25px;color:#6b645b;font-size:12px;line-height:1.6">This link is personal to your purchase. Do not forward it. You can also return from checkout; the portal accepts that completed session.</p><h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;font-weight:400">The two live days</h2><p style="margin:0 0 8px;font-size:14px;line-height:1.5"><strong>Day 1 · Build and update the CPM</strong><br>Activity IDs, logic, baseline, updates, critical path, and P6 as the camera.</p><p style="margin:0 0 24px;font-size:14px;line-height:1.5"><strong>Day 2 · Analyze and prove delay</strong><br>Plan vs as-built, windows, collapsed as-built, and the time record.</p><div style="padding:16px;border-left:3px solid #c9482e;background:#eee9df"><strong style="font-size:13px">Have Primavera P6 Professional running before Day 1.</strong><p style="margin:6px 0 0;color:#5e574f;font-size:13px;line-height:1.55">Use your company license, or start Oracle’s 30-day P6 Professional trial from the portal. Meet links unlock one hour before each day begins.</p></div>`;
  return {
    subject: "Your ALP CPM Intensive attendee portal",
    html: emailFrame("Your CPM seat is confirmed. Open your private attendee portal.", body),
  };
}

export async function deliverCpmWelcomeEmail(
  enrollment: CpmWelcomeEnrollment,
  dependencies: {
    adminClient: () => { from: (table: string) => any };
    sendEmail: CpmMailer;
  },
) {
  if (enrollment.welcome_email_status === "sent") return { skipped: true, reason: "already_sent" };
  if (!dependencies.sendEmail) throw new Error("CPM welcome mailer is not configured.");
  const db = dependencies.adminClient();
  const attempts = Number(enrollment.welcome_email_attempts || 0) + 1;
  const { error: pendingError } = await db.from("cpm_intensive_enrollments").update({
    welcome_email_status: "pending",
    welcome_email_attempts: attempts,
    welcome_email_error: null,
  }).eq("id", enrollment.id);
  if (pendingError) throw pendingError;

  let settings: { dates_label?: string | null; timezone?: string | null } | null = null;
  try {
    const { data } = await db.from("cpm_intensive_settings").select("dates_label,timezone").eq("id", 1).maybeSingle();
    settings = data;
  } catch {
    settings = null;
  }

  const email = cpmWelcomeEmail(enrollment, settings);
  try {
    const providerMessageId = await dependencies.sendEmail(enrollment.purchaser_email, email.subject, email.html);
    const { error } = await db.from("cpm_intensive_enrollments").update({
      welcome_email_status: "sent",
      welcome_email_sent_at: new Date().toISOString(),
      welcome_email_provider_id: providerMessageId,
      welcome_email_error: null,
      welcome_email_attempts: attempts,
    }).eq("id", enrollment.id);
    if (error) throw error;
    return { sent: true, providerMessageId };
  } catch (error) {
    const { error: failError } = await db.from("cpm_intensive_enrollments").update({
      welcome_email_status: "failed",
      welcome_email_error: error instanceof Error ? error.message.slice(0, 1000) : "Unknown email error",
      welcome_email_attempts: attempts,
    }).eq("id", enrollment.id);
    if (failError) throw failError;
    throw error;
  }
}
