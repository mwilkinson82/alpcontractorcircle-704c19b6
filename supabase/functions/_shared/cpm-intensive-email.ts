// CPM welcome mailer. Intentionally does not import intensive.ts so Vitest can
// load the purchase handler without Deno https: ESM modules.

export const CPM_PORTAL_URL = "https://alpcontractorcircle.com/cpm-intensive/onboarding";
export const CPM_WELCOME_KIND = "onboarding";
export const CPM_EMAIL_FROM = "ALP Intensive <intensive@alpcontractorcircle.com>";

export type CpmEnrollment = {
  id: string;
  access_token: string;
  purchaser_email: string;
  purchaser_name: string | null;
  stripe_checkout_session_id: string;
  revoked_at?: string | null;
};

function escapeHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ticketNumber(enrollment: CpmEnrollment) {
  return `CPM-${enrollment.stripe_checkout_session_id.slice(-8).toUpperCase()}`;
}

function cpmEmailFrame(preheader: string, body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>ALP CPM Schedule Intensive</title></head><body style="margin:0;background:#eee9df;color:#11110f;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eee9df"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#f7f3eb;border:1px solid #cfc7b9"><tr><td style="padding:20px 24px;border-bottom:1px solid #cfc7b9;font-size:13px;font-weight:700;letter-spacing:.12em">ALP <span style="font-weight:400;color:#6b645b">CPM SCHEDULE INTENSIVE</span></td></tr><tr><td style="padding:30px 24px">${body}</td></tr><tr><td style="padding:18px 24px;border-top:1px solid #cfc7b9;color:#6b645b;font-size:12px;line-height:1.6">Questions: <a href="mailto:marshall@marshallwilkinson.com" style="color:#11110f">marshall@marshallwilkinson.com</a><br>Advanced professional education. Not legal advice or a project-specific engagement.</td></tr></table></td></tr></table></body></html>`;
}

export function cpmOnboardingEmail(enrollment: CpmEnrollment) {
  const firstName = escapeHtml(enrollment.purchaser_name?.split(" ")[0] || "there");
  const portalLink = `${CPM_PORTAL_URL}?access=${encodeURIComponent(enrollment.access_token)}`;
  const ticket = ticketNumber(enrollment);
  const body = `<p style="margin:0 0 10px;color:#c9482e;font-size:11px;letter-spacing:.14em;text-transform:uppercase">Enrollment confirmed</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:38px;line-height:1.05;font-weight:400">You are in the room, ${firstName}.</h1><p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#49443d">Your payment is confirmed. Your private attendee portal is where you open Google Meet on class days, start the Oracle Primavera P6 Professional 30-day trial (or use your company license), and download class materials when they release.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#11110f;color:#f4f0e8"><tr><td style="padding:22px"><p style="margin:0 0 16px;color:#dc7e68;font-size:10px;letter-spacing:.15em;text-transform:uppercase">Official e-ticket</p><p style="margin:0 0 4px;font-family:Georgia,serif;font-size:26px">CPM Schedule Intensive (2-Day)</p><p style="margin:0 0 18px;color:#c8c0b4;font-size:13px">September 25–26, 2026 · 10:00 a.m.–5:00 p.m. ET · Live via Google Meet</p><table role="presentation" width="100%"><tr><td style="font-size:11px;color:#aaa196">PASS</td><td style="font-size:11px;color:#aaa196">SEAT</td></tr><tr><td style="padding-top:5px;font-size:14px">${escapeHtml(ticket)}</td><td style="padding-top:5px;font-size:14px">1</td></tr></table></td></tr></table><p style="margin:0 0 14px"><a href="${portalLink}" style="display:inline-block;background:#c9482e;color:#fff;text-decoration:none;padding:15px 22px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Open your attendee portal</a></p><p style="margin:0 0 25px;color:#6b645b;font-size:12px;line-height:1.6">This link is personal to your purchase. Do not forward it.</p><h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;font-weight:400">The working agenda</h2><p style="margin:0 0 8px;font-size:14px;line-height:1.5"><strong>Friday, September 25 · 10:00 a.m.–5:00 p.m. ET</strong><br>Day 1 — Build and update the CPM schedule in Primavera P6 Professional.</p><p style="margin:0 0 24px;font-size:14px;line-height:1.5"><strong>Saturday, September 26 · 10:00 a.m.–5:00 p.m. ET</strong><br>Day 2 — Use the schedule to analyze and prove delay.</p><div style="padding:16px;border-left:3px solid #c9482e;background:#eee9df"><strong style="font-size:13px">Materials release September 24 at 10:00 a.m. ET.</strong><p style="margin:6px 0 0;color:#5e574f;font-size:13px;line-height:1.55">Meet links unlock in the portal one hour before each day. Refunds, disputes, and revoked enrollments lose portal and material access.</p></div>`;
  return {
    subject: "Your ALP CPM Intensive e-ticket + attendee portal",
    html: cpmEmailFrame("Your seat is confirmed. Open your private CPM attendee portal.", body),
    from: CPM_EMAIL_FROM,
  };
}

async function sendCpmEmail(to: string, subject: string, html: string) {
  const connectionKey = Deno.env.get("RESEND_API_KEY");
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!connectionKey) throw new Error("RESEND_API_KEY is not configured.");
  if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured.");
  const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableApiKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CPM_EMAIL_FROM,
      to: [to],
      subject,
      html,
      reply_to: "marshall@marshallwilkinson.com",
    }),
  });
  const payloadText = await response.text();
  if (!response.ok) {
    console.error(`CPM Resend gateway request failed [${response.status}]: ${payloadText}`);
    throw new Error(`Email provider returned ${response.status}.`);
  }
  return JSON.parse(payloadText).id as string;
}

type AdminClient = () => { from: (table: string) => any };

export async function deliverCpmWelcomeEmail(
  enrollment: CpmEnrollment,
  adminClient: AdminClient,
) {
  const supabase = adminClient();
  const { data: existing } = await supabase
    .from("cpm_intensive_email_events")
    .select("id,status,attempt_count")
    .eq("enrollment_id", enrollment.id)
    .eq("email_kind", CPM_WELCOME_KIND)
    .maybeSingle();
  if (existing?.status === "sent") return { skipped: true, reason: "already_sent" };

  const attempts = Number(existing?.attempt_count || 0) + 1;
  const record = {
    enrollment_id: enrollment.id,
    email_kind: CPM_WELCOME_KIND,
    recipient: enrollment.purchaser_email,
    status: "pending",
    attempt_count: attempts,
    last_error: null,
    updated_at: new Date().toISOString(),
  };
  if (existing) {
    await supabase.from("cpm_intensive_email_events").update(record).eq("id", existing.id);
  } else {
    await supabase.from("cpm_intensive_email_events").insert(record);
  }

  try {
    const email = cpmOnboardingEmail(enrollment);
    const providerMessageId = await sendCpmEmail(
      enrollment.purchaser_email,
      email.subject,
      email.html,
    );
    await supabase.from("cpm_intensive_email_events").update({
      status: "sent",
      provider_message_id: providerMessageId,
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("enrollment_id", enrollment.id).eq("email_kind", CPM_WELCOME_KIND);
    return { sent: true, providerMessageId };
  } catch (error) {
    await supabase.from("cpm_intensive_email_events").update({
      status: "failed",
      last_error: error instanceof Error ? error.message.slice(0, 1000) : "Unknown email error",
      updated_at: new Date().toISOString(),
    }).eq("enrollment_id", enrollment.id).eq("email_kind", CPM_WELCOME_KIND);
    throw error;
  }
}
