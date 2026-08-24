create extension if not exists pgcrypto;
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

create table public.intensive_enrollments (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  stripe_payment_link_id text not null,
  purchaser_email text not null,
  purchaser_name text,
  company_name text,
  attendee_names jsonb not null default '[]'::jsonb,
  phone text,
  preparation_notes text,
  enrollment_type text not null,
  seats integer not null,
  amount_total integer,
  currency text,
  payment_status text not null default 'paid',
  access_token text not null unique default encode(gen_random_bytes(32), 'hex'),
  onboarding_completed_at timestamptz,
  materials_release_at timestamptz not null default '2026-09-03 16:00:00+00',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint intensive_enrollments_email_format
    check (purchaser_email = lower(trim(purchaser_email)) and purchaser_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint intensive_enrollments_type
    check (enrollment_type in ('individual', 'company')),
  constraint intensive_enrollments_seats
    check ((enrollment_type = 'individual' and seats = 1) or (enrollment_type = 'company' and seats = 2)),
  constraint intensive_enrollments_payment_status
    check (payment_status in ('paid', 'refunded', 'disputed', 'revoked'))
);

create index intensive_enrollments_payment_intent_idx
  on public.intensive_enrollments (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

create index intensive_enrollments_customer_idx
  on public.intensive_enrollments (stripe_customer_id)
  where stripe_customer_id is not null;

create table public.intensive_email_events (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.intensive_enrollments(id) on delete cascade,
  email_kind text not null,
  recipient text not null,
  provider_message_id text,
  status text not null default 'pending',
  attempt_count integer not null default 0,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, email_kind),
  constraint intensive_email_events_status
    check (status in ('pending', 'sent', 'failed')),
  constraint intensive_email_events_kind
    check (email_kind in ('onboarding', 'seven_day', 'forty_eight_hour', 'materials_release', 'event_day_one'))
);

alter table public.intensive_claim_submissions
  add column enrollment_id uuid references public.intensive_enrollments(id) on delete cascade,
  add column submitted_via_portal boolean not null default false,
  add column review_notified_at timestamptz;

create unique index intensive_claim_one_per_enrollment_idx
  on public.intensive_claim_submissions (enrollment_id)
  where enrollment_id is not null and submitted_via_portal = true;

create table public.intensive_claim_attachments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.intensive_enrollments(id) on delete cascade,
  claim_submission_id uuid references public.intensive_claim_submissions(id) on delete cascade,
  storage_path text not null unique,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now(),
  constraint intensive_claim_attachment_size check (size_bytes > 0 and size_bytes <= 26214400),
  constraint intensive_claim_attachment_path check (storage_path like enrollment_id::text || '/%')
);

create table public.intensive_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  storage_path text not null unique,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'intensive-claim-files',
  'intensive-claim-files',
  false,
  26214400,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'text/plain',
    'text/csv',
    'application/octet-stream'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit)
values ('intensive-materials', 'intensive-materials', false, 52428800)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;

drop policy if exists "Post-purchase attendees can submit claim candidates"
  on public.intensive_claim_submissions;

revoke all on table public.intensive_enrollments from anon, authenticated;
revoke all on table public.intensive_email_events from anon, authenticated;
revoke all on table public.intensive_claim_submissions from anon, authenticated;
revoke all on table public.intensive_claim_attachments from anon, authenticated;
revoke all on table public.intensive_materials from anon, authenticated;

grant select, insert, update, delete on table public.intensive_enrollments to service_role;
grant select, insert, update, delete on table public.intensive_email_events to service_role;
grant select, insert, update, delete on table public.intensive_claim_submissions to service_role;
grant select, insert, update, delete on table public.intensive_claim_attachments to service_role;
grant select, insert, update, delete on table public.intensive_materials to service_role;

alter table public.intensive_enrollments enable row level security;
alter table public.intensive_email_events enable row level security;
alter table public.intensive_claim_submissions enable row level security;
alter table public.intensive_claim_attachments enable row level security;
alter table public.intensive_materials enable row level security;

comment on table public.intensive_enrollments is
  'Purchase-gated attendee access for the September 2026 Delay and Damages Intensive.';
comment on table public.intensive_email_events is
  'Idempotent delivery ledger for attendee onboarding and reminder email.';
comment on table public.intensive_claim_attachments is
  'Private claim-support files uploaded by verified paid attendees.';
comment on table public.intensive_materials is
  'Private class materials released through short-lived signed URLs after the release time.';

select cron.schedule(
  'delay-intensive-reminders-2026',
  '*/15 * * * *',
  $schedule$
    select net.http_post(
      url := 'https://nereqcvadsqdbinyhsnr.supabase.co/functions/v1/delay-intensive-reminders',
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body := '{}'::jsonb
    );
  $schedule$
);
