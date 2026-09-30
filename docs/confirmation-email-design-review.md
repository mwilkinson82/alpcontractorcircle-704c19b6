# Delay and CPM confirmation design — review only

Prepared from `6c5cd51bdf52e018472720848484a3f430267e55` on September 30, 2026. Nothing deployed, published, merged, or sent.

## Scope

The existing Delay onboarding confirmation and CPM welcome confirmation use a new confirmation-only 600px table frame modeled on the approved acknowledgment: charcoal `#1C1A17`, orange `#F76A16`, cream `#F7F2EA`, Helvetica/Arial, bold program headings, e-ticket detail card, and orange access CTA. The original shared frame remains intact for reminders, claim receipts, and internal notifications.

Original subjects, sender/reply-to, customer greeting, Delay amounts/currencies/seat counts, ticket IDs, encoded private links, instructions, dates, and delivery logic are preserved. CPM still displays one seat and no monetary amount: its existing renderer does not receive payment amounts. No price is inferred. The personal-welcome queue and its off behavior are unchanged; no live setting was modified.

## Review evidence

Run `node scripts/verify-confirmation-emails.mjs` with Node 24+ from a full Git checkout containing the baseline commit. The script executes the actual TypeScript renderers in an isolated VM; database, credential, and network access throw. It verifies 92 cases, original subject/href/content preservation, exact reminder/claim output, and unchanged delivery/webhook/personal-queue code. It writes five synthetic HTML previews in `artifacts/confirmation-emails/`.

Local Edge/Chromium visual QA: five variants at 800px desktop, 375px mobile, and 375px dark mode (15 renders), all without horizontal overflow. Representative desktop, mobile, and dark images visually inspected. Preview names and amounts are fictional; tokens are deliberately invalid. No checkout links or attendee links were opened. These browser renders do not certify Outlook/Gmail inbox behavior; no test emails were sent. Full application tests/build were not run; the standalone regression requires no installed project dependencies.

## Stale dates — separate decision required

Delay still says September 4–6, 2026, and materials locked until September 3 at noon ET. Those dates are past as of this review. They are deliberately preserved; this change must not be interpreted as a new cohort or authority to roll dates. CPM preserves its supplied `datesLabel` or the existing hub fallback. Release review must explicitly accept the preserved date behavior or authorize a separate date correction.

## Exact release path and gates

1. Review the draft PR and synthetic HTML/PNG previews. Obtain explicit approval for production deployment; this task is preparation only.
2. In [the existing Lovable project](https://lovable.dev/projects/ca1f5675-9834-495b-9938-9a3834ec894f), confirm **Project settings → Git** still points to `mwilkinson82/alpcontractorcircle-704c19b6` and identify the active synced branch. At inspection, Lovable and GitHub both reported the baseline commit above. Keep this draft branch inactive until release approval.
3. After approval, merge the reviewed change to the active release branch (expected `main`) and confirm Lovable has synced that exact commit. Inspect the full pending project diff for unrelated changes first.
4. This is backend email HTML, not a frontend page. In that same project's chat, request deployment of the existing `delay-intensive-webhook` function with the reviewed shared modules. It is the production caller for **both** confirmations. Do not invoke the function, replay a Stripe event, send emails, change webhook configuration/secrets, or change queues. The configured backend project reference is `nereqcvadsqdbinyhsnr`.
5. Open **More → Cloud → Edge functions → delay-intensive-webhook → View code / View logs** to confirm deployed source and deployment status without executing a payment event. Lovable's documented edge-function workflow deploys backend functions during build; do not assume waiting to click Publish protects backend changes. Exact Git-sync auto-deployment behavior for this project was not exercised and must be checked before merging.
6. If a frontend publication is independently needed, its UI path is top-right **Publish → Publish changes**. No frontend files changed here; that button alone is not evidence that the backend email function has deployed. Do not publish an unrelated project bundle to ship this narrow email change.

References: [GitHub sync](https://docs.lovable.dev/integrations/github), [Edge functions](https://docs.lovable.dev/features/edge-functions), [Publish](https://docs.lovable.dev/features/publish). Backend source/deployment verification and date disposition remain release gates. Existing handler deduplication concerns are out of scope.
