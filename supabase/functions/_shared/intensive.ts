import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

export const INDIVIDUAL_PAYMENT_LINK = "plink_1U7n37JdDAUSVXbNG7XStxnN";
export const COMPANY_PAYMENT_LINK = "plink_1U7n39JdDAUSVXbNIreq7bTB";
export const PORTAL_URL = "https://alpcontractorcircle.com/delay-intensive/onboarding";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://alpcontractorcircle.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" },
  });
}

export function adminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Supabase service credentials are unavailable.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function escapeHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function safeFileName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "claim-file";
}

export function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function timingSafeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) mismatch |= a[index] ^ b[index];
  return mismatch === 0;
}

export type Enrollment = {
  id: string;
  stripe_checkout_session_id: string;
  purchaser_email: string;
  purchaser_name: string | null;
  company_name: string | null;
  enrollment_type: "individual" | "company";
  seats: number;
  amount_total: number | null;
  currency: string | null;
  payment_status: "paid" | "refunded" | "disputed" | "revoked";
  audience_channel: "public" | "contractor_circle" | "unattributed";
  access_token: string;
  onboarding_completed_at: string | null;
  materials_release_at: string;
  created_at: string;
};

export async function findPaidEnrollment(token: string) {
  if (!/^[a-f0-9]{64}$/i.test(token)) return null;
  const { data, error } = await adminClient()
    .from("intensive_enrollments")
    .select("*")
    .eq("access_token", token)
    .maybeSingle();
  if (error) throw error;
  if (!data || data.payment_status !== "paid") return null;
  return data as Enrollment;
}

export function ticketNumber(enrollment: Enrollment) {
  return `ALP-${enrollment.stripe_checkout_session_id.slice(-8).toUpperCase()}`;
}

export function money(amount: number | null, currency: string | null) {
  if (amount === null) return "Paid";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
  }).format(amount / 100);
}

export function emailFrame(preheader: string, body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>ALP Delay & Damages Intensive</title></head><body style="margin:0;background:#eee9df;color:#11110f;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eee9df"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#f7f3eb;border:1px solid #cfc7b9"><tr><td style="padding:20px 24px;border-bottom:1px solid #cfc7b9;font-size:13px;font-weight:700;letter-spacing:.12em">ALP <span style="font-weight:400;color:#6b645b">PROFESSIONAL INTENSIVE</span></td></tr><tr><td style="padding:30px 24px">${body}</td></tr><tr><td style="padding:18px 24px;border-top:1px solid #cfc7b9;color:#6b645b;font-size:12px;line-height:1.6">Questions or attendee changes: <a href="mailto:marshall@marshallwilkinson.com" style="color:#11110f">marshall@marshallwilkinson.com</a><br>Advanced professional education. Not legal advice or a project-specific engagement.</td></tr></table></td></tr></table></body></html>`;
}

export function onboardingEmail(enrollment: Enrollment) {
  const firstName = escapeHtml(enrollment.purchaser_name?.split(" ")[0] || "there");
  const portalLink = `${PORTAL_URL}?access=${encodeURIComponent(enrollment.access_token)}`;
  const ticket = ticketNumber(enrollment);
  const body = `<p style="margin:0 0 10px;color:#c9482e;font-size:11px;letter-spacing:.14em;text-transform:uppercase">Enrollment confirmed</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:38px;line-height:1.05;font-weight:400">You are in the room, ${firstName}.</h1><p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#49443d">Your payment has been confirmed. Your private attendee portal is where you will finish onboarding, submit a live claim candidate, receive reminders, and access the class materials when they are released.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#11110f;color:#f4f0e8"><tr><td style="padding:22px"><p style="margin:0 0 16px;color:#dc7e68;font-size:10px;letter-spacing:.15em;text-transform:uppercase">Official e-ticket</p><p style="margin:0 0 4px;font-family:Georgia,serif;font-size:26px">Delay &amp; Damages Intensive</p><p style="margin:0 0 18px;color:#c8c0b4;font-size:13px">September 4–6, 2026 · Live via Zoom</p><table role="presentation" width="100%"><tr><td style="font-size:11px;color:#aaa196">PASS</td><td style="font-size:11px;color:#aaa196">SEATS</td><td style="font-size:11px;color:#aaa196">PAID</td></tr><tr><td style="padding-top:5px;font-size:14px">${escapeHtml(ticket)}</td><td style="padding-top:5px;font-size:14px">${enrollment.seats}</td><td style="padding-top:5px;font-size:14px">${escapeHtml(money(enrollment.amount_total, enrollment.currency))}</td></tr></table></td></tr></table><p style="margin:0 0 14px"><a href="${portalLink}" style="display:inline-block;background:#c9482e;color:#fff;text-decoration:none;padding:15px 22px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Open your attendee portal</a></p><p style="margin:0 0 25px;color:#6b645b;font-size:12px;line-height:1.6">This link is personal to your purchase. Do not forward it.</p><h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;font-weight:400">The working agenda</h2><p style="margin:0 0 8px;font-size:14px;line-height:1.5"><strong>Friday, September 4 · 1:00–5:00 p.m. ET</strong><br>Preserve — entitlement, notice, reservation of rights and the record.</p><p style="margin:0 0 8px;font-size:14px;line-height:1.5"><strong>Saturday, September 5 · 9:00 a.m.–5:00 p.m. ET</strong><br>Prove + Price — CPM causation, concurrency, mitigation and damages.</p><p style="margin:0 0 24px;font-size:14px;line-height:1.5"><strong>Sunday, September 6 · 10:00 a.m.–1:00 p.m. ET</strong><br>Build — claim assembly, red-team review and submission architecture.</p><div style="padding:16px;border-left:3px solid #c9482e;background:#eee9df"><strong style="font-size:13px">Materials stay locked until September 3 at noon ET.</strong><p style="margin:6px 0 0;color:#5e574f;font-size:13px;line-height:1.55">You will receive a reminder when the working files are released. Refunds, disputes, and revoked enrollments automatically lose portal and material access.</p></div>`;
  return {
    subject: "Your ALP Intensive e-ticket + attendee portal",
    html: emailFrame("Your seat is confirmed. Open your private attendee portal.", body),
  };
}

export function reminderEmail(enrollment: Enrollment, kind: string) {
  const portalLink = `${PORTAL_URL}?access=${encodeURIComponent(enrollment.access_token)}`;
  const firstName = escapeHtml(enrollment.purchaser_name?.split(" ")[0] || "there");
  const definitions: Record<string, { subject: string; eyebrow: string; title: string; copy: string }> = {
    seven_day: {
      subject: "One week: finish your Intensive onboarding",
      eyebrow: "One week out",
      title: `Get the claim out of your head, ${firstName}.`,
      copy: "Finish the attendee checklist and submit your live claim candidate now if you want Marshall to consider it for the room.",
    },
    onboarding_reminder_1: {
      subject: "Action required: finish your Intensive onboarding",
      eyebrow: "Your seat is confirmed",
      title: "Finish your attendee setup.",
      copy: "Your seat is paid and confirmed, but your attendee profile is not complete. Open your private portal to confirm who is attending and tell Marshall what you need from the room.",
    },
    onboarding_reminder_2: {
      subject: "Your Intensive onboarding is still open",
      eyebrow: "Attendee setup incomplete",
      title: "Put your project on Marshall's radar.",
      copy: "Complete the attendee checklist now. After onboarding, you can submit a live claim candidate for Marshall to consider dissecting during the Intensive.",
    },
    onboarding_reminder_3: {
      subject: "Final reminder: complete your Intensive onboarding",
      eyebrow: "Final onboarding reminder",
      title: "We still need your attendee details.",
      copy: "Open your private portal and complete the short attendee checklist. This is the final onboarding reminder; your scheduled class and materials notices will still arrive separately.",
    },
    forty_eight_hour: {
      subject: "48 hours: your ALP Intensive readiness check",
      eyebrow: "48 hours out",
      title: "Clear the room. Clear the calendar.",
      copy: "Confirm the attendee names, review the agenda, and make sure the claim record you want to discuss is organized.",
    },
    materials_release: {
      subject: "Your Intensive materials are now available",
      eyebrow: "Materials released",
      title: "The working files are ready.",
      copy: "Your playbook, templates, worksheets, and Zoom access are now available inside the attendee portal.",
    },
    event_day_one: {
      subject: "Today at 1:00 p.m. ET: enter the Intensive",
      eyebrow: "Day one",
      title: "We begin with preservation.",
      copy: "Open the portal for Zoom access and be in the room a few minutes before 1:00 p.m. ET.",
    },
  };
  const definition = definitions[kind];
  if (!definition) throw new Error(`Unknown enrollment email kind: ${kind}`);
  const body = `<p style="margin:0 0 10px;color:#c9482e;font-size:11px;letter-spacing:.14em;text-transform:uppercase">${definition.eyebrow}</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:36px;line-height:1.08;font-weight:400">${definition.title}</h1><p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#49443d">${definition.copy}</p><p style="margin:0"><a href="${portalLink}" style="display:inline-block;background:#11110f;color:#fff;text-decoration:none;padding:15px 22px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Open attendee portal</a></p>`;
  return { subject: definition.subject, html: emailFrame(definition.copy, body) };
}

export async function sendEmail(to: string, subject: string, html: string, replyTo = "marshall@marshallwilkinson.com") {
  const connectionKey = Deno.env.get("RESEND_API_KEY");
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  const from = Deno.env.get("INTENSIVE_EMAIL_FROM") || "ALP Intensive <intensive@alpcontractorcircle.com>";
  if (!connectionKey) throw new Error("RESEND_API_KEY is not configured.");
  if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured.");
  const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableApiKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, reply_to: replyTo }),
  });
  const payloadText = await response.text();
  if (!response.ok) {
    console.error(`Resend gateway request failed [${response.status}]: ${payloadText}`);
    throw new Error(`Email provider returned ${response.status}.`);
  }
  const payload = JSON.parse(payloadText);
  return payload.id as string;
}

export async function notifyMarshallOfClaim(claimId: string) {
  const supabase = adminClient();
  const { data: claim, error } = await supabase
    .from("intensive_claim_submissions")
    .select("*, intensive_enrollments!inner(purchaser_email,purchaser_name,company_name,enrollment_type,seats)")
    .eq("id", claimId)
    .maybeSingle();
  if (error) throw error;
  if (!claim || claim.review_notified_at) return { skipped: true };
  const { data: attachments, error: attachmentError } = await supabase
    .from("intensive_claim_attachments")
    .select("original_name,storage_path")
    .eq("claim_submission_id", claimId);
  if (attachmentError) throw attachmentError;
  const links: Array<{ name: string; url: string }> = [];
  for (const attachment of attachments || []) {
    const { data } = await supabase.storage
      .from("intensive-claim-files")
      .createSignedUrl(attachment.storage_path, 604800);
    if (data?.signedUrl) links.push({ name: attachment.original_name, url: data.signedUrl });
  }
  const enrollment = claim.intensive_enrollments;
  const fileRows = links.length
    ? `<h2 style="margin:24px 0 10px;font-family:Georgia,serif;font-size:22px;font-weight:400">Private claim files</h2>${links.map((link) => `<p style="margin:0 0 8px"><a href="${link.url}" style="color:#c9482e">${escapeHtml(link.name)}</a> <span style="color:#6b645b;font-size:11px">(expires in 7 days)</span></p>`).join("")}`
    : `<p style="margin:20px 0 0;color:#6b645b;font-size:13px">No files were attached.</p>`;
  const body = `<p style="margin:0 0 10px;color:#c9482e;font-size:11px;letter-spacing:.14em;text-transform:uppercase">Paid attendee claim intake</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:34px;line-height:1.08;font-weight:400">${escapeHtml(claim.project_name)}</h1><p style="margin:0 0 20px;font-size:14px;line-height:1.6"><strong>${escapeHtml(claim.submitter_name)}</strong> · ${escapeHtml(claim.company_name)}<br><a href="mailto:${escapeHtml(enrollment.purchaser_email)}" style="color:#11110f">${escapeHtml(enrollment.purchaser_email)}</a> · ${escapeHtml(claim.claim_stage)}</p><h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;font-weight:400">What happened</h2><p style="margin:0 0 18px;white-space:pre-wrap;font-size:14px;line-height:1.6">${escapeHtml(claim.claim_summary)}</p><h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;font-weight:400">Records available</h2><p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.6">${escapeHtml(claim.records_available)}</p>${claim.amount_at_issue ? `<p style="margin:18px 0 0"><strong>Amount or time at issue:</strong> ${escapeHtml(claim.amount_at_issue)}</p>` : ""}${claim.redaction_notes ? `<p style="margin:10px 0 0"><strong>Redaction notes:</strong> ${escapeHtml(claim.redaction_notes)}</p>` : ""}${fileRows}<div style="margin-top:24px;padding:14px;border-left:3px solid #c9482e;background:#eee9df;font-size:12px;line-height:1.6"><strong>Marshall chooses the room.</strong> Submission is verified to a paid enrollment. Selection is not guaranteed and the attendee has accepted the educational-use terms.</div>`;
  await sendEmail(
    "marshall@marshallwilkinson.com",
    `Live claim candidate: ${claim.project_name} — ${claim.company_name}`,
    emailFrame(`${claim.company_name} submitted a paid-attendee claim candidate.`, body),
    enrollment.purchaser_email,
  );
  const notifiedAt = new Date().toISOString();
  await supabase.from("intensive_claim_submissions").update({ review_notified_at: notifiedAt }).eq("id", claimId);
  return { sent: true, notifiedAt };
}

export async function deliverEnrollmentEmail(enrollment: Enrollment, kind: string) {
  const supabase = adminClient();
  const { data: existing } = await supabase
    .from("intensive_email_events")
    .select("id,status,attempt_count,updated_at")
    .eq("enrollment_id", enrollment.id)
    .eq("email_kind", kind)
    .maybeSingle();
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
  if (existing) await supabase.from("intensive_email_events").update(record).eq("id", existing.id);
  else await supabase.from("intensive_email_events").insert(record);

  try {
    const email = kind === "onboarding" ? onboardingEmail(enrollment) : reminderEmail(enrollment, kind);
    const providerMessageId = await sendEmail(enrollment.purchaser_email, email.subject, email.html);
    await supabase.from("intensive_email_events").update({
      status: "sent",
      provider_message_id: providerMessageId,
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("enrollment_id", enrollment.id).eq("email_kind", kind);
    return { sent: true, providerMessageId };
  } catch (error) {
    await supabase.from("intensive_email_events").update({
      status: "failed",
      last_error: error instanceof Error ? error.message.slice(0, 1000) : "Unknown email error",
      updated_at: new Date().toISOString(),
    }).eq("enrollment_id", enrollment.id).eq("email_kind", kind);
    throw error;
  }
}
