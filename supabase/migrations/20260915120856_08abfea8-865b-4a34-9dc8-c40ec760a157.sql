CREATE TABLE public.cpm_intensive_email_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.cpm_intensive_enrollments(id) ON DELETE CASCADE,
  email_kind text NOT NULL,
  recipient text NOT NULL,
  provider_message_id text,
  status text NOT NULL DEFAULT 'pending',
  attempt_count integer NOT NULL DEFAULT 0,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (enrollment_id, email_kind)
);

GRANT ALL ON public.cpm_intensive_email_events TO service_role;

ALTER TABLE public.cpm_intensive_email_events ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_cpm_intensive_email_events_updated_at
BEFORE UPDATE ON public.cpm_intensive_email_events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();