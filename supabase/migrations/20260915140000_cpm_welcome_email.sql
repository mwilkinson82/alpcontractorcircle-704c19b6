-- Idempotent CPM welcome-email ledger. Complimentary passes are not emailed here.
ALTER TABLE public.cpm_intensive_enrollments
  ADD COLUMN IF NOT EXISTS welcome_email_status text NOT NULL DEFAULT 'pending'
    CHECK (welcome_email_status IN ('pending', 'sent', 'failed')),
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS welcome_email_provider_id text,
  ADD COLUMN IF NOT EXISTS welcome_email_error text,
  ADD COLUMN IF NOT EXISTS welcome_email_attempts integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.cpm_intensive_enrollments.welcome_email_status IS
  'Delivery ledger for the CPM welcome email that grants /cpm-intensive/onboarding?access=';
