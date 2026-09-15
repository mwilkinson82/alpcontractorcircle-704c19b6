-- CPM purchase welcome email idempotency (mirrors Delay intensive_email_events).
create table public.cpm_intensive_email_events (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.cpm_intensive_enrollments(id) on delete cascade,
  email_kind text not null,
  recipient text not null,
  status text not null,
  attempt_count integer not null default 0,
  provider_message_id text,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cpm_intensive_email_events_kind check (email_kind in ('onboarding')),
  constraint cpm_intensive_email_events_status check (status in ('pending', 'sent', 'failed')),
  constraint cpm_intensive_email_events_unique unique (enrollment_id, email_kind)
);

alter table public.cpm_intensive_email_events enable row level security;
revoke all on public.cpm_intensive_email_events from public, anon, authenticated;
grant all on public.cpm_intensive_email_events to service_role;

comment on table public.cpm_intensive_email_events is
  'Service-role only log for CPM Intensive transactional email (purchase welcome).';
