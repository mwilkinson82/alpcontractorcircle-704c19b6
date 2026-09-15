type PaidPass = { id: string; purchaser_email: string; purchaser_name: string | null; access_token: string; revoked_at: string | null; stripe_payment_intent_id: string };
type ComplimentaryPass = Omit<PaidPass, "stripe_payment_intent_id">;
type Lookup = {
  paid: () => Promise<PaidPass | null>;
  complimentary: () => Promise<ComplimentaryPass | null>;
  blocked: (paymentIntent: string) => Promise<boolean>;
};

export async function resolveCpmAccess(hasSession: boolean, lookup: Lookup) {
  const paid = await lookup.paid();
  if (paid) {
    if (paid.revoked_at || await lookup.blocked(paid.stripe_payment_intent_id)) return { status: "revoked" as const };
    return { status: "active" as const, enrollment: paid };
  }
  // Complimentary access is never a fallback for a Stripe return, or a revoked paid pass.
  if (hasSession) return { status: "missing" as const };
  const complimentary = await lookup.complimentary();
  if (!complimentary) return { status: "missing" as const };
  if (complimentary.revoked_at) return { status: "revoked" as const };
  return { status: "active" as const, enrollment: complimentary };
}
