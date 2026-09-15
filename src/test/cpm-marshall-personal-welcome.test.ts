import { describe, expect, it, vi } from "vitest";
import {
  enqueueMarshallPersonalWelcome,
  MARSHALL_PERSONAL_WELCOME_SUBJECT,
  marshallPersonalWelcomeText,
  personalWelcomeFirstName,
} from "../../supabase/functions/_shared/cpm-marshall-personal-welcome";

const enrollment = { id: "e1", purchaser_email: "buyer@example.com", purchaser_name: "Phil Rodriguez" };

function db(autoFlag: boolean, upsert = vi.fn().mockResolvedValue({ error: null })) {
  const from = vi.fn((table: string) => {
    if (table === "cpm_intensive_settings") {
      return { select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: { marshall_personal_welcome_auto: autoFlag }, error: null }) }) }) };
    }
    return {
      select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }) }),
      upsert,
    };
  });
  return { client: { from }, from, upsert };
}

describe("Marshall's personal CPM welcome", () => {
  it("greets by first name with an em dash and keeps the exact subject", () => {
    expect(marshallPersonalWelcomeText(enrollment).startsWith("Phil — ")).toBe(true);
    expect(personalWelcomeFirstName(null)).toBe("there");
    expect(personalWelcomeFirstName("  ")).toBe("there");
    expect(MARSHALL_PERSONAL_WELCOME_SUBJECT).toBe("Welcome to the ALP CPM Schedule Intensive");
  });

  it("writes nothing while the auto flag is off", async () => {
    const { client, upsert } = db(false);
    expect(await enqueueMarshallPersonalWelcome(client, enrollment)).toEqual({ skipped: true, reason: "flag_off" });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("queues one pending row when the flag is on", async () => {
    const { client, upsert } = db(true);
    expect(await enqueueMarshallPersonalWelcome(client, enrollment)).toEqual({ queued: true });
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ enrollment_id: "e1", email_kind: "marshall_personal_welcome", status: "pending" }),
      { onConflict: "enrollment_id,email_kind" },
    );
  });
});
