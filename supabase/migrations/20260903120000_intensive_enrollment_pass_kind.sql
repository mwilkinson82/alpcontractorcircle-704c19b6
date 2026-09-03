-- Two-pass attendee portal: purchaser (claim-enabled) vs named-seat (claim-disabled).
-- Do not infer from seats. A company or accommodated buyer can hold many seats and
-- must still submit the live claim. Extra named-seat tickets must not.

alter table public.intensive_enrollments
  add column if not exists pass_kind text not null default 'purchaser';

alter table public.intensive_enrollments
  drop constraint if exists intensive_enrollments_pass_kind;

alter table public.intensive_enrollments
  add constraint intensive_enrollments_pass_kind
  check (pass_kind in ('purchaser', 'named_seat'));

alter table public.intensive_enrollments
  drop column if exists can_submit_claim;

alter table public.intensive_enrollments
  add column can_submit_claim boolean generated always as (pass_kind = 'purchaser') stored;

comment on column public.intensive_enrollments.pass_kind is
  'purchaser: paid buyer who may submit a live claim. named_seat: extra attendee ticket without claim upload. Not inferred from seats.';

comment on column public.intensive_enrollments.can_submit_claim is
  'Generated from pass_kind. True only for purchaser rows.';

-- Existing Stripe-webhook enrollments and known buyers stay claim-enabled.
update public.intensive_enrollments
set pass_kind = 'purchaser'
where stripe_payment_link_id in (
    'plink_1U7n37JdDAUSVXbNG7XStxnN',
    'plink_1U7n39JdDAUSVXbNIreq7bTB'
  )
  or id in (
    '0049e7cd-e474-4805-88d5-0b337b4efd50',
    '8e2693e4-342c-49ee-b955-701d97bf1d8d',
    '86f7ea9c-891d-478e-91ca-65965703cfbf',
    '3e00e637-d285-473d-b362-2cd6c8e28dc7'
  );

-- Synthetic extra-attendee tickets. Explicit buyer IDs above stay purchaser.
update public.intensive_enrollments
set pass_kind = 'named_seat'
where id not in (
    '0049e7cd-e474-4805-88d5-0b337b4efd50',
    '8e2693e4-342c-49ee-b955-701d97bf1d8d',
    '86f7ea9c-891d-478e-91ca-65965703cfbf',
    '3e00e637-d285-473d-b362-2cd6c8e28dc7'
  )
  and (
    stripe_payment_link_id = 'manual_mckenzie_extra_seat'
    or stripe_payment_link_id like 'manual_%extra_seat%'
    or stripe_checkout_session_id like 'manual_%'
  );
