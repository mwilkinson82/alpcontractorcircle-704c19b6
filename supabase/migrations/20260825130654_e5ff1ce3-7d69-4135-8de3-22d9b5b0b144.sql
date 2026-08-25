ALTER TABLE public.intensive_email_events
  DROP CONSTRAINT IF EXISTS intensive_email_events_kind;

ALTER TABLE public.intensive_email_events
  ADD CONSTRAINT intensive_email_events_kind CHECK (
    email_kind IN (
      'onboarding',
      'onboarding_reminder_1',
      'onboarding_reminder_2',
      'onboarding_reminder_3',
      'seven_day',
      'forty_eight_hour',
      'materials_release',
      'event_day_one',
      'claim_submission_receipt'
    )
  );