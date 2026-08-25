import { adminClient, CORS_HEADERS, json } from "../_shared/intensive.ts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CHANNELS = new Set(["public", "contractor_circle"]);
const EVENTS = new Set(["landing_view", "checkout_started"]);
const TICKET_TYPES = new Set(["individual", "company"]);
const PAGE_PATHS = new Set(["/delay-intensive", "/delay-intensive/member"]);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const payload = await request.json();
    const eventType = String(payload.event_type || "");
    const channel = String(payload.audience_channel || "");
    const ticketType = payload.enrollment_type
      ? String(payload.enrollment_type)
      : null;
    const visitorId = String(payload.visitor_id || "");
    const sessionId = String(payload.session_id || "");
    const pagePath = String(payload.page_path || "");
    const referrerHost = payload.referrer_host
      ? String(payload.referrer_host).slice(0, 253)
      : null;

    if (
      !EVENTS.has(eventType) ||
      !CHANNELS.has(channel) ||
      !UUID.test(visitorId) ||
      !UUID.test(sessionId) ||
      !PAGE_PATHS.has(pagePath) ||
      (eventType === "landing_view" && ticketType !== null) ||
      (eventType === "checkout_started" && !TICKET_TYPES.has(ticketType || ""))
    ) {
      return json({ error: "Invalid funnel event." }, 400);
    }

    const { error } = await adminClient().from("intensive_funnel_events").insert({
      event_type: eventType,
      audience_channel: channel,
      enrollment_type: ticketType,
      visitor_id: visitorId,
      session_id: sessionId,
      page_path: pagePath,
      referrer_host: referrerHost,
    });
    if (error && error.code !== "23505") throw error;

    return json({ recorded: true });
  } catch (error) {
    console.error("delay-intensive-track", error);
    return json({ error: "Unable to record funnel event." }, 500);
  }
});
