import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.1";
import { releasedAt, validAccessToken, validSessionId } from "./validation.ts";
import { publicCpmSessions } from "../_shared/cpm-intensive-sessions.ts";

const allowedOrigins = new Set([
  "https://alpcontractorcircle.com", "https://www.alpcontractorcircle.com",
  "https://id-preview--ca1f5675-9834-495b-9938-9a3834ec894f.lovable.app",
  "https://ca1f5675-9834-495b-9938-9a3834ec894f.lovableproject.com",
  "http://127.0.0.1:8080", "http://localhost:8080",
]);

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = {
    "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://alpcontractorcircle.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  };
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (origin && !allowedOrigins.has(origin)) return json({ error: "Origin not allowed." }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);
  try {
    const raw = await req.text();
    if (raw.length > 2048) return json({ error: "Request too large." }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ error: "Invalid request." }, 400); }
    if (!body || body.action !== "get") return json({ error: "Invalid request." }, 400);
    // A fresh Stripe return always wins over any cached or supplied token.
    const hasSession = Object.prototype.hasOwnProperty.call(body, "session_id");
    if (hasSession ? !validSessionId(body.session_id) : !validAccessToken(body.access)) {
      return json({ error: "Open your personal CPM attendee link or return from your completed checkout." }, 401);
    }
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    const query = db.from("cpm_intensive_enrollments").select("*");
    const { data: existing, error: lookupError } = await (hasSession
      ? query.eq("stripe_checkout_session_id", body.session_id)
      : query.eq("access_token", body.access)).maybeSingle();
    if (lookupError) throw lookupError;
    if (!existing) return json({ error: hasSession ? "Your payment confirmation is still arriving. Please try again shortly." : "This personal pass is not valid. Use your original CPM purchase return link.", code: hasSession ? "enrollment_pending" : "invalid_pass" }, hasSession ? 409 : 401);
    const enrollment = existing;
    const { data: block, error: blockError } = await db.from("cpm_intensive_payment_blocks").select("stripe_payment_intent_id").eq("stripe_payment_intent_id", enrollment.stripe_payment_intent_id).maybeSingle();
    if (blockError) throw blockError;
    if (enrollment.revoked_at || block) return json({ error: "This attendee pass is no longer active. Contact ALP for help." }, 403);
    const { data: settings, error: settingsError } = await db.from("cpm_intensive_settings").select("*").eq("id", 1).single();
    if (settingsError) throw settingsError;
    const released = releasedAt(settings.materials_release_at);
    const files = [];
    if (released) {
      const { data: materials, error } = await db.from("cpm_intensive_materials").select("id,title,description,storage_path,release_at").eq("is_published", true).order("sort_order");
      if (error) throw error;
      for (const file of materials || []) {
        if (file.release_at && !releasedAt(file.release_at)) continue;
        const signed = await db.storage.from("cpm-intensive-materials").createSignedUrl(file.storage_path, 900);
        if (signed.error || !signed.data?.signedUrl) throw signed.error || new Error("Missing download URL");
        files.push({ id: file.id, title: file.title, description: file.description, url: signed.data.signedUrl });
      }
    }
    return json({
      access: enrollment.access_token,
      attendee: { name: enrollment.purchaser_name, email: enrollment.purchaser_email, ticket_number: `CPM-${enrollment.id.slice(0, 8).toUpperCase()}` },
      schedule: { dates_label: settings.dates_label, timezone: settings.timezone, hours: "10 a.m.–5 p.m. each day", meet_url: null, sessions: publicCpmSessions(settings.sessions) },
      materials: { released, release_at: settings.materials_release_at, files },
    });
  } catch {
    return json({ error: "Your attendee portal is temporarily unavailable. Please retry in a moment." }, 503);
  }
});
