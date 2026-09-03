export const PASS_KIND_PURCHASER = "purchaser" as const;
export const PASS_KIND_NAMED_SEAT = "named_seat" as const;

export type IntensivePassKind = typeof PASS_KIND_PURCHASER | typeof PASS_KIND_NAMED_SEAT;

export const INDIVIDUAL_PAYMENT_LINK = "plink_1U7n37JdDAUSVXbNG7XStxnN";
export const COMPANY_PAYMENT_LINK = "plink_1U7n39JdDAUSVXbNIreq7bTB";

export const RECOGNIZED_PURCHASER_PAYMENT_LINKS = [
  INDIVIDUAL_PAYMENT_LINK,
  COMPANY_PAYMENT_LINK,
] as const;

/** Paid buyers who must keep the live-claim form. Do not infer from seats. */
export const KNOWN_PURCHASER_ENROLLMENT_IDS = [
  "0049e7cd-e474-4805-88d5-0b337b4efd50", // Oliver Fernandez — company purchaser, seats=14
  "8e2693e4-342c-49ee-b955-701d97bf1d8d", // Sean McDevitt
  "86f7ea9c-891d-478e-91ca-65965703cfbf", // Michael Eargle
  "3e00e637-d285-473d-b362-2cd6c8e28dc7", // Kabir Bhagat
] as const;

export const NAMED_SEAT_PAYMENT_LINK = "manual_mckenzie_extra_seat";

export const CLAIM_ACTION_FORBIDDEN =
  "This attendee pass does not include live claim submission.";

export function isIntensivePassKind(value: unknown): value is IntensivePassKind {
  return value === PASS_KIND_PURCHASER || value === PASS_KIND_NAMED_SEAT;
}

export function enrollmentCanSubmitClaim(input: {
  pass_kind?: string | null;
  can_submit_claim?: boolean | null;
}): boolean {
  if (input.can_submit_claim === false) return false;
  if (input.pass_kind === PASS_KIND_NAMED_SEAT) return false;
  return true;
}

/**
 * Backfill / minting rule. Runtime portal access uses the stored pass_kind column.
 * Seats count is intentionally ignored: a purchaser can hold many seats.
 */
export function inferPassKindFromEnrollmentRow(row: {
  id?: string | null;
  stripe_payment_link_id?: string | null;
  stripe_checkout_session_id?: string | null;
}): IntensivePassKind {
  const id = String(row.id || "");
  const paymentLink = String(row.stripe_payment_link_id || "");
  const checkoutSession = String(row.stripe_checkout_session_id || "");

  if ((KNOWN_PURCHASER_ENROLLMENT_IDS as readonly string[]).includes(id)) {
    return PASS_KIND_PURCHASER;
  }
  if ((RECOGNIZED_PURCHASER_PAYMENT_LINKS as readonly string[]).includes(paymentLink)) {
    return PASS_KIND_PURCHASER;
  }
  if (
    paymentLink === NAMED_SEAT_PAYMENT_LINK ||
    paymentLink.startsWith("manual_") ||
    checkoutSession.startsWith("manual_")
  ) {
    return PASS_KIND_NAMED_SEAT;
  }
  return PASS_KIND_PURCHASER;
}

export function passKindFromPreviewFlag(preview: string | null | undefined): IntensivePassKind | null {
  if (preview === "named-seat") return PASS_KIND_NAMED_SEAT;
  if (preview === "1") return PASS_KIND_PURCHASER;
  return null;
}
