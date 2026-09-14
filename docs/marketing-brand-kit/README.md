# ALP House — Marketing / Editorial tier

**This is the branding for public marketing surfaces — sites, landing pages,
link-in-bio (e.g. startaos.com, and the OverWatch marketing site).** Product UI
uses the warmer-white App tier instead (see `../Application/`), which is a
**deliberately separate design system** (the Anthropic model — see `../README.md`).
The full house spec is `../ALP-House-Design-System.md`; this is the tier summary.

> **Live reference: https://overwatch-marketing.vercel.app/** — verified 2026-07-13
> (read live from the page's `:root`). The tokens below match production exactly:
> cream grounds, orange `--signal #F76A16`, `--clay #D97757`, teal `--good #2FA98C`,
> Instrument Serif + Helvetica Neue. Archivo loads only at weight 800, for the
> OverWatch wordmark — body stays Helvetica Neue.

---

## 1. Color — editorial cream ground

The marketing tier's signature is the **deeper editorial cream** ground. Only the
four ground tokens differ from the app; everything else is shared house tokens.
Exact values in `tokens/colors.css`.

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F7F2EA` | page ground (warm editorial cream) |
| `--surface` | `#F8F4ED` | cards / raised work-surfaces |
| `--paper2` | `#EFEADE` | inset fills, chips, toggle tracks |
| `--edge` | `#DCD5C8` | 1px hairline borders & rules |
| `--ink` | `#1C1A17` | primary text |
| `--muted` | `#6B655D` | secondary text, labels |
| `--dark` | `#171310` | dark panels: stat tiles, media frames, pop-up graphic |
| `--signal` | `#F76A16` | **rationed** orange — CTAs + true emphasis only |
| `--clay` | `#D97757` | eyebrows & small warm accents |
| `--good` / `--crit` / `--warn` | `#2FA98C` / `#B5432E` / `#C69A3C` | semantic state (not brand accents) |

**One rationed accent.** If two things on a screen are orange, one is wrong —
downgrade the lesser to `--clay`. Never introduce a second brand accent or a tech
gradient. `--good`/`--crit`/`--warn` are semantic (scorecard/state) and don't
count against the one-accent rule.

## 2. Type

- **Instrument Serif** (400) — all display/headings + big editorial statements. `letter-spacing:-.01em`, `line-height:1.03–1.2`.
- **Helvetica Neue** — body & UI. 17px / 1.65, `letter-spacing:.005em`, ~60ch measure.
- **JetBrains Mono** (500/700) — eyebrows, labels, numbers, meta. Uppercase, `.18–.22em` tracking.

A **mono eyebrow sits above almost every section title** — it's the house
signature. The rhythm is: mono eyebrow → serif headline → muted sub. Responsive
clamp scale in `tokens/type.css`.

## 3. Structure & layout

- **Hairlines, not boxes.** Build structure from `1px solid var(--edge)` rules + whitespace. Rounded cards only when a thing is genuinely a discrete object.
- `.wrap{max-width:1160px}` for sites (interior editorial pages use a tighter 1000px). `section{padding:64px 0; border-top:1px solid var(--edge)}`.
- **Spacing gotcha:** never use `.wrap{padding:0 28px}` shorthand — it zeroes section vertical padding and collapses the rhythm. Use `padding-left/right` longhand.
- Sticky nav: `rgba(247,242,234,.82)` + `backdrop-filter:saturate(140%) blur(10px)` + bottom hairline.

## 4. Buttons

One primary (orange `--signal`) CTA per view; secondary actions use dark (`--ink`)
or outline (hairline + transparent). Arrow affordance `→` in CTA labels
("Start free →"). Full CSS in `../ALP-House-Design-System.md` §5.

## 5. Signature components (marketing)

Mono eyebrow · **app-window mock** (fake product UI on a dark/cream card) ·
**dark stat tiles** · **bracket-corner `[ ]` frame** around hero media ·
**Anthropic-style pop-up card** (fixed bottom-right, surfaces on scroll) ·
**accordion cards** (CSS-drawn +/× toggle) · **scorecard table** ·
chaos↔operating-system toggle, pill tabs, SOP stepper, radio-circle quiz. Specs
and reference implementations in `../ALP-House-Design-System.md` §6.

## 6. Motion, voice, mobile, SEO

- **Motion:** subtle and meaningful — fade-and-rise reveal on scroll (stagger siblings ~90ms), "the current" running a system, sequential draw-in, scroll-fill statement. Always guard behind `prefers-reduced-motion`. Canonical JS/CSS in the house spec §7.
- **Copy voice:** short, plain, confident; tied to money / risk / capacity. Active voice, no hype. Controls are literal ("Publish" → "Published").
- **Mobile-first:** design the **375px** column first (most traffic is Instagram in-app browser), tap targets ≥44px, test at 320px, respect iOS safe-area.
- **Fictional data only** on public surfaces (Summit Builders / ALP Team — never real client names).
- **SEO boilerplate** on every public page: title + meta description, canonical, robots, `theme-color #F7F2EA`, favicon set, Open Graph + Twitter card, JSON-LD. See house spec §10.

---

For anything not covered here, `../ALP-House-Design-System.md` is the source of truth.
