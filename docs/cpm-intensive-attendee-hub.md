# CPM Intensive attendee hub

Route: https://alpcontractorcircle.com/cpm-intensive/onboarding

## Purchase access

The existing signed Stripe webhook at `delay-intensive-webhook` dispatches the exact CPM payment link (`plink_1UFijSJdDAUSVXbNu3vdGChq`) to its own handler after signature verification. That link was verified through Marshall's existing live Stripe connection: one seat, USD 199700, price `price_1UFibpJdDAUSVXbNO9Fwg6lf`, product `prod_VGF6PF6ysZKKtV`. The configured return URL is this hub with `?session_id={CHECKOUT_SESSION_ID}`.

The CPM branch handles paid live completed/async-success events and never sends emails. It writes only CPM enrollment records. The pre-existing Delay enrollment and email behavior is unchanged. Refunds (including partial refunds) and disputes block CPM access; no refund policy is implied by this technical access rule. Minimal payment-intent blocks handle out-of-order revocations. Duplicate completion events do not rotate passes or reactivate manually revoked rows.

The portal accepts a server-recorded paid session or a 256-bit personal `?access=` token. It rejects arbitrary, test, unpaid, unrelated or revoked passes. A Stripe return takes precedence over old browser access, strips query credentials from the address bar, and briefly retries while the webhook arrives. No Stripe checkout is opened during agent QA. No direct Stripe API key or new payment account is needed.

## Private data and materials

`cpm_intensive_enrollments`, `cpm_intensive_payment_blocks`, `cpm_intensive_settings` and `cpm_intensive_materials` have RLS enabled and no grants for anon/authenticated. Only server-side service-role access is allowed. Tokens are never logged or exposed through a public database policy. The `cpm-intensive-materials` storage bucket is private with no browser read policies. Released files get 15-minute signed URLs. Attendees can refresh materials for fresh download links.

The UI includes P6 trial access, Google Meet, the downloads shelf, personal-link copying and closing the pass on this browser. It uses ALP cream, near-black, Instrument Serif and restrained terracotta/orange. It does not use the Learn portal, Kajabi, Oracle Academy or OverWatch.

## Operator setup in Lovable Cloud

Open the Contractor Circle project → Cloud → Database.

1. In `cpm_intensive_settings`, edit row `id=1`:
   - `dates_label`: `September 25–26, 2026`, confirmed by Marshall on September 15, 2026.
   - `timezone`: an IANA timezone, e.g. use `America/New_York` only if Marshall confirms it.
   - `meet_url`: the actual `https://meet.google.com/xxx-xxxx-xxx` URL.
   - `meet_release_at`: optional time to reveal the Meet link; null reveals it as soon as dates, timezone and the link exist.
   - `materials_release_at`: a confirmed release timestamp. Null keeps the shelf locked (TBD).
2. In Cloud → Storage → `cpm-intensive-materials`, upload the class packs when ready.
3. Add each file to `cpm_intensive_materials` with its exact bucket-relative `storage_path`, title, description and sort order. Set `is_published=true` when approved. An optional `release_at` can delay a specific file past the global unlock time.
4. To revoke an individual pass manually, set `revoked_at` on that attendee's CPM enrollment. Do not share or publish the access token.

The Oracle URL supplied in the prompt returned 404. The software CTA uses https://edelivery.oracle.com/, the download source identified in Oracle's P6 installation documentation: https://docs.oracle.com/cd/G18296_01/English/Installing/p6_pro_install_config_standalone/703.htm . Users accept Oracle's terms themselves.

## Verification

- Purchase-policy and React flow tests cover the valid return, unpaid/test/other-link/multi-seat rejection, missing identity, refund/dispute blocks, release timing, stale browser access, private-link return, retry, logout and released resources.
- The local design fixture is development-only and clearly labelled. It is eliminated from production builds and never grants server access.
- No live purchase was made during testing; no checkout or Link authentication was opened.
- Phone 375px, tablet 834px/900px, desktop 1280px checked for overflow and touch targets.

## Deployed backend verification (September 14, 2026)

- Lovable applied migration `20260914234141_ad99fc39-2672-45c8-8920-424faf89e081.sql`. The earlier draft migration was never applied and was removed to avoid duplicating table creation on future rebuilds. Lovable created the private 50 MB storage bucket through its Storage tool separately.
- The deployment bundler requires shared imports under `_shared`; CPM validation now lives in `_shared/cpm-intensive-validation.ts`, with a compatibility re-export at the original path.
- Both functions deployed. Independent HTTP checks: missing/invalid pass and template session return 401; unsigned webhook returns 400. Lovable also verified unknown live-formatted session returns 409 pending, foreign origin 403, GET 405.
- Four tables have RLS and no anon/authenticated SELECT privileges. Private storage bucket verified, with zero browser storage policies. Meet URL, calendar dates, timezone and material-release timestamp remain null as intended.
- All 37 project tests passed in Lovable (including 25 CPM tests and 2 Delay regression tests); production build and type checks passed. No local design-fixture data remains in production JS.
- Existing Stripe connection returned zero completed CPM sessions, so no earlier purchases need backfill. No live payment was created during verification.

## September 15 date confirmation

Marshall confirmed September 25–26, 2026. Daily hours remain 10 a.m.–5 p.m.; timezone is still unconfirmed. The live settings row and public landing now use these dates. Meet and materials remain pending.

## E-tickets, calendar saves and per-day access (September 15)

- The verified portal includes a personalized e-ticket and downloads a 1800×960 PNG. The ticket contains an attendee name and display ticket number, but no email, access credential or conference URL. It is a keepsake; admission still requires a verified portal pass.
- `cpm_intensive_settings.sessions` stores private per-day objects with `id`, `title`, `starts_at`, `ends_at`, `meet_url`, and optionally a host event ID. Use explicit RFC3339 start/end timestamps after the timezone is confirmed.
- The server returns an explicit whitelist. Each Meet URL is withheld until exactly 60 minutes before its own start and withheld again at its end. Host calendar IDs are never returned. The legacy single Meet URL is no longer used by this portal.
- Google Calendar links and Outlook/Apple `.ics` downloads always contain only the generic portal URL, never a Meet URL or personal token—even after release. Imported calendar events do not gain a conference URL later; attendees return to the gated portal. Calendar reminders are one hour before start for `.ics` imports.
- Open portals recheck at release, at session end, every minute, and on returning to the tab. A manual Refresh live access control is also provided. A failed recheck removes displayed Meet links.
- Host Google Calendar events must be private and have no attendee invite list, so their conference URLs are not emailed to buyers early. This does not prevent an attendee from copying a link after release; Google Meet host admission controls remain separate.
- Timezone confirmation is still required before creating host events and populating sessions. No calendar or payment actions were performed during development.
- Verification: 42 tests passed, production build, TypeScript, scoped lint and Deno check passed. PNG download verified in the browser. Tests cover exact one-hour boundary, independent days, end time, invalid URLs/timestamps and credential-free exports.

## Eastern Time and host sessions confirmed

Marshall confirmed Eastern Time for all his events. The CPM settings use America/New_York. Private Google Calendar host events were created on marshall@marshallwilkinson.com for September 25 and 26, 2026, 10 a.m.–5 p.m. EDT, each with its own Google Meet conference and no invited attendee list. Meet URLs exist only in private settings and the host calendar, not source code. Each releases in the verified portal at 9 a.m. EDT on its own day (13:00 UTC). Google/Outlook calendar saves are now enabled from these configured sessions.

## Materials release confirmed

Marshall set the class materials release to 24 hours before the intensive: September 24, 2026, 10 a.m. Eastern (2026-09-24T14:00:00Z), ahead of Day 1 on September 25. The production settings row is configured accordingly. The server checks active enrollment and the release timestamp before generating any signed material URLs; the storage bucket remains private. This timing does not establish or change refund terms. No class files have been uploaded yet.
