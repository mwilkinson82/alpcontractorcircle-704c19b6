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
   - `dates_label`: Marshall's confirmed calendar dates, once supplied.
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
