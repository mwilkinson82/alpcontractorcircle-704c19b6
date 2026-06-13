Implementation plan

1. Remove the unwanted background elements
- Delete the green blob behind the “Everything inside the Circle” section.
- Delete the floating background words in that section entirely: Contract, Schedule Delay, Systems and Procedures, General Conditions, CPM Schedule, etc.
- Keep the warm paper background clean and modern.

2. Rebuild the cards as an arched fan, not a carousel
- Replace the current horizontal scroll carousel behavior with a centered fan layout.
- Cards will overlap like a deck spread in an arc, with each card positioned by index:
  - outer cards lower and more rotated
  - center cards higher and more upright
  - consistent overlap and separation like the labs.google screenshot
- Use larger portrait-style cards, not wide carousel cards.
- Keep the screenshots/images inside the cards, but make the cards read as a visual fan first.
- Remove or de-emphasize carousel controls if they fight the fan aesthetic.

3. Add labs-style motion to the fan
- On scroll into the section, cards start stacked/tighter near center and fan outward into the final arc.
- Hover lifts a card upward, straightens it slightly, and brings it above neighboring cards.
- On mobile, use a controlled horizontal snap fallback only because a full desktop-style fan will not fit cleanly.

4. Keep the section premium and restrained
- No green blob.
- No background floating keyword text.
- No loud color sitting behind the cards.
- Paper background, black Google-style headline, white cards, soft shadows, clean spacing.

5. Animate the purple blob behind the shift/memory section
- Keep the purple blob behind the scroll-fill text.
- Add continuous organic movement: slow drift, slight rotation, and shape morphing through border-radius changes.
- Respect reduced-motion by disabling the blob animation and keeping the text readable.

Technical notes
- Changes stay scoped to `src/pages/ContractorCircle.tsx` and `src/pages/ContractorCircle.css`.
- Remove the unused `floatingInsideWords` data and rendered `.cc-inside-word-field` markup.
- Rework `.cc-fan-track` / `.cc-fan-card` CSS from flex carousel into an absolute/stacked fan stage on desktop.
- Use the existing GSAP/ScrollTrigger setup already in the page for the fan-out animation; no new dependencies.