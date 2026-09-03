import { describe, expect, it } from "vitest";
import {
  CLAIM_ACTION_FORBIDDEN,
  COMPANY_PAYMENT_LINK,
  INDIVIDUAL_PAYMENT_LINK,
  KNOWN_PURCHASER_ENROLLMENT_IDS,
  NAMED_SEAT_PAYMENT_LINK,
  enrollmentCanSubmitClaim,
  inferPassKindFromEnrollmentRow,
  passKindFromPreviewFlag,
} from "@/lib/intensive-pass";
import { buildPreviewPortalState } from "@/lib/intensive-portal";

describe("Intensive pass classification", () => {
  it("keeps Oliver as a purchaser even though seats=14", () => {
    expect(inferPassKindFromEnrollmentRow({
      id: "0049e7cd-e474-4805-88d5-0b337b4efd50",
      stripe_payment_link_id: INDIVIDUAL_PAYMENT_LINK,
      stripe_checkout_session_id: "cs_live_b1zqXudMn22a5mNMAV7t3y6Lm1ismTVIJ8joFwz0IfipXiDQa9iat525kC",
    })).toBe("purchaser");
    expect(enrollmentCanSubmitClaim({ pass_kind: "purchaser" })).toBe(true);
  });

  it("keeps the four known buyers claim-enabled", () => {
    for (const id of KNOWN_PURCHASER_ENROLLMENT_IDS) {
      expect(inferPassKindFromEnrollmentRow({ id })).toBe("purchaser");
    }
  });

  it("treats recognized Stripe payment links as purchaser", () => {
    expect(inferPassKindFromEnrollmentRow({
      stripe_payment_link_id: INDIVIDUAL_PAYMENT_LINK,
    })).toBe("purchaser");
    expect(inferPassKindFromEnrollmentRow({
      stripe_payment_link_id: COMPANY_PAYMENT_LINK,
    })).toBe("purchaser");
  });

  it("classifies synthetic extra-seat rows as named-seat", () => {
    expect(inferPassKindFromEnrollmentRow({
      id: "a6ab27b4-876a-4288-9fd9-99d2fb08a628",
      stripe_payment_link_id: NAMED_SEAT_PAYMENT_LINK,
      stripe_checkout_session_id: "manual_mckenzie_zachary_worsley_20260903",
    })).toBe("named_seat");
    expect(enrollmentCanSubmitClaim({ pass_kind: "named_seat" })).toBe(false);
    expect(enrollmentCanSubmitClaim({ can_submit_claim: false })).toBe(false);
  });

  it("defaults missing columns to purchaser so existing tokens stay claim-enabled", () => {
    expect(enrollmentCanSubmitClaim({})).toBe(true);
    expect(enrollmentCanSubmitClaim({ pass_kind: null, can_submit_claim: null })).toBe(true);
    expect(inferPassKindFromEnrollmentRow({
      stripe_payment_link_id: "qa_attendee_preview",
      stripe_checkout_session_id: "cs_live_attendee_preview_marshall_20260824",
    })).toBe("purchaser");
  });

  it("does not hide claim from the default preview flag", () => {
    expect(passKindFromPreviewFlag("1")).toBe("purchaser");
    expect(passKindFromPreviewFlag("named-seat")).toBe("named_seat");
    expect(passKindFromPreviewFlag(null)).toBeNull();
    expect(buildPreviewPortalState("purchaser").can_submit_claim).toBe(true);
    expect(buildPreviewPortalState("named_seat").can_submit_claim).toBe(false);
  });

  it("documents the server reject copy for named-seat POSTs", () => {
    expect(CLAIM_ACTION_FORBIDDEN).toMatch(/does not include live claim submission/i);
  });
});
