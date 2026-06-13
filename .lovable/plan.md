# Hero Intro Motion — Chart Rewrite + Word Cloud Restyle

Two scoped edits to `src/pages/HeroIntroMotion.tsx` and `src/pages/ContractorCircle.css`. No layout or timing changes beyond what's required.

## 1. Rewrite the chart

Replace the dollar-stack ($$$) treatment in the Risk column with a labeled risk item, and add the matching `-$175,000` line under Planned Profit in the Profit column so the math reads cleanly.

**Profit column**
- Label: `Profit`
- `$500,000` — caption: `Planned Profit (per estimate)`
- New line below: `−$175,000` — caption: `Risk impact`

**Risk column**
- Label: `Risk`
- Replace `$$$ $$$ $$$` with a single risk item:
  - Title: `Late selections & schedule compression`
  - Value: `$175,000`
- Keep the existing `cc-intro-risk-exposure` slot, but repurpose it to hold the titled risk item (same fade-in timing).

**Bottom summary (unchanged structure)**
- `Current Expected Profit` → `$325,000` (500k − 175k)

Technical notes:
- Remove the `riskDollars` array and the `.cc-intro-risk-dollars` JSX block.
- Reuse `.cc-intro-risk-exposure` styles for the new risk item, adjusted to left-align the title above the value rather than the current large-number + small-caption layout. Add a sibling `-$175,000 / Risk impact` block in the profit column using the existing `strong` + `small` pattern.
- Keep all current animation delays (`3440ms`, `3880ms`, `4860ms`) so total runtime stays 6900ms.

## 2. Word cloud on white, gray → ink fill

While the word cloud is on screen, the intro background becomes white and each word fades in as a light gray, then transitions to the headline ink color before the chart builds.

- Add a white background layer to `.cc-hero-intro-motion` (or its `::before`) that fades out around the same time the chart starts building (~2860ms), revealing the existing paper/ink hero behind it.
- Update `.cc-intro-word` color to start at a light gray (e.g. `hsl(var(--muted-foreground) / 0.55)`) and animate to `hsl(var(--foreground))` partway through `cc-intro-word` (e.g. color transition between 55% → 85% of the keyframe).
- `.cc-intro-word.is-risk` keeps the brick accent end-state (same gray → accent transition).
- Grid + scan-line colors adjusted so they remain visible on white (darker hairlines).

## Out of scope
- No changes to which words appear, their positions, delays, or total duration.
- No change to the video that plays after the intro.
- No change to anywhere outside the hero intro.
