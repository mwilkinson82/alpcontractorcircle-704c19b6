import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleCpmEvent as dispatchCpmEvent } from "../../supabase/functions/_shared/cpm-intensive";
import { CPM_PAYMENT_LINK_ID, CPM_PRICE_ID, CPM_PRODUCT_ID } from "../../supabase/functions/cpm-intensive-portal/validation";
import { CPM_PORTAL_URL } from "../../supabase/functions/_shared/cpm-intensive-email";

const sendEmail = vi.fn();
const token = "a".repeat(64);
const sessionId = "cs_live_"+"a".repeat(32);
let enrollments: Array<Record<string, unknown>>;
let blocks: Record<string, unknown> | null;
let upsertError: Error | null;
const from = vi.fn();

function tableApi(table: string) {
  return {
    select: () => ({
      eq: (column: string, value: unknown) => ({
        maybeSingle: async () => {
          if (table === "cpm_intensive_payment_blocks") return { data: blocks, error: null };
          if (table === "cpm_intensive_enrollments") return { data: enrollments.find(row => row[column] === value) || null, error: null };
          if (table === "cpm_intensive_settings") return { data: { dates_label: "September 25–26, 2026", timezone: "America/New_York" }, error: null };
          return { data: null, error: null };
        },
      }),
    }),
    upsert: async (values: Record<string, unknown>) => {
      if (upsertError) return { error: upsertError };
      if (table === "cpm_intensive_payment_blocks") { blocks = values; return { error: null }; }
      if (table === "cpm_intensive_enrollments" && !enrollments.some(row => row.stripe_checkout_session_id === values.stripe_checkout_session_id)) {
        enrollments.push({ id: "11111111-2222-3333-4444-555555555555", welcome_email_status: "pending", welcome_email_attempts: 0, ...values });
      }
      return { error: null };
    },
    update: (values: Record<string, unknown>) => ({
      eq: async (column: string, value: unknown) => {
        const row = enrollments.find(item => item[column] === value);
        if (row) Object.assign(row, values);
        return { error: null };
      },
    }),
  };
}

const handleCpmEvent = (event: Parameters<typeof dispatchCpmEvent>[0]) =>
  dispatchCpmEvent(event, { adminClient: () => ({ from }), randomToken: () => token, sendEmail });

const paidEvent = () => ({
  livemode: true,
  type: "checkout.session.completed",
  data: {
    object: {
      id: sessionId,
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
  enrollments = [];
  blocks = null;
  upsertError = null;
  sendEmail.mockResolvedValue("msg_cpm_welcome");
  from.mockImplementation((table: string) => tableApi(table));
});

describe("CPM branch after signature verification", () => {
  it("creates a CPM record and sends the welcome with the onboarding access link", async () => {
    expect(await handleCpmEvent(paidEvent())).toEqual({ cpm: true, enrolled: true, offer: "cpm_schedule_intensive", catalog: null });
    expect(from.mock.calls.map(call => call[0]).every(table => String(table).startsWith("cpm_intensive_"))).toBe(true);
    expect(enrollments[0]).toEqual(expect.objectContaining({
      stripe_checkout_session_id: sessionId,
      purchaser_email: "attendee@example.com",
      welcome_email_status: "sent",
      welcome_email_provider_id: "msg_cpm_welcome",
    }));
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      "attendee@example.com",
      "Your ALP CPM Intensive attendee portal",
      expect.stringContaining(`${CPM_PORTAL_URL}?access=${token}`),
    );
    const html = sendEmail.mock.calls[0][2] as string;
    expect(html).toContain("CPM Schedule Intensive");
    expect(html).toContain("$1,997");
    expect(html).not.toContain("delay-intensive");
    expect(html).not.toContain("Custom");
  });

  it("preserves the pass and does not resend welcome on duplicate deliveries", async () => {
    expect(await handleCpmEvent(paidEvent())).toMatchObject({ enrolled: true });
    expect(await handleCpmEvent(paidEvent())).toMatchObject({ enrolled: true });
    expect(enrollments).toHaveLength(1);
    expect(enrollments[0].access_token).toBe(token);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("lets unrelated and Delay checkouts continue without enrollment or mail", async () => {
    const event = paidEvent();
    event.data.object.payment_link = "plink_delay";
    expect(await handleCpmEvent(event)).toBeNull();
    expect(enrollments).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("does not grant Custom catalog checkouts as CPM intensive", async () => {
    const event = paidEvent();
    event.data.object.line_items = { data: [{ price: { id: "price_custom", product: "prod_CustomAmount" } }] };
    expect(await handleCpmEvent(event)).toEqual({ cpm: true, ignored: true, reason: "not_cpm_catalog" });
    expect(enrollments).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("enrolls from PRODUCT_MAP line items when the payment link is absent", async () => {
    const event = paidEvent();
    event.data.object.payment_link = null as unknown as string;
    event.data.object.line_items = { data: [{ price: { id: CPM_PRICE_ID, product: CPM_PRODUCT_ID } }] };
    expect(await handleCpmEvent(event)).toMatchObject({ enrolled: true, offer: "cpm_schedule_intensive", catalog: "cpm_schedule_intensive" });
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("never activates a test or unpaid session", async () => {
    const event = paidEvent();
    event.livemode = false;
    expect(await handleCpmEvent(event)).toBeNull();
    event.livemode = true;
    event.data.object.payment_status = "unpaid";
    expect(await handleCpmEvent(event)).toMatchObject({ ignored: true });
    expect(enrollments).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("blocks a purchase when its refund arrived before completion", async () => {
    blocks = { stripe_payment_intent_id: "pi_cpm" };
    expect(await handleCpmEvent(paidEvent())).toMatchObject({ reason: "payment_revoked" });
    expect(enrollments).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("records partial refund blocks while continuing the pre-existing dispatcher", async () => {
    expect(await handleCpmEvent({ livemode: true, type: "charge.refunded", data: { object: { payment_intent: "pi_cpm", refunded: false, amount_refunded: 100 } } })).toBeNull();
    expect(blocks).toEqual({ stripe_payment_intent_id: "pi_cpm", reason: "refunded" });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("fails instead of acknowledging lost enrollment when storage is unavailable", async () => {
    upsertError = new Error("database unavailable");
    await expect(handleCpmEvent(paidEvent())).rejects.toThrow("database unavailable");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("fails the webhook so Stripe can retry when welcome delivery fails", async () => {
    sendEmail.mockRejectedValueOnce(new Error("Resend unavailable"));
    await expect(handleCpmEvent(paidEvent())).rejects.toThrow("Resend unavailable");
    expect(enrollments[0].welcome_email_status).toBe("failed");
  });
});
