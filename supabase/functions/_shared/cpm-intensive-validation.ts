// Live Stripe catalog for ALP CPM Schedule Intensive (2-Day), $1,997 one-time.
// Verified read-only on acct_1HPL9DJdDAUSVXbN: these IDs are the named intensive,
// not a Custom product. The hosted payment link remains the default checkout path.
export const CPM_PAYMENT_LINK_ID = "plink_1UFijSJdDAUSVXbNu3vdGChq";
export const CPM_PRODUCT_ID = "prod_VGF6PF6ysZKKtV";
export const CPM_PRICE_ID = "price_1UFibpJdDAUSVXbNO9Fwg6lf";
export const CPM_OFFER = "cpm_schedule_intensive";
export const PRODUCT_MAP = {
  [CPM_PRODUCT_ID]: CPM_OFFER,
  [CPM_PRICE_ID]: CPM_OFFER,
} as const;

type Checkout = {
  id?: unknown; payment_link?: unknown; payment_intent?: unknown;
  livemode?: unknown; mode?: unknown; status?: unknown; payment_status?: unknown;
  currency?: unknown; amount_subtotal?: unknown; amount_total?: unknown;
  customer_details?: { email?: unknown; name?: unknown } | null; customer_email?: unknown;
  line_items?: { data?: unknown } | null;
};

export function objectId(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value && typeof value.id === "string") return value.id;
  return null;
}

function mappedOffer(id: string | null): string | null {
  return id && id in PRODUCT_MAP ? PRODUCT_MAP[id as keyof typeof PRODUCT_MAP] : null;
}

export function catalogOffer(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const items = (value as Checkout).line_items?.data;
  if (!Array.isArray(items) || items.length === 0) return null;
  const offers = new Set<string>();
  for (const item of items) {
    if (!item || typeof item !== "object") return "unmapped";
    const price = "price" in item ? (item as { price?: unknown }).price : undefined;
    const product = price && typeof price === "object" && "product" in price
      ? (price as { product?: unknown }).product
      : "product" in item ? (item as { product?: unknown }).product : undefined;
    const offer = mappedOffer(objectId(price)) || mappedOffer(objectId(product));
    if (!offer) return "unmapped";
    offers.add(offer);
  }
  return offers.size === 1 ? [...offers][0] : "unmapped";
}

export function isCpmCheckout(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const offer = catalogOffer(value);
  if (offer && offer !== CPM_OFFER) return false;
  return objectId((value as Checkout).payment_link) === CPM_PAYMENT_LINK_ID || offer === CPM_OFFER;
}

export function paidCpmPurchase(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const s = value as Checkout;
  return validSessionId(s.id) && isCpmCheckout(s) &&
    Boolean(objectId(s.payment_intent)?.startsWith("pi_")) &&
    s.livemode === true && s.mode === "payment" && s.status === "complete" &&
    s.payment_status === "paid" && s.currency === "usd" && s.amount_subtotal === 199700 &&
    typeof s.amount_total === "number" && s.amount_total >= 199700 &&
    typeof (s.customer_details?.email || s.customer_email) === "string" &&
    Boolean(String(s.customer_details?.email || s.customer_email).trim());
}
export function paymentBlockReason(type: string, object: { refunded?: boolean; amount_refunded?: number }): "refunded" | "disputed" | null {
  if (type === "charge.dispute.created") return "disputed";
  if (type === "charge.refunded" && (object.refunded === true || (object.amount_refunded || 0) > 0)) return "refunded";
  return null;
}
export function validSessionId(value: unknown): value is string {
  return typeof value === "string" && /^cs_live_[A-Za-z0-9]{20,240}$/.test(value);
}
export function validAccessToken(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}
export function releasedAt(value: string | null, now = Date.now()): boolean {
  return Boolean(value && Number.isFinite(Date.parse(value)) && Date.parse(value) <= now);
}
