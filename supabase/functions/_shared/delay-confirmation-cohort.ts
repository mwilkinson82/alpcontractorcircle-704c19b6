// Presentation only: verified Stripe launch=delay_damages_intensive_2026_10,
// read September 30, 2026. Does not enroll buyers or authorize portal access.
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

export function delayConfirmationCohort(paymentLinkId: string | null | undefined) {
  if (!paymentLinkId || !octoberDelayPaymentLinks.has(paymentLinkId)) return null;
  // Schedule verified against the three October calendar events and landing source.
  // No October materials release was verified; the portal remains authoritative.
  return {
    dates: "October 16–18, 2026 · Live online",
    friday: "Friday, October 16 · 1:00–5:00 p.m. ET",
    saturday: "Saturday, October 17 · 9:00 a.m.–5:00 p.m. ET",
    sunday: "Sunday, October 18 · 10:00 a.m.–1:00 p.m. ET",
    materials: "Check your private attendee portal for material availability and live room access.",
  };
}
