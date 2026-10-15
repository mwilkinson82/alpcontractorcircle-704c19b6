// Verified Stripe launch=delay_damages_intensive_2026_10, read September 30, 2026.
// Shared offer identity; enrollment is separately gated in October fulfillment.
// Do not infer a cohort from purchase time, amount, or the current date.
const octoberDelayPaymentLinks = new Set([
  "plink_1UBOioJdDAUSVXbNw0nBuTMh", // public individual / early
  "plink_1UBOiqJdDAUSVXbNnZaiIeFf", // public company / early
  "plink_1UBOiyJdDAUSVXbNxbJsnSJ7", // member individual / early
  "plink_1UBOiuJdDAUSVXbNulbGSceG", // member company / early
  "plink_1UBOjGJdDAUSVXbNt4u5wMHJ", // public individual / standard
  "plink_1UBOjHJdDAUSVXbNY01Rra5m", // public company / standard
  "plink_1UBOjIJdDAUSVXbNAOlmW5yY", // member individual / standard
  "plink_1UBOjJJdDAUSVXbNCcWckNyO", // member company / standard
]);

export function octoberDelayOffer(paymentLinkId: string | null | undefined) {
  if (!paymentLinkId || !octoberDelayPaymentLinks.has(paymentLinkId)) return null;
  const company = ["plink_1UBOiqJdDAUSVXbNnZaiIeFf", "plink_1UBOiuJdDAUSVXbNulbGSceG", "plink_1UBOjHJdDAUSVXbNY01Rra5m", "plink_1UBOjJJdDAUSVXbNCcWckNyO"].includes(paymentLinkId);
  const member = ["plink_1UBOiyJdDAUSVXbNxbJsnSJ7", "plink_1UBOiuJdDAUSVXbNulbGSceG", "plink_1UBOjIJdDAUSVXbNAOlmW5yY", "plink_1UBOjJJdDAUSVXbNCcWckNyO"].includes(paymentLinkId);
  return { cohort: "delay-2026-10", enrollmentType: company ? "company" : "individual", seats: company ? 2 : 1, audience: member ? "contractor_circle" : "public" } as const;
}

export const octoberDelaySessions = [
  { id: "october-2026-preserve", date: "2026-10-16", day: "Friday · October 16", time: "1:00–5:00 PM ET", title: "Preserve", detail: "Entitlement, notice, reservation of rights and the record.", start: "20261016T170000Z", end: "20261016T210000Z", startsAt: "2026-10-16T17:00:00Z", endsAt: "2026-10-16T21:00:00Z" },
  { id: "october-2026-prove-price", date: "2026-10-17", day: "Saturday · October 17", time: "9:00 AM–5:00 PM ET", title: "Prove + Price", detail: "CPM causation, concurrency, mitigation and damages. Includes a one-hour break.", start: "20261017T130000Z", end: "20261017T210000Z", startsAt: "2026-10-17T13:00:00Z", endsAt: "2026-10-17T21:00:00Z" },
  { id: "october-2026-build", date: "2026-10-18", day: "Sunday · October 18", time: "10:00 AM–1:00 PM ET", title: "Build", detail: "Claim assembly, red-team review and submission architecture.", start: "20261018T140000Z", end: "20261018T170000Z", startsAt: "2026-10-18T14:00:00Z", endsAt: "2026-10-18T17:00:00Z" },
];

export function delayConfirmationCohort(paymentLinkId: string | null | undefined) {
  if (!paymentLinkId || !octoberDelayPaymentLinks.has(paymentLinkId)) return null;
  // Schedule verified against the three October calendar events and landing source.
  // No October materials release was verified; the portal remains authoritative.
  return {
    dates: "October 16–18, 2026 · Live online",
    friday: "Friday, October 16 · 1:00–5:00 p.m. ET",
    saturday: "Saturday, October 17 · 9:00 a.m.–5:00 p.m. ET",
    sunday: "Sunday, October 18 · 10:00 a.m.–1:00 p.m. ET",
    materials: "October materials and live-room access details are pending confirmation.",
  };
}
