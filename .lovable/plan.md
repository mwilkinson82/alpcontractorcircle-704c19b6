# Rebuild "What's Inside" — Pillars + Fan-Out Deck

Two sections in the page currently try to do the same job and both fall short: `ProductDeckSection` ("The work has somewhere to live") wraps the tools in a Google-esque colored asymmetric backdrop, and `cc-stack-card-offer-wall` ("Every asset has a job to do") renders them in a dark carousel where the screenshots get cropped. Replace both with:

1. **Section A — "What's inside" (4 pillars)** on clean paper, four equal pillar cards
2. **Section B — "Every asset has a job to do" (labs-style fan-out deck)** on clean paper, screenshots full-bleed and uncropped

Order on the page stays as you set it: pillars sit where ProductDeckSection sits today (between the problem card and the proof card), the fan-out deck stays where the offer wall sits today (between proof and "owner stops being the router").

---

## Section A — 4 Pillar Cards

Headline: **"What you actually get."** Eyebrow: `What's Inside`. Subhead: one line tying calls, bootcamp, community, and portal into a single operating system around the owner.

Four equal cards, 2x2 on desktop, single column on mobile. Each card has a real visual at the top (not just an icon), the pillar name, a one-line outcome, and three bullets.

| # | Pillar | Visual | Outcome line | Bullets |
|---|---|---|---|---|
| 01 | Bi-weekly Calls + Curriculum | Call/replay still | "Bring the issue. Leave with the move." | Live with Marshall · Set curriculum, not open Q&A · Replays stay in the portal |
| 02 | Monthly Bootcamp | Bootcamp screenshot | "Build the system live, in one sitting." | One operating system per month · Templates + SOPs walk out the door · Replay + workbook stay |
| 03 | Community | Discord screenshot | "The room between sessions." | Members-only Discord · Post overnight, get a read by morning · Threads feed the next call |
| 04 | Portal (+ AOS + Tools + Templates + Handbook + Ask Marshall + SOP Builder) | Portal screenshot | "One front door for everything else." | AOS workspaces + seats included · 26+ templates, growing tool set · Ends with: **"…and every asset has a job to do ↓"** linking to Section B |

The Portal card's footer link is the explicit handoff into Section B so the fan-out deck reads as "here's everything inside the portal" rather than a second pile of cards.

No colored asymmetric backdrop, no `SystemsField` accent layer behind these cards. Same paper/ink palette as the rest of the page, with the brick-orange used only as accent on the Portal card to mark it as the gateway.

---

## Section B — Fan-Out Deck ("Every asset has a job to do")

Eyebrow `Inside the Circle`, headline kept: **"Every asset has a job to do."**

Behavior: cards start stacked center-stage (like a deck of cards), then **fan into a grid as the section enters the viewport**, driven by the existing GSAP/ScrollTrigger setup. On desktop the fanned state is a 3-column grid; on mobile the cards land in a single column with a softer stagger.

Per card:
- Full-bleed screenshot at the top (`object-fit: contain` against a soft paper backdrop so nothing is cropped — this is the bug fix you flagged)
- Eyebrow + headline (existing `headlineLines`)
- One-paragraph body (existing `body`)
- Tag chips for `points[].label`
- Footer: primary link if present (`Open portal`, `Open AOS app`, `Walk through Why AOS`, etc.)
- Hover: card lifts, screenshot scales slightly, subtle ink shadow

Source data is the existing `productProofItems` array — no copy rewrites required, just better presentation. The dark `cc-offer-wall-shell` carousel and its left/right scroll controls go away entirely.

No `SystemsField` accent in the background. Paper/ink only, with the brick accent reserved for the small "Member asset" arrow chip.

---

## Out of scope

- No changes to the hero intro motion, hero copy, problem card, shift card, proof card, fit card, onboarding card, close card, pricing card, footer, or nav.
- No copy rewrites on the 8 existing assets — just presentation.
- No new screenshot assets — uses what's already in `public/manus-storage/`.

---

## Technical notes

**Files touched**
- `src/pages/ContractorCircle.tsx` — replace `ProductDeckSection()` with a new `PillarsSection()` (4 pillar cards). Replace the `cc-stack-card-offer-wall` article with a new `cc-stack-card-asset-deck` article that renders `productProofItems` as a fan-out deck. Add a small `pillars` array near `installedItems` for the 4 pillar definitions. Keep all GSAP `.cc-stack-card` selectors working — the new asset-deck article keeps the `cc-stack-card` class.
- `src/pages/ContractorCircle.css` — add `.cc-pillars-section`, `.cc-pillar-card`, `.cc-asset-deck`, `.cc-asset-card` styles. Delete/replace `.cc-product-deck-section`, `.cc-product-deck-*`, `.cc-offer-wall-*` styles. Remove the asymmetric color accents that bleed into these sections.
- No changes to `HeroIntroMotion.tsx`.

**Fan-out animation**
- Initial state: cards absolutely positioned, stacked at the section's vertical center with small rotation offsets (−4°, −1°, +2°, +5° staggered).
- Scroll trigger fires when the section's top hits ~70% of viewport. GSAP timeline transitions each card to its grid slot (`position: relative` via FLIP, or animated `transform: translate()` + `rotate(0)` with the grid pre-laid out behind).
- Respect `prefers-reduced-motion` → cards render in their final grid positions with no animation.

**Pillar visuals**
- Reuse `exact-bootcamp_9c719283.png`, `exact-community_e45de5f2.png`, `portal-ask-marshall_2e6c40e1.png` from `public/manus-storage/`. For Bi-weekly Calls, reuse `exact-bootcamp` or `portal-ask-reply` — pick whichever reads "live call" best at thumbnail size.

**Screenshot fix**
- Card image container uses `aspect-ratio: 16 / 10`, `overflow: hidden`, `background: hsl(var(--paper))`, image inside is `width: 100%; height: 100%; object-fit: contain` so nothing is cropped — this is the core fix for "you can't see the screenshots."

**Section ordering on the page** (unchanged from your last pass)
```text
Hero video
→ "Build the company behind the projects" (hero copy)
→ Card stack #1: shift, problem
→ Pillars section  ← was ProductDeckSection
→ Card stack #2: proof, asset deck (was offer-wall), installed, fit, onboarding, close, pricing
→ Stats, mega close, footer
```
