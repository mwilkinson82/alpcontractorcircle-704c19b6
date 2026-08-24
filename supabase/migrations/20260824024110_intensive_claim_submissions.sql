create table public.intensive_claim_submissions (
  id uuid primary key default gen_random_uuid(),
  purchaser_email text not null,
  submitter_name text not null,
  company_name text not null,
  project_name text not null,
  claim_stage text not null,
  amount_at_issue text,
  claim_summary text not null,
  records_available text not null,
  redaction_notes text,
  discussion_permission boolean not null default false,
  purchase_status text not null default 'pending_verification',
  selected_for_live_dissection boolean not null default false,
  internal_notes text,
  created_at timestamptz not null default now(),
  constraint intensive_claim_submissions_email_format
    check (purchaser_email = lower(trim(purchaser_email)) and purchaser_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint intensive_claim_submissions_stage
    check (claim_stage in ('active-delay', 'notice-preparation', 'claim-development', 'submitted', 'disputed', 'other')),
  constraint intensive_claim_submissions_purchase_status
    check (purchase_status in ('pending_verification', 'verified', 'rejected')),
  constraint intensive_claim_submissions_lengths
    check (
      char_length(submitter_name) between 2 and 120
      and char_length(company_name) between 2 and 160
      and char_length(project_name) between 2 and 200
      and char_length(claim_summary) between 40 and 3000
      and char_length(records_available) between 10 and 1500
      and (amount_at_issue is null or char_length(amount_at_issue) <= 80)
      and (redaction_notes is null or char_length(redaction_notes) <= 1000)
    )
);

comment on table public.intensive_claim_submissions is
  'Post-purchase claim candidates for the September 2026 Delay and Damages Intensive. ALP verifies payment before review.';

create index intensive_claim_submissions_review_queue_idx
  on public.intensive_claim_submissions (purchase_status, selected_for_live_dissection, created_at desc);

alter table public.intensive_claim_submissions enable row level security;

revoke all on table public.intensive_claim_submissions from anon, authenticated;
grant insert on table public.intensive_claim_submissions to anon, authenticated;
grant select, insert, update, delete on table public.intensive_claim_submissions to service_role;

create policy "Post-purchase attendees can submit claim candidates"
  on public.intensive_claim_submissions
  for insert
  to anon, authenticated
  with check (
    discussion_permission = true
    and purchase_status = 'pending_verification'
    and selected_for_live_dissection = false
    and internal_notes is null
  );
