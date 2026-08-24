alter table public.intensive_email_events
  drop constraint if exists intensive_email_events_kind;

alter table public.intensive_email_events
  add constraint intensive_email_events_kind
  check (
    email_kind in (
      'onboarding',
      'onboarding_reminder_1',
      'onboarding_reminder_2',
      'onboarding_reminder_3',
      'seven_day',
      'forty_eight_hour',
      'materials_release',
      'event_day_one'
    )
  );
