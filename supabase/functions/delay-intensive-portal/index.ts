import {
  CORS_HEADERS,
  adminClient,
  findPaidEnrollment,
  json,
  notifyMarshallOfClaim,
  safeFileName,
  ticketNumber,
  type Enrollment,
} from "../_shared/intensive.ts";

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "text/plain",
  "text/csv",
  "application/octet-stream",
]);

function accessFromRequest(request: Request, body: Record<string, any>) {
  const header = request.headers.get("authorization") || "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  return String(body.access || bearer || "").trim();
}

async function resolveEnrollment(request: Request, body: Record<string, any>) {
  const access = accessFromRequest(request, body);
  if (access) return findPaidEnrollment(access);
  const sessionId = String(body.session_id || "").trim();
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId)) return null;
  const { data, error } = await adminClient()
    .from("intensive_enrollments")
    .select("*")
    .eq("stripe_checkout_session_id", sessionId)
    .eq("payment_status", "paid")
    .maybeSingle();
  if (error) throw error;
  return data as Enrollment | null;
}

async function portalState(enrollment: Enrollment) {
  const supabase = adminClient();
  const now = new Date();
  const materialsReleased = now >= new Date(enrollment.materials_release_at);
  const [{ data: claim }, { data: materials }] = await Promise.all([
    supabase
      .from("intensive_claim_submissions")
      .select("id,project_name,claim_stage,created_at,selected_for_live_dissection")
      .eq("enrollment_id", enrollment.id)
      .eq("submitted_via_portal", true)
      .maybeSingle(),
    materialsReleased
      ? supabase
          .from("intensive_materials")
          .select("id,title,description,storage_path,sort_order")
          .eq("is_published", true)
          .order("sort_order")
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const signedMaterials = [];
  if (materialsReleased) {
    for (const material of materials || []) {
      const { data } = await supabase.storage.from("intensive-materials").createSignedUrl(material.storage_path, 1800);
      if (data?.signedUrl) signedMaterials.push({
        id: material.id,
        title: material.title,
        description: material.description,
        url: data.signedUrl,
      });
    }
  }

  return {
    access: enrollment.access_token,
    attendee: {
      email: enrollment.purchaser_email,
      name: enrollment.purchaser_name,
      company_name: enrollment.company_name,
      attendee_names: Array.isArray((enrollment as any).attendee_names) ? (enrollment as any).attendee_names : [],
      phone: (enrollment as any).phone,
      preparation_notes: (enrollment as any).preparation_notes,
      enrollment_type: enrollment.enrollment_type,
      seats: enrollment.seats,
      ticket_number: ticketNumber(enrollment),
      onboarding_completed_at: enrollment.onboarding_completed_at,
    },
    claim: claim || null,
    materials: {
      released: materialsReleased,
      release_at: enrollment.materials_release_at,
      files: signedMaterials,
      zoom_url: materialsReleased ? Deno.env.get("INTENSIVE_ZOOM_URL") || null : null,
    },
  };
}

async function completeOnboarding(enrollment: Enrollment, body: Record<string, any>) {
  const attendeeNames = Array.isArray(body.attendee_names)
    ? body.attendee_names.map((value: unknown) => String(value).trim()).filter(Boolean)
    : [];
  if (attendeeNames.length !== enrollment.seats || attendeeNames.some((name: string) => name.length < 2 || name.length > 120)) {
    return json({ error: `Enter exactly ${enrollment.seats} attendee ${enrollment.seats === 1 ? "name" : "names"}.` }, 400);
  }
  const companyName = String(body.company_name || "").trim();
  const phone = String(body.phone || "").trim();
  const preparationNotes = String(body.preparation_notes || "").trim();
  if (companyName.length < 2 || companyName.length > 160 || phone.length > 50 || preparationNotes.length > 1500) {
    return json({ error: "Review the company, phone, and preparation fields." }, 400);
  }
  const completedAt = new Date().toISOString();
  const { error } = await adminClient().from("intensive_enrollments").update({
    attendee_names: attendeeNames,
    company_name: companyName,
    phone: phone || null,
    preparation_notes: preparationNotes || null,
    onboarding_completed_at: completedAt,
    updated_at: completedAt,
  }).eq("id", enrollment.id);
  if (error) throw error;
  return json({ ok: true, onboarding_completed_at: completedAt });
}

async function createUpload(enrollment: Enrollment, body: Record<string, any>) {
  const originalName = String(body.name || "").trim();
  const mimeType = String(body.type || "application/octet-stream").trim().toLowerCase();
  const size = Number(body.size || 0);
  if (!originalName || originalName.length > 240 || !allowedMimeTypes.has(mimeType)) {
    return json({ error: "That file type is not accepted. Use PDF, Word, Excel, CSV, text, ZIP, XER, or MPP." }, 400);
  }
  if (!Number.isFinite(size) || size <= 0 || size > 26_214_400) {
    return json({ error: "Each file must be 25 MB or smaller." }, 400);
  }
  const path = `${enrollment.id}/${crypto.randomUUID()}-${safeFileName(originalName)}`;
  const { data, error } = await adminClient().storage.from("intensive-claim-files").createSignedUploadUrl(path);
  if (error || !data) throw error || new Error("Unable to create a secure upload URL.");
  return json({
    path,
    token: data.token,
    signed_url: data.signedUrl,
    attachment: { storage_path: path, original_name: originalName, mime_type: mimeType, size_bytes: size },
  });
}

async function submitClaim(enrollment: Enrollment, body: Record<string, any>) {
  const text = (key: string, max: number) => String(body[key] || "").trim().slice(0, max);
  const projectName = text("project_name", 200);
  const claimStage = text("claim_stage", 40);
  const amountAtIssue = text("amount_at_issue", 80) || null;
  const claimSummary = text("claim_summary", 3000);
  const recordsAvailable = text("records_available", 1500);
  const redactionNotes = text("redaction_notes", 1000) || null;
  const discussionPermission = body.discussion_permission === true;
  const stages = new Set(["active-delay", "notice-preparation", "claim-development", "submitted", "disputed", "other"]);
  if (projectName.length < 2 || !stages.has(claimStage) || claimSummary.length < 40 || recordsAvailable.length < 10 || !discussionPermission) {
    return json({ error: "Complete the claim outline and discussion permission before submitting." }, 400);
  }
  const attachments = Array.isArray(body.attachments) ? body.attachments.slice(0, 5) : [];
  for (const attachment of attachments) {
    if (!String(attachment.storage_path || "").startsWith(`${enrollment.id}/`) ||
        !allowedMimeTypes.has(String(attachment.mime_type || "").toLowerCase()) ||
        Number(attachment.size_bytes || 0) > 26_214_400) {
      return json({ error: "One or more claim attachments did not pass validation." }, 400);
    }
  }

  const supabase = adminClient();
  const { data: claim, error } = await supabase.from("intensive_claim_submissions").insert({
    enrollment_id: enrollment.id,
    purchaser_email: enrollment.purchaser_email,
    submitter_name: (enrollment as any).attendee_names?.[0] || enrollment.purchaser_name || "Registered attendee",
    company_name: enrollment.company_name || "Registered company",
    project_name: projectName,
    claim_stage: claimStage,
    amount_at_issue: amountAtIssue,
    claim_summary: claimSummary,
    records_available: recordsAvailable,
    redaction_notes: redactionNotes,
    discussion_permission: true,
    purchase_status: "verified",
    submitted_via_portal: true,
  }).select("id,created_at").single();
  if (error) {
    if (error.code === "23505") return json({ error: "This enrollment has already submitted a live claim candidate." }, 409);
    throw error;
  }

  if (attachments.length > 0) {
    const { error: attachmentError } = await supabase.from("intensive_claim_attachments").insert(
      attachments.map((attachment: Record<string, any>) => ({
        enrollment_id: enrollment.id,
        claim_submission_id: claim.id,
        storage_path: attachment.storage_path,
        original_name: String(attachment.original_name || "claim-file").slice(0, 240),
        mime_type: String(attachment.mime_type),
        size_bytes: Number(attachment.size_bytes),
      })),
    );
    if (attachmentError) throw attachmentError;
  }
  try {
    await notifyMarshallOfClaim(claim.id);
  } catch (notificationError) {
    console.error("Claim saved but review notification failed", notificationError);
  }
  try {
    await deliverClaimSubmissionReceipt(claim.id);
  } catch (receiptError) {
    console.error("Claim saved but attendee receipt failed", receiptError);
  }
  return json({ ok: true, claim });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  try {
    const body = await request.json();
    const enrollment = await resolveEnrollment(request, body);
    if (!enrollment) {
      const status = body.session_id ? 425 : 401;
      return json({ error: body.session_id ? "Payment confirmation is still arriving. Try again in a few seconds." : "This attendee link is invalid or no longer active." }, status);
    }
    const action = String(body.action || "get");
    if (action === "get") return json(await portalState(enrollment));
    if (action === "complete_onboarding") return completeOnboarding(enrollment, body);
    if (action === "create_upload") return createUpload(enrollment, body);
    if (action === "submit_claim") return submitClaim(enrollment, body);
    return json({ error: "Unknown portal action." }, 400);
  } catch (error) {
    console.error("delay-intensive-portal", error);
    return json({ error: "The attendee portal could not complete that request." }, 500);
  }
});
