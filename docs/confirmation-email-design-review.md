# Delay and CPM confirmation design — review only

Prepared from `6c5cd51bdf52e018472720848484a3f430267e55` on September 30, 2026. Nothing deployed, published, merged, or sent.

## Scope

The existing Delay onboarding confirmation and CPM welcome confirmation use a new confirmation-only 600px table frame modeled on the approved acknowledgment: charcoal `#1C1A17`, orange `#F76A16`, cream `#F7F2EA`, Helvetica/Arial, bold program headings, e-ticket detail card, and orange access CTA. The original shared frame remains intact for reminders, claim receipts, and internal notifications.

Original subjects, sender/reply-to, customer greeting, Delay amounts/currencies/seat counts, ticket IDs, encoded private links, and delivery logic are preserved. Following explicit authorization to correct the October Delay cohort copy, only enrollments with one of the eight verified October Stripe payment-link IDs receive October logistics. The existing database field `stripe_payment_link_id` selects presentation; no current-date, purchase-time, or price heuristic is used. All other offers retain their prior output and never receive October logistics. CPM still displays one seat and no monetary amount: its existing renderer does not receive payment amounts. No October CPM event is introduced. The personal-welcome queue and its off behavior are unchanged; no live setting was modified.

## Review evidence

Run `node scripts/verify-confirmation-emails.mjs` with Node 24+ from a full Git checkout containing the baseline commit. The script executes the actual TypeScript renderers in an isolated VM; database, credential, and network access throw. It verifies 124 cases: all eight October offers and pass variants; legacy, unknown, synthetic evergreen, and CPM exclusion; subject/href/value preservation; exact reminder/claim output; and unchanged delivery/webhook/personal-queue code. It writes six synthetic HTML previews in `artifacts/confirmation-emails/`. `delay-october.html` is the newly verified October version; other Delay previews demonstrate preserved legacy behavior.

Local Edge/Chromium visual QA: six variants at 800px desktop, 375px mobile, and 375px dark mode (18 renders), all without horizontal overflow. Representative desktop, mobile, and dark images visually inspected. Preview names and amounts are fictional; tokens are deliberately invalid. No checkout links or attendee links were opened. These browser renders do not certify Outlook/Gmail inbox behavior; no test emails were sent. Full application tests/build were not run; the standalone regression requires no installed project dependencies.

## October verification and copy diff

Read-only verification on September 30, 2026:

- `src/pages/DelayIntensive.tsx`, schedule at lines 71–94, and `src/pages/DelayIntensiveTerms.tsx`: October 16–18, 2026. Times: Friday 1–5 p.m., Saturday 9 a.m.–5 p.m., Sunday 10 a.m.–1 p.m., Eastern.
- Organizer calendar events titled **Damage for Delay Intensive — Friday Preserve**, **Saturday Prove + Price**, and **Sunday Build** confirm those dates/times with UTC-04:00 offsets. Their descriptions explicitly identify the October live cohort and require keeping room links inside the attendee portal. Calendar location is Google Meet; the source landing still says Zoom. No private meeting URL is embedded in code or previews.
- September 2/3 marketing email **Sold Out — next Delay Intensive is Oct 16–18** independently announces October 16–18.
- Stripe account `acct_1HPL9DJdDAUSVXbN`, read-only payment-link listing: all eight IDs in `delay-confirmation-cohort.ts` carry `metadata.launch=delay_damages_intensive_2026_10`; public/member and early/standard variants are explicitly identified. The old accepted payment links carry `delay_damages_intensive_2026_09`.
- No October materials-release timestamp was verified. Database schema still defaults `materials_release_at` to September 3 at noon ET; existing non-preview rows inspected in aggregate use September 3 at 3 p.m. ET. Neither is an October release policy. October 15 at noon is the enrollment-close deadline, not evidence of a materials-release deadline.

For **mapped October offers only**, the exact copy changes are:

| Previous copy | New copy |
| --- | --- |
| September 4–6, 2026 · Live via Zoom | October 16–18, 2026 · Live online |
| Friday, September 4 · 1:00–5:00 p.m. ET | Friday, October 16 · 1:00–5:00 p.m. ET |
| Saturday, September 5 · 9:00 a.m.–5:00 p.m. ET | Saturday, October 17 · 9:00 a.m.–5:00 p.m. ET |
| Sunday, September 6 · 10:00 a.m.–1:00 p.m. ET | Sunday, October 18 · 10:00 a.m.–1:00 p.m. ET |
| Materials stay locked until September 3 at noon ET. | Check your private attendee portal for material availability and live room access. |
| You will receive a reminder when the working files are released. | Use your personal portal link above; do not share the live room link outside the attendee portal. |

Agenda topic descriptions, personal access URL, revocation notice, and all monetary/purchase details remain unchanged. September confirmations remain September. Unknown/evergreen IDs receive no October copy; this patch does not create an evergreen fulfillment flow or grant live attendance. CPM preserves its existing `datesLabel`/fallback and has no October scheduling change.

## Fulfillment and release blockers found during verification

The existing `delay-intensive-webhook` accepts only the two September IDs. It currently ignores all eight October IDs as `unrelated_payment_link`. October links also redirect to the bare onboarding page without `{CHECKOUT_SESSION_ID}`. There is no Delay cohort table or cohort/mode column. The confirmation can now render the correct October copy from an existing enrollment's verified payment-link field, but this does **not** wire October purchases into enrollment or delivery.

Do not claim October checkout-to-confirmation fulfillment is fixed. Correcting that path needs separately authorized fulfillment work, including reliable cohort persistence, redirect/access handling, and cohort-safe material/reminder behavior. The portal currently reads one `INTENSIVE_ZOOM_URL` secret, and the reminder scheduler still has September dates. No secrets were read or changed and no event schedule was changed. Confirm October room delivery and materials policy before releasing a complete October buyer flow. Existing legacy/evergreen separation beyond the allowlist remains outside this presentation change.

## Exact release path and gates

1. Review the draft PR and synthetic HTML/PNG previews. Obtain explicit approval for production deployment; this task is preparation only.
2. In [the existing Lovable project](https://lovable.dev/projects/ca1f5675-9834-495b-9938-9a3834ec894f), confirm **Project settings → Git** still points to `mwilkinson82/alpcontractorcircle-704c19b6` and identify the active synced branch. At inspection, Lovable and GitHub both reported the baseline commit above. Keep this draft branch inactive until release approval.
3. After approval, merge the reviewed change to the active release branch (expected `main`) and confirm Lovable has synced that exact commit. Inspect the full pending project diff for unrelated changes first.
4. This is backend email HTML, not a frontend page. In that same project's chat, request deployment of the existing `delay-intensive-webhook` function with the reviewed shared modules. It is the production caller for **both** confirmations. Do not invoke the function, replay a Stripe event, send emails, change webhook configuration/secrets, or change queues. The configured backend project reference is `nereqcvadsqdbinyhsnr`.
5. Open **More → Cloud → Edge functions → delay-intensive-webhook → View code / View logs** to confirm deployed source and deployment status without executing a payment event. Lovable's documented edge-function workflow deploys backend functions during build; do not assume waiting to click Publish protects backend changes. Exact Git-sync auto-deployment behavior for this project was not exercised and must be checked before merging.
6. If a frontend publication is independently needed, its UI path is top-right **Publish → Publish changes**. No frontend files changed here; that button alone is not evidence that the backend email function has deployed. Do not publish an unrelated project bundle to ship this narrow email change.

References: [GitHub sync](https://docs.lovable.dev/integrations/github), [Edge functions](https://docs.lovable.dev/features/edge-functions), [Publish](https://docs.lovable.dev/features/publish). Backend source/deployment verification and the October fulfillment/materials/access blockers above remain release gates. Existing handler deduplication concerns are out of scope.
