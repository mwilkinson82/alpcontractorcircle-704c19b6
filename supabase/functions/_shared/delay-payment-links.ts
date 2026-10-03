export const INDIVIDUAL_PAYMENT_LINK = "plink_1U7n37JdDAUSVXbNG7XStxnN";
export const COMPANY_PAYMENT_LINK = "plink_1U7n39JdDAUSVXbNIreq7bTB";

/** One named attendee. Original link, plus the early and standard public/member links. */
export const INDIVIDUAL_PAYMENT_LINKS = [
  INDIVIDUAL_PAYMENT_LINK,
  "plink_1UBOioJdDAUSVXbNw0nBuTMh",
  "plink_1UBOiyJdDAUSVXbNxbJsnSJ7",
  "plink_1UBOjGJdDAUSVXbNt4u5wMHJ",
  "plink_1UBOjIJdDAUSVXbNAOlmW5yY",
] as const;

/** Two named attendees from the same company. */
export const COMPANY_PAYMENT_LINKS = [
  COMPANY_PAYMENT_LINK,
  "plink_1UBOiqJdDAUSVXbNnZaiIeFf",
  "plink_1UBOiuJdDAUSVXbNulbGSceG",
  "plink_1UBOjHJdDAUSVXbNY01Rra5m",
  "plink_1UBOjJJdDAUSVXbNCcWckNyO",
] as const;

export const ACCEPTED_DELAY_PAYMENT_LINKS = [
  ...INDIVIDUAL_PAYMENT_LINKS,
  ...COMPANY_PAYMENT_LINKS,
] as const;

export type DelayEnrollmentType = "individual" | "company";

export function delayEnrollmentType(paymentLinkId: string | null | undefined): DelayEnrollmentType | null {
  if (typeof paymentLinkId !== "string") return null;
  if (COMPANY_PAYMENT_LINKS.some((id) => id === paymentLinkId)) return "company";
  if (INDIVIDUAL_PAYMENT_LINKS.some((id) => id === paymentLinkId)) return "individual";
  return null;
}
