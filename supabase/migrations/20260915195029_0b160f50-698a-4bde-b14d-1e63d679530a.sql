ALTER TABLE public.cpm_intensive_settings
  ADD COLUMN IF NOT EXISTS marshall_personal_welcome_auto boolean NOT NULL DEFAULT false;

INSERT INTO public.cpm_intensive_email_events
  (enrollment_id, email_kind, recipient, provider_message_id, status, attempt_count, sent_at, created_at, updated_at)
VALUES
  ('b0418ff6-4fda-4eb8-bbbc-63b3ddf7c5f8', 'marshall_personal_welcome', 'owner@pr.builders', '1a0a69894f8217cf', 'sent', 1, '2026-09-15T19:43:32Z', now(), now())
ON CONFLICT (enrollment_id, email_kind) DO NOTHING;