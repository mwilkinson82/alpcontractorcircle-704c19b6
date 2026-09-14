# ALP CPM Schedule Intensive (2-Day) — landing handoff

Status: Marshall authorized Lovable production publication on September 14, 2026, including the separately implemented CPM attendee hub. The supplied Stripe Payment Link is live and wired in the preview. Marshall specified next Friday and Saturday, 10 a.m.–5 p.m. both days. Exact numeric dates and timezone are awaiting clarification because the earlier candidate was September 25–26 and the current date is September 14; no weekend is inferred.

## Locked offer

- Name: ALP CPM Schedule Intensive (2-Day).
- $1,997 USD per seat, one-time. Unlimited enrollment; each checkout registers one attendee with one attendee portal.
- Two live days on Google Meet, recording included, evergreen Learn later.
- Day 1: full CPM — activity IDs/descriptions/durations, logic, baseline, updates, critical path, concurrent-delay discipline, fragments/change orders on path, reports/narrative, P6 as camera.
- Day 2: delay analysis methods — plan vs as-built, collapsed as-built, windows, proof and delay narratives. Broader damages/money belongs to Damage-for-Delay.
- Oracle 30-day free trial of Primavera P6 Professional link on enrollment, or existing company license. P6 Professional is the classroom tool.
- Friday and Saturday: 10 a.m.–5 p.m. each day. Calendar dates and timezone pending clarification. Refund/transfer terms: TBD.

## Checkout wired

Every enrollment CTA (navigation, hero, tuition card, closing section, sticky mobile bar) uses one `CPM_CHECKOUT_URL` constant in `src/pages/CpmIntensive.tsx`:

https://buy.stripe.com/5kQ14oe0h5uSgMo7zkeQM1p

Supplied Stripe configuration:

- Product: `prod_VGF6PF6ysZKKtV`.
- Price: `price_1UFibpJdDAUSVXbNO9Fwg6lf`, USD 199700, one-time.
- After payment: `https://alpcontractorcircle.com/cpm-intensive/onboarding?session_id={CHECKOUT_SESSION_ID}`.
- Required individual name, phone, Stripe Customer creation, invoices enabled.

The hosted checkout was opened read-only and displayed the exact product name and $1,997.00 price. No payment was submitted. The product/price IDs and post-payment settings above are Marshall-supplied; account-level readback remains unavailable because the Stripe connector requires reauthentication. This does not prevent linking the supplied hosted checkout.

No Stripe products, prices, payment links or account settings were created or changed. The attendee hub is now implemented separately under Prompt 2; see `docs/cpm-intensive-attendee-hub.md`.

## Brand and visual scope

- ALP marketing kit source: `/Users/marshallwilkinson/Documents/OverWatch-ALP-Brand-Kits.tgz`, Marketing tier. Copies in `docs/marketing-brand-kit/`.
- Cream #F7F2EA, near-black #1C1A17, orange #F76A16 used sparingly, terracotta #D97757 labels.
- Instrument Serif headings, Helvetica Neue body, JetBrains Mono labels.
- Preserve the approved schedule-led layout and real PS338 / Tallman crops; Tallman title block remains outside the marketing frame.
- User authorization for the real schedule crops takes precedence over the kit's general fictional-data default.
- Existing take-home pack copy retained. Curriculum descriptions now reflect Marshall's CPM mastery, hands-on P6, update discipline and delay-proof direction.

## QA for this revision

- Passed at 375px phone, 834px and 900px unfolded-tablet, 1280px desktop with the revised CPM mastery copy.
- Check no horizontal overflow; all four schedule images load; hero text and schedule image occupy separate columns or stack without collision.
- Day 1 and Day 2 stack at tablet/phone sizes.
- All visible interactive targets at least 44px; mobile checkout remains fixed at bottom with safe-area clearance.
- All five enrollment links point to the exact supplied Stripe URL; no disabled checkout, coming-soon language or one-named-attendee copy remains.
- Vite production build, scoped ESLint and whitespace checks.
- Existing shared bundle-size warning remains. The incoming npm lockfile omitted the existing react-helmet-async dependency. The lockfile was repaired before publication without changing package.json or upgrading its locked dependencies.

## Release gate

- [x] Marshall approved the updated landing page and explicitly authorized Lovable production publication.
- [ ] Verify the separately implemented post-payment attendee hub before release; see `docs/cpm-intensive-attendee-hub.md`.
- [ ] Inspect the full pending Lovable publish diff. Lovable publishes the project bundle; isolate unrelated pending changes before release.
- [ ] After green, publish through Lovable and verify the public `/cpm-intensive` page and its Stripe links.

Calendar dates and timezone remain pending clarification; the approved daily hours are 10 a.m.–5 p.m. both days. Refunds remain TBD. No Learn, OverWatch/Westside, Delay-page changes, outbound email or DNS work is included.

## CPM mastery positioning

The hero now leads with “Master the CPM. Protect your time. Prove your delay.” The Oracle 30-day P6 Professional trial is a supporting benefit. The purpose is hands-on construction scheduling and P6 instruction, with everyone building their own schedule.

The page connects construction sequencing and baseline logic to actual-progress updates, prior-update comparisons, concurrent-delay discipline, delay/change-order fragments, critical-path effects, trade stacking and productivity impacts. It explains how schedule analysis establishes the supported delay period for extensions and the time basis for delay-damage calculations, alongside contract, notice, field and cost records. Broader monetary claim packaging remains distinct from this scheduling class.

Do not open Stripe checkout during agent QA unless Marshall explicitly asks. Link verification text messages were triggered by browser visits. Verify checkout href strings only. The five supplied payment links remain unchanged.
