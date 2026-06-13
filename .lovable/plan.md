## What you're seeing now vs. what you want

Current state: both sections render as straight, upright rectangles in a tidy grid. They got cleaner, but they lost the "deck of cards thrown across the table" feeling from labs.google that you wanted in the first place.

Goal: that exact labs.google energy — big tilted/fanned cards, alternating rotation, generous overlap, an oversized colored blob shape behind them, on the paper background, with motion that scrubs as you scroll. Two distinct moments:

1. **Pillars** ("Build the company behind the projects" — 4 cards: Bi-weekly Calls, Bootcamp, Community, Portal) → labs.google **tall portrait fan** (your first screenshot)
2. **Every asset has a job to do** → labs.google **horizontal landscape carousel** of larger bento cards drifting left→right (your second screenshot)

## Section A — Pillars: tall portrait fan

Layout
- Four tall portrait cards (~ aspect 3/4), shoulder to shoulder, slightly overlapping (~ −40px gutter)
- Alternating rotation: −6°, +3°, −2°, +5° (with slight randomness so it feels hand-thrown, not mechanical)
- Each card pops up ~80px on hover, rotation eases to 0°, neighbors dim slightly
- One oversized brand-blob shape (orange or brick) sits behind the row, partially clipped by the section — same role as the green/pink blobs on labs.google
- Card content stays as-is: number, icon, name, outcome line, 3 bullets. Portal card keeps the "↓ every asset has a job to do" handoff
- Mobile: collapses to a horizontal snap-scroll of the same tilted cards, one at a time

Motion
- Cards enter from a tight stack at center, fan outward to final positions as the section enters the viewport (GSAP scrub)
- Subtle continuous float (1–2px sway) when idle so it feels alive, not frozen

## Section B — Asset deck: horizontal labs-style carousel

Layout
- Larger landscape bento cards (~ aspect 16/10), one row, drifting horizontally
- Each card slightly tilted (−3° to +4°), partial overlap, screenshot fills the top 60% of the card with no cropping, copy beneath
- A second oversized blob shape behind (different color than Section A) anchored to the right side, partially clipped
- Cards include: portal, replays, templates, handbook, Discord, etc. — same `productProofItems` data
- Desktop: native horizontal scroll with snap + GSAP-driven auto-drift on idle, paused on hover/focus; chevron affordances at the edges
- Mobile: same horizontal snap-scroll, smaller card width

Motion
- On scroll-in: cards rise from below + tilt into place, staggered
- While the section is in view, the row drifts slowly left→right (auto-scroll), pausing when the user grabs/hovers
- Hover lifts a card, levels its rotation, and scales the screenshot inside

## Shared visual language

- Background: existing paper `#f5f3ee` — no SystemsField, no abstract noise
- Blob shapes: two large soft-edged organic shapes per section (one warm — brick/orange tint, one cool — slate/sage tint) at low opacity, partially clipped by section edges. Pure CSS (border-radius blobs + filter: blur) — no new libraries
- Card chrome: white card, ~24px radius, soft shadow, 1px hairline border, no Google color accents
- Type: keep current Google Sans display + Fira Sans body
- Both sections share the same tilt vocabulary so they read as siblings

## Technical notes

- Tilt + fan-out: GSAP `ScrollTrigger` with `scrub`, same setup pattern already in `setupAssetDeck`. Reuse that hook, split into `setupPillarFan` and `setupAssetCarousel`
- Auto-drift in Section B: GSAP infinite tween on a track wrapper, killed/resumed via pointer events
- Blob shapes: two absolutely-positioned `<span>` decorations per section with `border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%`, `filter: blur(40px)`, `mix-blend-mode: multiply`
- All scoped to `ContractorCircle.tsx` + `ContractorCircle.css`. No new dependencies. No changes to hero, intro motion, problem, proof, fit, pricing, footer

## What I need from you

Nothing required — I have everything I need from `productProofItems` and existing screenshots. **Optional** if you want it to feel even closer to labs.google:

1. **Blob color call** — should the warm blob be your existing `--cc-orange` brick, or a softer dusty peach? Pick one.
2. **Pillar card visuals** — Bootcamp and Community currently use the same screenshots as their proof items. If you want hero-style visuals tailored to each pillar (like the dreambeans / Literature Insights illustrated cards on labs.google), drop in 4 images. Otherwise I keep current screenshots.
3. **Auto-drift speed in Section B** — slow ambient (~60s per loop) or more present (~25s per loop)? I'll default to ~45s if you don't pick.

Approve and I'll build it.
