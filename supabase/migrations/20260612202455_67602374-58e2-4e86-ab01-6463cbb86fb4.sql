
-- =========================================================
-- ALP Contractor Circle — Marketing lead system
-- =========================================================

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------- email_subscribers ----------
CREATE TABLE public.email_subscribers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  source       TEXT,
  verified     BOOLEAN NOT NULL DEFAULT false,
  unsubscribed BOOLEAN NOT NULL DEFAULT false,
  suppression_reason TEXT,
  unsubscribed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.email_subscribers TO anon;
GRANT INSERT ON public.email_subscribers TO authenticated;
GRANT ALL ON public.email_subscribers TO service_role;

ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can subscribe"
  ON public.email_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (unsubscribed = false);

CREATE TRIGGER trg_email_subscribers_updated_at
  BEFORE UPDATE ON public.email_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_email_subscribers_email ON public.email_subscribers (lower(email));

-- ---------- leads ----------
CREATE TABLE public.leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  TEXT NOT NULL,
  email       TEXT NOT NULL,
  source      TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(first_name) BETWEEN 1 AND 120
    AND char_length(email)  BETWEEN 3 AND 320
    AND char_length(source) BETWEEN 1 AND 60
  );

CREATE INDEX idx_leads_email      ON public.leads (lower(email));
CREATE INDEX idx_leads_source     ON public.leads (source);
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);

-- ---------- drip_enrollments ----------
CREATE TABLE public.drip_enrollments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL,
  first_name    TEXT,
  sequence_id   TEXT NOT NULL,
  current_step  INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'active',
  enrolled_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_send_at  TIMESTAMPTZ,
  converted_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email, sequence_id)
);

GRANT ALL ON public.drip_enrollments TO service_role;

ALTER TABLE public.drip_enrollments ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated → fully locked to service_role.

CREATE TRIGGER trg_drip_enrollments_updated_at
  BEFORE UPDATE ON public.drip_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_drip_enrollments_next_send
  ON public.drip_enrollments (next_send_at)
  WHERE status = 'active';
CREATE INDEX idx_drip_enrollments_email ON public.drip_enrollments (lower(email));

-- ---------- drip_sent_emails ----------
CREATE TABLE public.drip_sent_emails (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id       UUID NOT NULL REFERENCES public.drip_enrollments(id) ON DELETE CASCADE,
  email               TEXT NOT NULL,
  sequence_id         TEXT NOT NULL,
  step_number         INTEGER NOT NULL,
  provider_message_id TEXT,
  status              TEXT NOT NULL DEFAULT 'sent',
  error_message       TEXT,
  sent_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.drip_sent_emails TO service_role;

ALTER TABLE public.drip_sent_emails ENABLE ROW LEVEL SECURITY;
-- No policies → service_role only.

CREATE INDEX idx_drip_sent_enrollment ON public.drip_sent_emails (enrollment_id);
CREATE INDEX idx_drip_sent_sent_at    ON public.drip_sent_emails (sent_at DESC);
