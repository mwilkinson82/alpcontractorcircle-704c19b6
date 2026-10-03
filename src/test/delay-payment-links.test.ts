import { describe, expect, it } from "vitest";
import {
  ACCEPTED_DELAY_PAYMENT_LINKS,
  COMPANY_PAYMENT_LINK,
  COMPANY_PAYMENT_LINKS,
  INDIVIDUAL_PAYMENT_LINK,
  INDIVIDUAL_PAYMENT_LINKS,
  delayEnrollmentType,
} from "../../supabase/functions/_shared/delay-payment-links";

const STANDARD = {
  publicIndividual: "plink_1UBOjGJdDAUSVXbNt4u5wMHJ",
  publicCompany: "plink_1UBOjHJdDAUSVXbNY01Rra5m",
  memberIndividual: "plink_1UBOjIJdDAUSVXbNAOlmW5yY",
  memberCompany: "plink_1UBOjJJdDAUSVXbNCcWckNyO",
} as const;

const EARLY = [
  "plink_1UBOioJdDAUSVXbNw0nBuTMh",
  "plink_1UBOiqJdDAUSVXbNnZaiIeFf",
  "plink_1UBOiuJdDAUSVXbNulbGSceG",
  "plink_1UBOiyJdDAUSVXbNxbJsnSJ7",
] as const;

describe("Delay payment link acceptance", () => {
  it("keeps the original links and accepts early plus standard links", () => {
    expect(ACCEPTED_DELAY_PAYMENT_LINKS).toEqual(expect.arrayContaining([
      INDIVIDUAL_PAYMENT_LINK,
      COMPANY_PAYMENT_LINK,
      ...EARLY,
      ...Object.values(STANDARD),
    ]));
    expect(new Set(ACCEPTED_DELAY_PAYMENT_LINKS).size).toBe(ACCEPTED_DELAY_PAYMENT_LINKS.length);
    expect(ACCEPTED_DELAY_PAYMENT_LINKS).toHaveLength(10);
  });

  it("maps individual links to one seat and company links to two", () => {
    for (const id of INDIVIDUAL_PAYMENT_LINKS) {
      expect(delayEnrollmentType(id)).toBe("individual");
    }
    for (const id of COMPANY_PAYMENT_LINKS) {
      expect(delayEnrollmentType(id)).toBe("company");
    }
    expect(delayEnrollmentType(STANDARD.publicIndividual)).toBe("individual");
    expect(delayEnrollmentType(STANDARD.memberIndividual)).toBe("individual");
    expect(delayEnrollmentType(STANDARD.publicCompany)).toBe("company");
    expect(delayEnrollmentType(STANDARD.memberCompany)).toBe("company");
    expect(delayEnrollmentType("plink_unrelated")).toBeNull();
    expect(delayEnrollmentType(null)).toBeNull();
  });
});
