## Problem

At the current viewport (~1163px CSS wide), the fan-cards section in `ContractorCircle.tsx` falls under the desktop rules (>860px) and the bottom of the deck (cards + chevrons) is being cut off.

Cause: the desktop `.cc-fan-stage` height is `clamp(780px, 72vw, 940px)` (~837px at this width), but the rotated outer cards — positioned at `top: clamp(156px, 24vw, 276px)` with `height: clamp(420px, 34vw, 580px)` and rotated up to ~22° around a far transform-origin — extend further down than that, then get clipped because `.cc-fan-stage` plus the surrounding `.cc-pillars-section` cap the vertical room. The chevron controls (`position:absolute; bottom:24px`) get pushed off-screen alongside the bottom of the fanned cards.

## Fix (CSS only, scoped to the fan)

Edit `src/pages/ContractorCircle.css`:

1. **`.cc-fan-stage` (desktop rule near line 6753)** — raise the floor so the arc has room on narrow desktops:
   - `height: clamp(880px, 82vw, 1020px)` (was `clamp(780px, 72vw, 940px)`)
   - keep `overflow: visible`
2. **`.cc-pillars-section` (line 6740)** — ensure it doesn't clip the fan: add `overflow: visible` on the desktop rule (the tablet/mobile media queries already set their own values, so this is safe).
3. **Add a new breakpoint between tablet and desktop** `@media (min-width: 861px) and (max-width: 1200px)` that:
   - sets `.cc-fan-stage { height: clamp(900px, 88vw, 1060px); }`
   - nudges `.cc-fan-track` `top` down slightly (e.g. `top: clamp(180px, 22vw, 240px)`) so the arc center sits where the cards aren't clipped
   - keeps `.cc-fan-controls` pinned `bottom: 28px` so chevrons land just under the deck

No JS or component changes; no other sections touched.

## Verification

- Reload preview at ~1163px and confirm the full fan + chevrons are visible with no clipping.
- Spot-check 1280px and 1440px to make sure the fix doesn't introduce excess whitespace.
- Spot-check 768px (tablet) and 390px (mobile) — those rules are untouched and should look identical.
