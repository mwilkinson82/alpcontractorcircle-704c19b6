# Delay / CPM confirmations and October fulfillment - draft review

Prepared from `6c5cd51bdf52e018472720848484a3f430267e55` on September 30, 2026. Nothing merged, deployed, published, charged, backfilled, or emailed. No live Stripe links, webhooks, credentials, resource settings, or queues changed.

## Result and scope

The two EXISTING confirmation emails use the approved 600px acknowledgment design: charcoal #1C1A17, orange #F76A16, cream #F7F2EA, Helvetica/Arial, purchase card and access CTA. Subjects, sender/reply-to, identity, money, quantities, ticket IDs and private links are preserved. CPM still has no amount passed into its renderer and no October schedule. Its separate personal-welcome queue remains unchanged/off.

Following authorization to prepare October fulfillment, the existing signed webhook can now route the eight verified October offers into the existing enrollment/email path, behind a default-OFF `OCTOBER_DELAY_FULFILLMENT_ENABLED` switch. Paid/live/complete/payment-mode checks, exact checkout and intent IDs, a stable per-checkout token, ignored duplicate upserts, and existing refund/dispute blocks are checked before delivery. September and unknown/evergreen routing remains unchanged. Nothing infers a cohort from amount or purchase date.

The private portal selects October using the persisted payment-link ID. It shows the verified schedule, correct calendar downloads, onboarding and existing claim capability. October resources never inherit the September material catalog or shared room URL. The existing claim receipt gets only a cohort-specific date substitution; its subject, design and delivery mechanism remain unchanged. The reminder scheduler and its existing onboarding sequence remain unchanged; no October timed-event reminder campaign was added.

## Verified date and offer sources

Read-only verification on September 30, 2026:

- `src/pages/DelayIntensive.tsx` lines 71-94 and `src/pages/DelayIntensiveTerms.tsx`: October 16-18, 2026; Friday 1-5 p.m., Saturday 9 a.m.-5 p.m., Sunday 10 a.m.-1 p.m., Eastern.
- Organizer calendar: `uj743jgo1mh9h4pdl1ei6f7uf4` (Friday Preserve), `n1vphd1mr3aj30v8886vmdobos` (Saturday Prove + Price), `551hmd0gcpbs93g08bgjapddh4` (Sunday Build). UTC intervals: Oct16 17:00-21:00Z, Oct17 13:00-21:00Z, Oct18 14:00-17:00Z, all EDT UTC-04:00. Descriptions explicitly identify the October cohort, one-hour Saturday break, and private room links inside the attendee portal. The calendar says Google Meet; landing copy says Zoom. Confirmation uses “Live online.” Actual private meeting URLs are not committed or embedded in preview HTML.
- Marketing email “Sold Out - next Delay Intensive is Oct 16-18”, September 2/3, Gmail message `1a064e6e1ad58164`, independently confirms dates: https://mail.google.com/mail/u/?authuser=marshall%40marshallwilkinson.com#all/1a064e6e1ad58164
- Stripe live account `acct_1HPL9DJdDAUSVXbN`: eight links below carry `metadata.launch=delay_damages_intensive_2026_10`. Old accepted links carry `delay_damages_intensive_2026_09`.
- No October material-release timestamp or approved October material-ID list was verified. October 15 noon is enrollment close, NOT a material release. Existing schema defaults September 3 noon ET; inspected legacy rows use September 3 at 3 p.m. ET. Neither is reused.

## Exact October-only copy changes

| Previous | Prepared October copy |
| --- | --- |
| September 4-6, 2026 / Live via Zoom | October 16-18, 2026 / Live online |
| Friday September 4, 1-5 p.m. ET | Friday October 16, 1-5 p.m. ET |
| Saturday September 5, 9 a.m.-5 p.m. ET | Saturday October 17, 9 a.m.-5 p.m. ET |
| Sunday September 6, 10 a.m.-1 p.m. ET | Sunday October 18, 10 a.m.-1 p.m. ET |
| Materials stay locked until September 3 at noon ET. | October materials and live-room access details are pending confirmation. |
| You will receive a reminder when the working files are released. | Use your personal portal link above; do not share the live room link outside the attendee portal. |
| Claim receipt: Intensive, September 4-6. | Claim receipt: Intensive, October 16-18. |

October introductory copy confirms payment, directs buyers to onboarding and the October schedule, and explicitly says material-release timing and live-room details are pending. It does not promise that those details already exist in production. Claim invitation stays conditional on the existing pass capability. Other programs and September retain their current copy.

## Offline evidence

- `node scripts/verify-confirmation-emails.mjs`: **124 cases passed**, six synthetic HTML previews. Actual TypeScript renderers compared with baseline; preserved values/links/subjects, legacy reminders and claim receipt, explicit eight-offer selection, unknown/evergreen/CPM exclusion, escaping and seat variants.
- `node scripts/verify-october-checkout.mjs`: **38 scenarios passed** using actual signature verifier, dispatcher, enrollment function, email builder, and portal handler with entirely fake DB/network/credentials. Covers all eight offers, amounts/identity/seats, sequential retry token stability and one email, async checkout event, expanded IDs, paid/live gates, bad signatures/IDs/values, disabled switch, unrelated routes, refund/dispute before and after enrollment, revoked access, database failure, pending resources, material allowlist and room time gates.
- The same harness deterministically reproduces **two provider requests for concurrent duplicate deliveries** in the existing sender. This is a documented pre-existing defect, not an exactly-once guarantee. One enrollment survives, but the email-event pending row does not prevent duplicate delivery. No live send occurred. Dedup redesign was expressly excluded: obtain targeted authorization or explicit risk acceptance before release.
- Full Vitest: **11 files / 57 tests passed**. New rendered October portal test checks header, pending states, no September dates, calendar intervals, and checkout-session precedence over an old cached token.
- TypeScript `tsc --noEmit -p tsconfig.app.json` passed. Vite production build and both existing prerender scripts passed. Existing Browserslist age, bundle-size and React Router future-flag warnings remain.
- Six email variants rendered at desktop 800px, mobile 375px and dark 375px: **18 renders passed, no horizontal overflow**. October mobile visually inspected; prior representative desktop/dark variants inspected. HTML and render metrics are committed under `artifacts/confirmation-emails`; PNGs remain local review artifacts. No real inbox compatibility claim.

Mocks do not prove production PostgREST configuration, Stripe endpoint subscription state, or actual email delivery. No production checkout or live attendee token was exercised. No synthetic row was written to the real database.

## Exact runtime and Stripe changes awaiting approval

No new webhook endpoint, event subscription, billing product, credentials or database migration is proposed. The existing endpoint must already receive `checkout.session.completed` and `checkout.session.async_payment_succeeded`; verify its current subscription read-only before release.

1. Deploy the reviewed webhook + portal backend and publish the matching frontend before enabling enrollment. Keep `OCTOBER_DELAY_FULFILLMENT_ENABLED` absent/false until these are verified. A paid October checkout reaching the disabled route receives HTTP 500 for retry rather than a misleading successful fulfillment acknowledgment. Do not take October sales during an incomplete release.
2. With explicit live-routing approval, change ONLY `after_completion.redirect.url` on these eight links from `https://alpcontractorcircle.com/delay-intensive/onboarding` to `https://alpcontractorcircle.com/delay-intensive/onboarding?session_id={CHECKOUT_SESSION_ID}`. Preserve every price, quantity, discount and other setting.

| Offer | Exact payment-link ID |
| --- | --- |
| Public individual early | plink_1UBOioJdDAUSVXbNw0nBuTMh |
| Public company early | plink_1UBOiqJdDAUSVXbNnZaiIeFf |
| Member individual early | plink_1UBOiyJdDAUSVXbNxbJsnSJ7 |
| Member company early | plink_1UBOiuJdDAUSVXbNulbGSceG |
| Public individual standard | plink_1UBOjGJdDAUSVXbNt4u5wMHJ |
| Public company standard | plink_1UBOjHJdDAUSVXbNY01Rra5m |
| Member individual standard | plink_1UBOjIJdDAUSVXbNAOlmW5yY |
| Member company standard | plink_1UBOjJJdDAUSVXbNCcWckNyO |

3. With explicit release approval, set `OCTOBER_DELAY_FULFILLMENT_ENABLED=true` for the existing function runtime. No old events or historical purchases are replayed.
4. Resources remain pending until separately approved configuration is provided:
   - `OCTOBER_DELAY_MATERIALS_RELEASE_AT`: confirmed ISO timestamp including offset/Z, not an invented October date.
   - `OCTOBER_DELAY_MATERIAL_IDS`: comma-separated approved UUIDs from existing published `intensive_materials`. Only those rows are signed for October. Review cross-cohort publication: legacy portal still reads all published material rows, so adding new rows needs its own access-scope review.
   - `OCTOBER_DELAY_ROOM_URLS`: JSON mapping `2026-10-16`, `2026-10-17`, `2026-10-18` to organizer-verified Meet URLs, entered privately. This changes October access scope and requires approval. Server releases each link from one hour before that session through its end, matching the existing portal promise. Missing or malformed values fail closed.
   - New October enrollment `materials_release_at` is PostgreSQL `infinity` (pending sentinel) because the legacy column is NOT NULL. The new portal returns null/pending from cohort config. Verify PostgREST round-trip in an isolated test environment before production enablement; no live DB write was performed. Do not deploy the webhook against the old portal frontend.

## Lovable production release path - not executed

Project: https://lovable.dev/projects/ca1f5675-9834-495b-9938-9a3834ec894f
Backend ref: `nereqcvadsqdbinyhsnr`.

1. Review draft PR #13 and obtain release approval, including the concurrent-email limitation and the resource/access settings above. Confirm **Project settings > Git** points to `mwilkinson82/alpcontractorcircle-704c19b6`; identify active synced branch (expected `main`). Last inspection was baseline `6c5cd51bdf52e018472720848484a3f430267e55`.
2. Inspect unrelated pending Lovable changes and Git-sync deployment behavior before merging. Lovable can deploy backend functions during build; waiting to click Publish does not guarantee backend isolation.
3. Only after approval, merge the reviewed draft to the active branch and verify Lovable synced the exact commit. In the same project's chat, request deployment of reviewed `delay-intensive-webhook`, `delay-intensive-portal`, and `delay-intensive-reminders` shared dependencies. The reminder function needs the cohort-aware claim receipt, not a new scheduled campaign. `delay-intensive-track` imports shared utilities but has no changed behavior.
4. Verify **More > Cloud > Edge functions > [function] > View code / View logs** and the deployed source/status without invoking events. Keep the October enable switch off.
5. Publish the corresponding portal frontend using top-right **Publish > Publish changes** after reviewing the complete publication diff. This button alone is not proof of backend deployment.
6. Apply only approved redirect/resource/runtime changes in the order above, then verify configuration read-only. No test/customer email, payment replay, purchase, backfill or enrollment is part of this release preparation.

Lovable references: https://docs.lovable.dev/integrations/github , https://docs.lovable.dev/features/edge-functions , https://docs.lovable.dev/features/publish . Exact project auto-deployment behavior was not exercised.
