import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleCpmEvent as dispatchCpmEvent } from "../../supabase/functions/_shared/cpm-intensive";
import { CPM_PAYMENT_LINK_ID } from "../../supabase/functions/cpm-intensive-portal/validation";
const upsert = vi.fn();
const maybeSingle = vi.fn();
const from = vi.fn();
const deliverWelcome = vi.fn(async () => ({ sent: true, providerMessageId: "re_test" }));
const enrollment = {
  id: "enr_1",
  access_token: "a".repeat(64),
  purchaser_email: "attendee@example.com",
  purchaser_name: "Attendee",
  stripe_checkout_session_id: "cs_live_" + "a".repeat(32),
  revoked_at: null,
};
const handleCpmEvent = (event: Parameters<typeof dispatchCpmEvent>[0]) =>
  dispatchCpmEvent(event, {
    adminClient: () => ({ from }),
    randomToken: () => "a".repeat(64),
    deliverWelcome,
  });
const paidEvent = () => ({
  livemode: true,
  type: "checkout.session.completed",
  data: {
    object: {
      id: "cs_live_" + "a".repeat(32),
      payment_link: CPM_PAYMENT_LINK_ID,
      payment_intent: "pi_cpm",
      livemode: true,
      mode: "payment",
      status: "complete",
      payment_status: "paid",
      currency: "usd",
      amount_subtotal: 199700,
      amount_total: 199700,
      customer_details: { email: "attendee@example.com", name: "Attendee" },
    },
  },
});
beforeEach(() => {
  vi.clearAllMocks();
  maybeSingle
    .mockResolvedValueOnce({ data: null, error: null }) // payment block lookup
    .mockResolvedValueOnce({ data: enrollment, error: null }); // enrollment load
  upsert.mockResolvedValue({ error: null });
  deliverWelcome.mockResolvedValue({ sent: true, providerMessageId: "re_test" });
  from.mockImplementation(() => ({
    select: () => ({ eq: () => ({ maybeSingle }) }),
    upsert,
  }));
});
describe("CPM branch after signature verification", () => {
  it("creates a CPM record and sends welcome once", async () => {
    expect(await handleCpmEvent(paidEvent())).toEqual({
      cpm: true,
      enrolled: true,
      welcome: { sent: true, providerMessageId: "re_test" },
    });
    expect(from.mock.calls.map((c) => c[0])).toEqual([
      "cpm_intensive_payment_blocks",
      "cpm_intensive_enrollments",
      "cpm_intensive_enrollments",
    ]);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        stripe_checkout_session_id: "cs_live_" + "a".repeat(32),
        purchaser_email: "attendee@example.com",
      }),
      { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true },
    );
    expect(deliverWelcome).toHaveBeenCalledWith(enrollment);
  });
  it("lets unrelated and Delay checkouts continue without enrollment side effects", async () => {
    const event = paidEvent();
    event.data.object.payment_link = "plink_delay";
    expect(await handleCpmEvent(event)).toBeNull();
    expect(upsert).not.toHaveBeenCalled();
    expect(deliverWelcome).not.toHaveBeenCalled();
  });
  it("never activates a test or unpaid session", async () => {
    const event = paidEvent();
    event.livemode = false;
    expect(await handleCpmEvent(event)).toBeNull();
    event.livemode = true;
    event.data.object.payment_status = "unpaid";
    expect(await handleCpmEvent(event)).toMatchObject({ ignored: true });
    expect(upsert).not.toHaveBeenCalled();
    expect(deliverWelcome).not.toHaveBeenCalled();
  });
  it("blocks a purchase when its refund arrived before completion", async () => {
    maybeSingle.mockReset();
    maybeSingle.mockResolvedValue({ data: { stripe_payment_intent_id: "pi_cpm" }, error: null });
    expect(await handleCpmEvent(paidEvent())).toMatchObject({ reason: "payment_revoked" });
    expect(upsert).not.toHaveBeenCalled();
    expect(deliverWelcome).not.toHaveBeenCalled();
  });
  it("records partial refund blocks while continuing the pre-existing dispatcher", async () => {
    expect(
      await handleCpmEvent({
        livemode: true,
        type: "charge.refunded",
        data: { object: { payment_intent: "pi_cpm", refunded: false, amount_refunded: 100 } },
      }),
    ).toBeNull();
    expect(upsert).toHaveBeenCalledWith(
      { stripe_payment_intent_id: "pi_cpm", reason: "refunded" },
      { onConflict: "stripe_payment_intent_id", ignoreDuplicates: true },
    );
    expect(deliverWelcome).not.toHaveBeenCalled();
  });
  it("fails instead of acknowledging lost enrollment when storage is unavailable", async () => {
    upsert.mockResolvedValue({ error: new Error("database unavailable") });
    await expect(handleCpmEvent(paidEvent())).rejects.toThrow("database unavailable");
    expect(deliverWelcome).not.toHaveBeenCalled();
  });
});
