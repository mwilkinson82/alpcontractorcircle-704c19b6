-- Run on production if the repo migration cannot apply itself.
-- Safe to re-run. Does not rotate access_token. Does not delete rows.
-- Requires public.intensive_enrollments.pass_kind (and generated can_submit_claim) to exist.

begin;

update public.intensive_enrollments
set pass_kind = 'purchaser'
where stripe_payment_link_id in (
    'plink_1U7n37JdDAUSVXbNG7XStxnN',
    'plink_1U7n39JdDAUSVXbNIreq7bTB'
  )
  or id in (
    '0049e7cd-e474-4805-88d5-0b337b4efd50', -- Oliver Fernandez (company purchaser, seats=14)
    '8e2693e4-342c-49ee-b955-701d97bf1d8d', -- Sean McDevitt
    '86f7ea9c-891d-478e-91ca-65965703cfbf', -- Michael Eargle
    '3e00e637-d285-473d-b362-2cd6c8e28dc7'  -- Kabir Bhagat
  );

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

-- Verify before commit. Expected: 4 production buyers + QA preview stay purchaser;
-- 13 extra-seat rows become named_seat.
select
  pass_kind,
  can_submit_claim,
  id,
  purchaser_email,
  seats,
  stripe_payment_link_id
from public.intensive_enrollments
order by pass_kind, created_at;

commit;
