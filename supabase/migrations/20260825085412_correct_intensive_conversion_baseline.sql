alter table public.intensive_enrollments
  add column reporting_status text not null default 'production',
  add constraint intensive_enrollments_reporting_status
    check (reporting_status in ('production', 'test'));

comment on column public.intensive_enrollments.reporting_status is
  'Excludes internal checkout and portal-verification records from commercial conversion reporting.';

-- The earliest enrollment is Marshall's internal purchaser-portal test, not a
-- commercial sale. Remove the audience backfill from the prior migration and
-- exclude this one known record from conversion and revenue reporting.
update public.intensive_enrollments
set
  reporting_status = 'test',
  audience_channel = 'unattributed',
  updated_at = now()
where id = (
  select id
  from public.intensive_enrollments
  where purchaser_email = 'marshall@marshallwilkinson.com'
  order by created_at asc
  limit 1
);

-- ALP confirmed the first real purchase made before source tracking launched
-- came through the Contractor Circle member offer.
update public.intensive_enrollments
set
  audience_channel = 'contractor_circle',
  updated_at = now()
where id = (
  select id
  from public.intensive_enrollments
  where reporting_status = 'production'
    and audience_channel = 'unattributed'
  order by created_at asc
  limit 1
);

create or replace view public.intensive_conversion_dashboard
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
  where reporting_status = 'production'
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
