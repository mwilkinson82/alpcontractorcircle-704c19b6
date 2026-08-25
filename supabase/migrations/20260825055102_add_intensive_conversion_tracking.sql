alter table public.intensive_enrollments
  add column checkout_reference text,
  add column audience_channel text not null default 'unattributed',
  add column visitor_id uuid,
  add column funnel_session_id uuid,
  add constraint intensive_enrollments_audience_channel
    check (audience_channel in ('public', 'contractor_circle', 'unattributed')),
  add constraint intensive_enrollments_checkout_reference
    check (checkout_reference is null or checkout_reference ~ '^di_(public|contractor_circle)_(individual|company)_v_[0-9a-f]{32}_s_[0-9a-f]{32}$');

create index intensive_enrollments_audience_ticket_idx
  on public.intensive_enrollments (audience_channel, enrollment_type, created_at desc);

create table public.intensive_funnel_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  session_id uuid not null,
  event_type text not null,
  audience_channel text not null,
  enrollment_type text,
  page_path text not null,
  referrer_host text,
  occurred_at timestamptz not null default now(),
  constraint intensive_funnel_events_type
    check (event_type in ('landing_view', 'checkout_started')),
  constraint intensive_funnel_events_audience
    check (audience_channel in ('public', 'contractor_circle')),
  constraint intensive_funnel_events_enrollment
    check (
      (event_type = 'landing_view' and enrollment_type is null)
      or
      (event_type = 'checkout_started' and enrollment_type in ('individual', 'company'))
    ),
  constraint intensive_funnel_events_page
    check (page_path in ('/delay-intensive', '/delay-intensive/member')),
  constraint intensive_funnel_events_referrer_length
    check (referrer_host is null or char_length(referrer_host) <= 253)
);

create unique index intensive_funnel_events_landing_session_idx
  on public.intensive_funnel_events (session_id, audience_channel)
  where event_type = 'landing_view';

create unique index intensive_funnel_events_checkout_session_idx
  on public.intensive_funnel_events (session_id, audience_channel, enrollment_type)
  where event_type = 'checkout_started';

create index intensive_funnel_events_reporting_idx
  on public.intensive_funnel_events (audience_channel, event_type, enrollment_type, occurred_at desc);

alter table public.intensive_funnel_events enable row level security;
revoke all on table public.intensive_funnel_events from anon, authenticated;
grant select, insert, update, delete on table public.intensive_funnel_events to service_role;

comment on table public.intensive_funnel_events is
  'First-party, non-PII funnel ledger for the 2026 Delay and Damages Intensive.';

comment on column public.intensive_enrollments.audience_channel is
  'Landing-page audience carried through Stripe client_reference_id; not an authorization claim.';

-- The one purchase made before attribution launched was confirmed by ALP as a
-- Contractor Circle member purchase. Keep the backfill limited to the earliest
-- pre-attribution enrollment so later unattributed purchases remain visible.
update public.intensive_enrollments
set audience_channel = 'contractor_circle'
where id = (
  select id
  from public.intensive_enrollments
  where audience_channel = 'unattributed'
  order by created_at asc
  limit 1
);

create view public.intensive_conversion_dashboard
with (security_invoker = true)
as
with dimensions as (
  select audience_channel, enrollment_type
  from (values ('public'), ('contractor_circle'), ('unattributed')) channels(audience_channel)
  cross join (values ('individual'), ('company')) tickets(enrollment_type)
),
visits as (
  select
    audience_channel,
    count(distinct visitor_id)::integer as landing_visitors,
    count(distinct session_id)::integer as landing_sessions,
    max(occurred_at) as last_visit_at
  from public.intensive_funnel_events
  where event_type = 'landing_view'
  group by audience_channel
),
checkouts as (
  select
    audience_channel,
    enrollment_type,
    count(distinct session_id)::integer as checkout_starts,
    max(occurred_at) as last_checkout_at
  from public.intensive_funnel_events
  where event_type = 'checkout_started'
  group by audience_channel, enrollment_type
),
purchases as (
  select
    audience_channel,
    enrollment_type,
    count(*) filter (where payment_status = 'paid')::integer as paid_purchases,
    coalesce(sum(seats) filter (where payment_status = 'paid'), 0)::integer as paid_seats,
    coalesce(sum(amount_total) filter (where payment_status = 'paid'), 0)::bigint as gross_revenue_cents,
    max(created_at) filter (where payment_status = 'paid') as last_purchase_at
  from public.intensive_enrollments
  group by audience_channel, enrollment_type
)
select
  dimensions.audience_channel,
  dimensions.enrollment_type,
  coalesce(visits.landing_visitors, 0) as landing_visitors,
  coalesce(visits.landing_sessions, 0) as landing_sessions,
  coalesce(checkouts.checkout_starts, 0) as checkout_starts,
  coalesce(purchases.paid_purchases, 0) as paid_purchases,
  coalesce(purchases.paid_seats, 0) as paid_seats,
  coalesce(purchases.gross_revenue_cents, 0) as gross_revenue_cents,
  case
    when coalesce(visits.landing_visitors, 0) = 0 then null
    else round(100.0 * coalesce(purchases.paid_purchases, 0) / visits.landing_visitors, 2)
  end as visitor_to_purchase_percent,
  case
    when coalesce(checkouts.checkout_starts, 0) = 0 then null
    else round(100.0 * coalesce(purchases.paid_purchases, 0) / checkouts.checkout_starts, 2)
  end as checkout_to_purchase_percent,
  visits.last_visit_at,
  checkouts.last_checkout_at,
  purchases.last_purchase_at
from dimensions
left join visits using (audience_channel)
left join checkouts using (audience_channel, enrollment_type)
left join purchases using (audience_channel, enrollment_type);

revoke all on public.intensive_conversion_dashboard from anon, authenticated;
grant select on public.intensive_conversion_dashboard to service_role;

comment on view public.intensive_conversion_dashboard is
  'Private funnel report by audience and ticket type. Revenue is stored in cents.';
