export type IntensiveAudience = "public" | "contractor_circle";
export type IntensiveTicketType = "individual" | "company";
export type IntensiveFunnelEvent = "landing_view" | "checkout_started";

const VISITOR_STORAGE_KEY = "alp.delay-intensive.visitor";
const SESSION_STORAGE_KEY = "alp.delay-intensive.session";
const CAMPAIGN = "delay_intensive_2026";

function storedUuid(storage: Storage, key: string) {
  const existing = storage.getItem(key);
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  const created = crypto.randomUUID();
  storage.setItem(key, created);
  return created;
}

export function visitorId() {
  try {
    return storedUuid(window.localStorage, VISITOR_STORAGE_KEY);
  } catch {
    return crypto.randomUUID();
  }
}

export function funnelSessionId() {
  try {
    return storedUuid(window.sessionStorage, SESSION_STORAGE_KEY);
  } catch {
    return crypto.randomUUID();
  }
}

export function checkoutReference(
  audience: IntensiveAudience,
  ticketType: IntensiveTicketType,
  visitor: string,
  session: string,
) {
  return [
    "di",
    audience,
    ticketType,
    "v",
    visitor.replaceAll("-", ""),
    "s",
    session.replaceAll("-", ""),
  ].join("_");
}

export function buildAttributedCheckoutUrl({
  base,
  promoCode,
  audience,
  ticketType,
  visitor,
  session,
}: {
  base: string;
  promoCode?: string;
  audience: IntensiveAudience;
  ticketType: IntensiveTicketType;
  visitor: string;
  session: string;
}) {
  const url = new URL(base);
  if (promoCode) url.searchParams.set("prefilled_promo_code", promoCode);
  url.searchParams.set(
    "client_reference_id",
    checkoutReference(audience, ticketType, visitor, session),
  );
  url.searchParams.set(
    "utm_source",
    audience === "contractor_circle" ? "contractor_circle_hub" : "alp_landing_page",
  );
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", CAMPAIGN);
  url.searchParams.set("utm_content", `${audience}_${ticketType}`);
  return url.toString();
}

function referrerHost() {
  if (!document.referrer) return null;
  try {
    return new URL(document.referrer).hostname.slice(0, 253) || null;
  } catch {
    return null;
  }
}

export function trackIntensiveEvent(
  eventType: IntensiveFunnelEvent,
  audience: IntensiveAudience,
  ticketType?: IntensiveTicketType,
) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return Promise.resolve();
  return fetch(`${supabaseUrl}/functions/v1/delay-intensive-track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      event_type: eventType,
      audience_channel: audience,
      enrollment_type: ticketType || null,
      visitor_id: visitorId(),
      session_id: funnelSessionId(),
      page_path: window.location.pathname,
      referrer_host: referrerHost(),
    }),
  }).then(() => undefined).catch(() => undefined);
}
