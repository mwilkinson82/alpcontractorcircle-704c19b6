# ALP CPM Schedule Intensive (2-Day) — landing handoff

Status: HOLD PRODUCTION PUBLICATION until Marshall explicitly approves. The supplied Stripe Payment Link is live and wired in the preview. Live dates remain TBA; no calendar date is inferred.

## Locked offer

- Name: ALP CPM Schedule Intensive (2-Day).
- $1,997 USD per seat, one-time. Unlimited enrollment; each checkout registers one attendee with one attendee portal.
- Two live days on Google Meet, recording included, evergreen Learn later.
- Day 1: full CPM — activity IDs/descriptions/durations, logic, baseline, updates, critical path, concurrent-delay discipline, fragments/change orders on path, reports/narrative, P6 as camera.
- Day 2: delay analysis methods — plan vs as-built, collapsed as-built, windows, proof and delay narratives. Broader damages/money belongs to Damage-for-Delay.
- Oracle 30-day free trial of Primavera P6 Professional link on enrollment, or existing company license. P6 Professional is the classroom tool.
- Live dates and times: TBA. Refund/transfer terms: TBD.

## Checkout wired

Every enrollment CTA (navigation, hero, tuition card, closing section, sticky mobile bar) uses one `CPM_CHECKOUT_URL` constant in `src/pages/CpmIntensive.tsx`:

https://buy.stripe.com/5kQ14oe0h5uSgMo7zkeQM1p

Supplied Stripe configuration:

- Product: `prod_VGF6PF6ysZKKtV`.
- Price: `price_1UFibpJdDAUSVXbNO9Fwg6lf`, USD 199700, one-time.
- After payment: `https://alpcontractorcircle.com/cpm-intensive/onboarding?session_id={CHECKOUT_SESSION_ID}`.
- Required individual name, phone, Stripe Customer creation, invoices enabled.

The hosted checkout was opened read-only and displayed the exact product name and $1,997.00 price. No payment was submitted. The product/price IDs and post-payment settings above are Marshall-supplied; account-level readback remains unavailable because the Stripe connector requires reauthentication. This does not prevent linking the supplied hosted checkout.

No Stripe products, prices, payment links or account settings were created or changed. No onboarding route or hub was built. Post-payment behavior and attendee portal verification belong to Prompt 2, outside this change.

## Brand and visual scope

- ALP marketing kit source: `/Users/marshallwilkinson/Documents/OverWatch-ALP-Brand-Kits.tgz`, Marketing tier. Copies in `docs/marketing-brand-kit/`.
- Cream #F7F2EA, near-black #1C1A17, orange #F76A16 used sparingly, terracotta #D97757 labels.
- Instrument Serif headings, Helvetica Neue body, JetBrains Mono labels.
- Preserve the approved schedule-led layout and real PS338 / Tallman crops; Tallman title block remains outside the marketing frame.
- User authorization for the real schedule crops takes precedence over the kit's general fictional-data default.
- Existing take-home pack copy retained. No new curriculum or benefits added.

## QA for this revision

- 375px phone, 834px and 900px unfolded-tablet, 1280px desktop.
- Check no horizontal overflow; all four schedule images load; hero text and schedule image occupy separate columns or stack without collision.
- Day 1 and Day 2 stack at tablet/phone sizes.
- All visible interactive targets at least 44px; mobile checkout remains fixed at bottom with safe-area clearance.
- All five enrollment links point to the exact supplied Stripe URL; no disabled checkout, coming-soon language or one-named-attendee copy remains.
- Vite production build, scoped ESLint and whitespace checks.
- Existing shared bundle-size warning remains. The incoming npm lockfile is stale; local dependencies were installed without altering package manifests or locks.

## Release gate

- [ ] Marshall approves the updated preview and explicitly authorizes production publication.
- [ ] Coordinate readiness of the separately owned post-payment onboarding destination before public launch; do not implement it in this concern.
- [ ] Inspect the full pending Lovable publish diff. Lovable publishes the project bundle; isolate unrelated pending changes before release.
- [ ] After green, publish through Lovable and verify the public `/cpm-intensive` page and its Stripe links.

Dates remain TBA and refunds TBD until Marshall supplies approved values. No Learn, OverWatch/Westside, Delay-page changes, outbound email or DNS work is included.
