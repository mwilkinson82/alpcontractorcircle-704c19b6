# CPM Intensive — architectural redesign

Rebuild `/cpm-intensive` as its own page with its own visual language. Today it imports the Delay Intensive stylesheet and uses `di-*` classes for almost every section shell, so it reads as a reskin of the Delay page to the same audience. This replaces that with a `cpm-*` system built around a schedule-board motif, and puts the 30-day Primavera P6 Professional trial at the top of the page instead of mid-page and in the FAQ.

Offer stays exactly as it is: 2 days, $1,997, unlimited seats, Date TBA, Day 1 CPM / Day 2 Delay analysis, checkout pending. No payment link is invented. Nothing is published.

## 1. Section order (deliberately not Delay's)

1. **Nav** — mark, page name, "See tuition" jump
2. **Hero** — asymmetric: copy left, schedule-board graphic right; P6 trial badge above the headline
3. **Offer strip** — one compact horizontal band: 2 days · $1,997 · unlimited seats · Date TBA · Day 1 CPM / Day 2 Delay analysis
4. **Promise block** — full-width typographic statement: Own the CPM. Build it. Update it. Prove time with it. Not software school. Software is the camera.
5. **Two-day spine** — the primary visual element of the page: Day 1 and Day 2 as two tracks on a schedule board, beats rendered as bars along a critical-path line
6. **What you own after** — four outcomes, numbered, tight two-column list, no card grid
7. **Leave-with packs** — Day 1 pack and Day 2 pack as two schedule-board panels
8. **Before Day 1 / P6 setup** — Windows machine, company license or Oracle 30-day trial, P6 Professional on screen, bring one live job
9. **Who it's for / who it isn't** — stacked opposing pair with a hairline split, not Delay's two side-by-side lists
10. **Tuition** — single seat, $1,997, pending checkout
11. **FAQ**
12. **Closing** + footer + sticky mobile bar

Delay's order — member bar, twin deadline bands, problem, gates, authority, live claim, deliverables, stories, fit, enroll — is not reused. No testimonials, authority photo, or live-claim block, since no CPM content exists for those.

## 2. How the hero leads with the P6 trial

The trial becomes the first thing read, at three levels:

- **Badge above the headline:** "Includes 30 days of Primavera P6 Professional — free Oracle trial"
- **Headline:** owning the schedule (e.g. "Own the CPM. Build it in P6. Prove time with it.")
- **Sub-line:** "Two live days. You build your own schedule in class on a free 30-day P6 Professional trial — the link comes when you lock in."

The mid-page P6 section stays, but demoted to setup detail: machine requirements, license options, what's on screen, what to bring. The FAQ keeps the Windows requirement, the no-Academy-licenses line, and P6 Professional as the classroom tool.

## 3. What gets removed

- `import "./DelayIntensive.css"` is dropped from the CPM page.
- Every `di-*` class on the page is replaced by a `cpm-*` equivalent: nav, hero, brief, deadline band, problem, fit, gates, deliverables, schedule, enroll, price grid, terms callout, capacity, FAQ, closing, footer, mobile CTA.
- Dead `cpm-draft`, `cpm-price-draft`, `cpm-agenda-grid` rules are deleted.
- `CpmIntensive.css` becomes self-contained: its own tokens (cream `#f4f0e8`, ink `#11110f`, signal `#c9482e`), its own type scale, and its own spacing — same ALP brand kit, different composition and rhythm of the page. The Delay page is untouched.

## 4. Graphics — what I build now, what Khan/Drew supply later

Built in this pass, hand-authored CSS and inline SVG, no image files, no gray placeholder boxes:

- **Hero schedule board** — a small Gantt motif: activity rows, staggered bars, a highlighted critical-path chain in the signal color, faint date grid
- **Critical-path rule** — a thin connector line with node dots used as the section divider between the two day tracks
- **Day-track bars** — each agenda beat rendered as a labeled bar on its day's track, so the agenda itself is the schedule visual
- **Pack panels** — schedule-board framing with mono row numbers and hairline rules
- **Logic-tie glyphs** — small finish-to-start arrow marks used as list bullets

Left for real assets: two clearly marked swap slots — one in the hero visual area, one beside the two-day spine — each with an HTML comment and a `data-asset-slot` attribute naming the expected Tallman Island screenshot. Until the files land, the CSS/SVG motif renders in those slots so nothing looks empty. When Khan sends the PDFs, dropping in the images is a one-line change per slot.

## 5. Also updated

- `CPM_SEO.description` still carries the old wording ("WBS, logic, calendars, updates, claims-ready as-built") which no longer matches the current outline; it gets rewritten to two days, Day 1 CPM / Day 2 delay analysis, $1,997, and the included 30-day P6 Professional trial. Canonical stays `https://alpcontractorcircle.com/cpm-intensive`.
- `scripts/prerender-cpm-intensive.mjs` SEO strings updated to match.
- I will confirm `og-contractor-circle.png` actually exists in `public/`; if it does not, I will point the share image at an existing file rather than leave a broken reference.

## 6. Confirmations

- No Stripe or `buy.stripe.com` URL anywhere. Checkout stays disabled with "Checkout opens when date + Payment Link land".
- No dates invented. Date TBA everywhere.
- Nothing deployed or published. Sandbox only.
- Banned words avoided in all page copy.
- The Delay Intensive page, its stylesheet, and the homepage field-notes band are not touched.

## Technical notes

Files changed: `src/pages/CpmIntensive.tsx` (rewritten markup, same route and same exported `CPM_SEO` shape), `src/pages/CpmIntensive.css` (replaced with a standalone system), `scripts/prerender-cpm-intensive.mjs` (SEO strings). Route registration in `src/App.tsx` and the Helmet setup stay as they are. QA with Playwright at 1280, 800, and 390 to confirm the hero badge, the two-day spine, the pending checkout state, and that the sticky bar does not cover content.
