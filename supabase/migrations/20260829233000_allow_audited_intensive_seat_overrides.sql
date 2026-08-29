alter table public.intensive_enrollments
  add column if not exists seat_override_reason text;

alter table public.intensive_enrollments
  drop constraint if exists intensive_enrollments_seats;

alter table public.intensive_enrollments
  add constraint intensive_enrollments_seats
  check (
    (
      seat_override_reason is null
      and (
        (enrollment_type = 'individual' and seats = 1)
        or (enrollment_type = 'company' and seats = 2)
      )
    )
    or (
      nullif(btrim(seat_override_reason), '') is not null
      and char_length(seat_override_reason) <= 500
      and seats between 1 and 20
    )
  );

comment on column public.intensive_enrollments.seat_override_reason is
  'Required audit note when an authorized team accommodation overrides the standard one- or two-seat ticket.';
