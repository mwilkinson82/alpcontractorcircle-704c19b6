ALTER TABLE public.cpm_intensive_settings
  ADD COLUMN IF NOT EXISTS sessions jsonb NOT NULL DEFAULT '[]'::jsonb
  CHECK (jsonb_typeof(sessions) = 'array');
COMMENT ON COLUMN public.cpm_intensive_settings.sessions IS
  'Private host sessions. The portal returns a whitelist and withholds each Meet URL until one hour before its start.';
