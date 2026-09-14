# CPM Schedule Intensive — sandbox handoff

Status: HOLD PUBLICATION. Marshall must approve the page and live dates before checkout is opened or the site is published.

## Offer and page

- Route: `/cpm-intensive` in Lovable project `ca1f5675-9834-495b-9938-9a3834ec894f`.
- Repository: `mwilkinson82/alpcontractorcircle-704c19b6`.
- Two live days on Google Meet; $1,997 tuition; unlimited enrollment.
- Day 1: full CPM, including activity standards, logic, baseline, updates, critical path, concurrent-delay discipline, fragments/change orders on the path, reports/narrative and P6 as camera.
- Day 2: plan vs as-built, collapsed as-built, windows, proving delay and delay narratives.
- P6 Professional classroom build tool. Oracle 30-day trial link supplied on enrollment; existing company license also works.
- Recording included for attendees; evergreen Learn course after recording. No Learn engineering in this change.
- ALP House marketing brand: editorial cream #F7F2EA, ink #1C1A17, rationed orange #F76A16, Instrument Serif headings, Helvetica Neue body and JetBrains Mono labels. PS338 critical-path hero in a dark bracket frame, schedule crops and Tallman longest-path example. Source images reused from the verified Lovable/GitHub asset commit `2fd083bae56828705d4b65b4acbe82cb2e31d813`; no new Drive transfer required. Images upright; Tallman title block cropped out of its marketing frame via CSS.
- Existing take-home pack promises retained from the incoming page; Marshall should confirm those materials before launch.
- Dates remain TBA. Candidate: Friday–Saturday, September 25–26, 2026. September 27 remains free for Contractor Circle. Daily hours and timezone still needed.

## Pending before accepting payment

1. Marshall locks dates, daily times and timezone.
2. Marshall approves refund/transfer terms. The old membership cancellation link was removed; the page now directs to CPM terms pending.
3. Restore access to Marshall's existing Stripe account. Connector returned reauthentication required on September 14; no products, prices or payment links were created.
4. Verify the actual Oracle 30-day trial acceptance screen and training eligibility before enrollment opens. Official P6 installation docs confirm download via https://edelivery.oracle.com; the authenticated trial terms could not be inspected here. Preserve the approved offer, but do not call that license verification complete.
5. Create and verify the $1,997 one-time Payment Link in the existing account, then wire the checkout button. Do not reuse Delay or membership checkout.
6. Confirm how attendees receive Google Meet details. Calendar creation and email sending were not performed.

## Exact Stripe Dashboard handoff (after dates are locked)

1. Open https://dashboard.stripe.com/payment-links in Marshall's existing account. Check the account name and live mode; do not create a second account.
2. Click **+ New**, choose **Products or subscriptions**. Search for **CPM Schedule Intensive** first so an existing product is not duplicated.
3. If absent, click **+ Add a new product**. Name: **CPM Schedule Intensive**. Price: **USD 1,997.00**, **one time**. Click **Add product**. Do not create alternate SKU names, recurring billing or a subscription trial; the P6 trial is provided by Oracle.
4. Use quantity 1 for one named attendee. Leave any total-payment/seat limit unset. Collect attendee name and email.
5. Under **After the payment** → **Confirmation page**, add the enrollment note below. Add the confirmed date/time and approved meeting-delivery instructions before enabling checkout.
6. Click **Create link**, copy the `https://buy.stripe.com/...` URL, and inspect the hosted checkout for the correct account, product, currency and total. No live charge is needed for this read-only check.
7. Replace the disabled button in `src/pages/CpmIntensive.tsx` with an anchor to the verified URL labelled **Checkout — $1,997**. Remove the checkout-not-connected copy and preview notice only when Marshall approves launch. Keep publication on hold until the final green light.

Stripe references: [Create Payment Links](https://docs.stripe.com/no-code/payment-links), [After payment confirmation](https://docs.stripe.com/payment-links/post-payment).

### Enrollment note ready to paste

You’re enrolled in the CPM Schedule Intensive: two live days with Marshall Wilkinson on Google Meet. The recording is included. For classroom software, use your company’s Primavera P6 Professional license or get Oracle’s 30-day free trial through Oracle Software Delivery Cloud: https://edelivery.oracle.com. Sign in to Oracle, select Primavera P6 Professional Project Management, review Oracle’s trial terms and install P6 Professional on your Windows machine before Day 1.

Add the confirmed class dates, daily times/timezone and meeting-delivery instructions here before saving the live link. Do not promise that an email was sent unless delivery is implemented and verified.

## Verification

- Production Vite build and CPM metadata generation pass.
- TypeScript app check passes.
- Scoped ESLint passes; `git diff --check` passes.
- Incoming npm lockfile is stale (missing react-helmet-async entries). Local verification used `npm install --no-package-lock`; dependency manifests/locks were left unchanged. `npm ci` remains a pre-existing limitation.
- Existing shared bundle-size warning remains; no unrelated bundle refactor.
- Browser QA at 320px, 375×812, 768×1024 and 1440px desktop; verify loaded images, no horizontal overflow, tuition anchor, disabled checkout, expandable recording FAQ, sticky footer clearance.
- Schedule source crops remain the incoming resolution: useful visual evidence, not intended as fully legible schedule documents at phone size.

## Publish gate

- [ ] Marshall approves the visual preview.
- [ ] Dates, daily hours and timezone approved and reflected throughout.
- [ ] Refund/transfer terms and take-home materials confirmed.
- [ ] Oracle trial flow verified.
- [ ] Existing-account Stripe checkout and enrollment note verified.
- [ ] Google Meet fulfillment ready.
- [ ] Marshall explicitly says publish.
- [ ] Check the complete pending Lovable publish diff before publishing: Lovable publishes the project bundle, not one independent route. If unrelated pending changes exist, isolate or resolve them first.
- [ ] After green, publish through Lovable and verify the public `/cpm-intensive` page plus hosted checkout. No DNS changes needed for this existing route.

Out of scope remains Learn portal, OverWatch/Westside, Delay page changes, outbound email and DNS.

## Marketing brand alignment

Brand source: `/Users/marshallwilkinson/Documents/OverWatch-ALP-Brand-Kits.tgz`, `Marketing/README.md` and its exact color/type token files. Copies are in `docs/marketing-brand-kit/`. The Marketing tier governs this page; the Application tier does not. The archive's old deploy map is historical: the verified repo and hold-publish instruction above control this release.

Marshall approved the schedule-led composition and asked for its skin to match the local marketing brand kit. The layout, offer and curriculum remain intact. The user's explicit request for real PS338 and Tallman crops governs those images despite the kit's default fictional-data guidance. Orange primary buttons use dark ink labels for readable contrast.
