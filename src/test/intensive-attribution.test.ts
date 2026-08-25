import { describe, expect, it } from "vitest";
import {
  buildAttributedCheckoutUrl,
  checkoutReference,
} from "@/lib/intensive-attribution";

const visitor = "8d286d60-cf95-4a30-b37a-2e929a351f67";
const session = "b22a85a8-7d0d-4f25-a421-7e6fd81661b2";

describe("Intensive checkout attribution", () => {
  it("creates a Stripe-safe client reference", () => {
    expect(checkoutReference("contractor_circle", "company", visitor, session)).toBe(
      "di_contractor_circle_company_v_8d286d60cf954a30b37a2e929a351f67_s_b22a85a87d0d4f25a4217e6fd81661b2",
    );
  });

  it("preserves the member discount and adds campaign attribution", () => {
    const url = new URL(buildAttributedCheckoutUrl({
      base: "https://book.stripe.com/example",
      promoCode: "CIRCLE2000",
      audience: "contractor_circle",
      ticketType: "individual",
      visitor,
      session,
    }));

    expect(url.searchParams.get("prefilled_promo_code")).toBe("CIRCLE2000");
    expect(url.searchParams.get("client_reference_id")).toContain(
      "di_contractor_circle_individual",
    );
    expect(url.searchParams.get("utm_source")).toBe("contractor_circle_hub");
    expect(url.searchParams.get("utm_content")).toBe(
      "contractor_circle_individual",
    );
  });
});
