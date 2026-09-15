// Verified through the existing Stripe connection: both live links sell one seat
// of prod_VGF6PF6ysZKKtV (offer=cpm-intensive), at their own fixed amount.
//   public  plink_1UFijSJdDAUSVXbNu3vdGChq -> $1,997 (price_1UFibpJdDAUSVXbNO9Fwg6lf)
//   member  plink_1UG1VXJdDAUSVXbNxHMdIQYa -> $1,497 (price_1UG1VSJdDAUSVXbNZnSc0j89)
export const CPM_PAYMENT_LINK_ID = "plink_1UFijSJdDAUSVXbNu3vdGChq";
export const CPM_MEMBER_PAYMENT_LINK_ID = "plink_1UG1VXJdDAUSVXbNxHMdIQYa";

export type CpmSeat = { paymentLinkId: string; amountSubtotal: number; audience: "public" | "member" };
// Allowlist: a link is only valid paired with its own exact subtotal.
export const CPM_SEATS: readonly CpmSeat[] = [
  { paymentLinkId: CPM_PAYMENT_LINK_ID, amountSubtotal: 199700, audience: "public" },
  { paymentLinkId: CPM_MEMBER_PAYMENT_LINK_ID, amountSubtotal: 149700, audience: "member" },
];
export function cpmSeatForLink(value: unknown): CpmSeat | null {
  const id = objectId(value);
  return CPM_SEATS.find((seat) => seat.paymentLinkId === id) ?? null;
}

type Checkout = {
  id?: unknown; payment_link?: unknown; payment_intent?: unknown;
  livemode?: unknown; mode?: unknown; status?: unknown; payment_status?: unknown;
  currency?: unknown; amount_subtotal?: unknown; amount_total?: unknown;
  customer_details?: { email?: unknown; name?: unknown } | null; customer_email?: unknown;
};
export function objectId(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value && typeof value.id === "string") return value.id;
  return null;
}
export function paidCpmPurchase(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const s = value as Checkout;
  const seat = cpmSeatForLink(s.payment_link);
  if (!seat) return false;
  return validSessionId(s.id) &&
    Boolean(objectId(s.payment_intent)?.startsWith("pi_")) &&
    s.livemode === true && s.mode === "payment" && s.status === "complete" &&
    s.payment_status === "paid" && s.currency === "usd" &&
    s.amount_subtotal === seat.amountSubtotal &&
    typeof s.amount_total === "number" && s.amount_total >= seat.amountSubtotal &&
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
