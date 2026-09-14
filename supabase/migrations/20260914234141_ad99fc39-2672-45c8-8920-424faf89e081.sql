-- CPM-specific data; no shared Delay enrollment or email triggers.
create table public.cpm_intensive_enrollments (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text not null unique,
  access_token text not null unique check (access_token ~ '^[a-f0-9]{64}$'),
  purchaser_email text not null,
  purchaser_name text,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
-- Minimal payment references preserve refund/dispute denial even when Stripe
-- delivers a revocation before the completed-checkout event.
create table public.cpm_intensive_payment_blocks (
  stripe_payment_intent_id text primary key,
  reason text not null check (reason in ('refunded', 'disputed')),
  blocked_at timestamptz not null default now()
);
create table public.cpm_intensive_settings (
  id smallint primary key default 1 check (id = 1),
  dates_label text,
  timezone text,
  meet_url text check (meet_url is null or meet_url ~ '^https://meet\.google\.com/[a-z]{3}-[a-z]{4}-[a-z]{3}$'),
  meet_release_at timestamptz,
  materials_release_at timestamptz
);
insert into public.cpm_intensive_settings (id) values (1);
create table public.cpm_intensive_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  storage_path text not null unique,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  release_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.cpm_intensive_enrollments enable row level security;
alter table public.cpm_intensive_payment_blocks enable row level security;
alter table public.cpm_intensive_settings enable row level security;
alter table public.cpm_intensive_materials enable row level security;
-- Personal bearer passes are checked only by the Edge Function; browser roles
-- cannot read enrollment tokens, live links, settings, or the materials catalog.
revoke all on public.cpm_intensive_enrollments, public.cpm_intensive_payment_blocks, public.cpm_intensive_settings, public.cpm_intensive_materials from public, anon, authenticated;
grant all on public.cpm_intensive_enrollments, public.cpm_intensive_payment_blocks, public.cpm_intensive_settings, public.cpm_intensive_materials to service_role;
-- No browser storage policies. Released downloads receive short-lived signed URLs.