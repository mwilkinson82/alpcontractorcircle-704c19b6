# CPM — Marshall's personal welcome note (ops)

A second, human note that follows the automated portal welcome. It is **queued only**.
Lane sends it by hand from Gmail as `marshall@`. No Resend, no hub mailer, no auto-send.

## The flag

`cpm_intensive_settings.marshall_personal_welcome_auto` — `boolean NOT NULL DEFAULT false`.

- **false (default, current state):** the webhook calls the enqueue step, it returns
  `{ skipped: true, reason: "flag_off" }`, and **no pending row is written**.
- **true:** each new paid CPM enrollment gets one `pending` row in
  `cpm_intensive_email_events` with `email_kind = 'marshall_personal_welcome'`.

Idempotent either way: `UNIQUE (enrollment_id, email_kind)` means one row per attendee,
and a row already marked `sent` is never re-queued.

Flip ON:

```sql
UPDATE cpm_intensive_settings SET marshall_personal_welcome_auto = true WHERE id = 1;
```

Flip OFF:

```sql
UPDATE cpm_intensive_settings SET marshall_personal_welcome_auto = false WHERE id = 1;
```

## Draining the queue (Lane)

```sql
SELECT * FROM cpm_intensive_email_events
WHERE email_kind = 'marshall_personal_welcome' AND status = 'pending';
```

Send each one from Gmail as `marshall@`, subject exactly
`Welcome to the ALP CPM Schedule Intensive`, then mark it done:

```sql
UPDATE cpm_intensive_email_events
SET status = 'sent', provider_message_id = '<gmail_msg_id>', sent_at = now(), updated_at = now()
WHERE email_kind = 'marshall_personal_welcome' AND enrollment_id = '<enrollment_id>';
```

## Do not re-send Phil

Enrollment `b0418ff6-4fda-4eb8-bbbc-63b3ddf7c5f8` (`owner@pr.builders`) is already
backfilled as `sent` with Gmail message `1a0a69894f8217cf`. Never send him this note again.

## Copy

Subject and body live in `supabase/functions/_shared/cpm-marshall-personal-welcome.ts`.
Greeting is the first token of `purchaser_name` (fallback `there`), then an em dash, then the
archived gold body. Dates: Friday September 25 and Saturday September 26, 2026,
10 a.m.–5 p.m. Eastern. No payment links.
