import { describe, expect, it, vi } from "vitest";
import { resolveCpmAccess } from "../../supabase/functions/_shared/cpm-intensive-access";
const pass = { id: "id", purchaser_email: "owner@example.com", purchaser_name: "Owner", access_token: "a".repeat(64), revoked_at: null };
const paid = { ...pass, stripe_payment_intent_id: "pi_test" };
describe("CPM complimentary access", () => {
  it("allows an explicitly granted personal pass without a payment lookup", async () => {
    const blocked = vi.fn();
    expect(await resolveCpmAccess(false, { paid: async () => null, complimentary: async () => pass, blocked })).toEqual({ status: "active", enrollment: pass });
    expect(blocked).not.toHaveBeenCalled();
  });
  it("never uses complimentary access for a Stripe return", async () => {
    const complimentary = vi.fn();
    expect(await resolveCpmAccess(true, { paid: async () => null, complimentary, blocked: vi.fn() })).toEqual({ status: "missing" });
    expect(complimentary).not.toHaveBeenCalled();
  });
  it("denies refunded paid access without falling back to a complimentary pass", async () => {
    const complimentary = vi.fn();
    expect(await resolveCpmAccess(false, { paid: async () => paid, complimentary, blocked: async () => true })).toEqual({ status: "revoked" });
    expect(complimentary).not.toHaveBeenCalled();
  });
  it("denies a revoked complimentary pass", async () => {
    expect(await resolveCpmAccess(false, { paid: async () => null, complimentary: async () => ({ ...pass, revoked_at: "2026-09-15" }), blocked: vi.fn() })).toEqual({ status: "revoked" });
  });
  it("keeps ordinary paid access working", async () => {
    expect(await resolveCpmAccess(true, { paid: async () => paid, complimentary: vi.fn(), blocked: async () => false })).toEqual({ status: "active", enrollment: paid });
  });
  it("does not mask database failures as complimentary access", async () => {
    const complimentary = vi.fn();
    await expect(resolveCpmAccess(false, { paid: async () => { throw new Error("database unavailable"); }, complimentary, blocked: vi.fn() })).rejects.toThrow("database unavailable");
    expect(complimentary).not.toHaveBeenCalled();
  });
});
