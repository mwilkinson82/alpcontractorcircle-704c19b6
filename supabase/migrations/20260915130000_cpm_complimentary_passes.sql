-- Explicit complimentary passes; no fabricated Stripe payments or memberships.
CREATE TABLE IF NOT EXISTS public.cpm_intensive_complimentary_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchaser_email text NOT NULL UNIQUE,
  purchaser_name text,
  access_token text NOT NULL UNIQUE CHECK (access_token ~ '^[a-f0-9]{64}$'),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cpm_intensive_complimentary_passes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cpm_intensive_complimentary_passes FROM public, anon, authenticated;
GRANT ALL ON public.cpm_intensive_complimentary_passes TO service_role;
