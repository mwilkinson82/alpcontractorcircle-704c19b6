import { describe, expect, it } from "vitest";
import { CPM_PORTAL_URL, cpmWelcomeEmail } from "../../supabase/functions/_shared/cpm-intensive-email";

const enrollment = {
  id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  access_token: "f".repeat(64),
  purchaser_email: "attendee@example.com",
  purchaser_name: "Jordan Attendee",
};

describe("CPM welcome mailer", () => {
  it("points only at the CPM onboarding portal with the personal access token", () => {
    const email = cpmWelcomeEmail(enrollment, { dates_label: "September 25–26, 2026", timezone: "America/New_York" });
    expect(email.subject).toBe("Your ALP CPM Intensive attendee portal");
    expect(email.html).toContain(`${CPM_PORTAL_URL}?access=${"f".repeat(64)}`);
    expect(email.html).toContain("/cpm-intensive/onboarding");
    expect(email.html).toContain("ALP CPM Schedule Intensive (2-Day)");
    expect(email.html).toContain("$1,997");
    expect(email.html).toContain("September 25–26, 2026");
    expect(email.html).toContain("Jordan");
    expect(email.html).not.toContain("delay-intensive");
    expect(email.html).not.toContain("Delay &amp; Damages");
    expect(email.html).not.toContain("Custom");
    expect(email.html).not.toContain("buy.stripe.com");
  });
});
