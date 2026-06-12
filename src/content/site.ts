// Centralized copy + config. Edit here to update the marketing site.

export const SITE = {
  brand: "ALP Contractor Circle",
  ctaJoinUrl: "https://buy.stripe.com/28EcN66xPcXk53GdXIeQM18",
  ctaJoinLabel: "Join the Circle",
  portalUrl: "https://app.alpcontractorcircle.com/login",
  portalLabel: "Member sign in",
};

export const LEAD_MAGNETS = {
  estimating: {
    slug: "estimating",
    eyebrow: "Free download",
    title: "The Estimating Checklist",
    subtitle: "The pre-bid review serious contractors run before a number ever leaves the office.",
    bullets: [
      "Catch the line items that quietly kill margin.",
      "Standardize the way every estimator on your team thinks.",
      "Tighten bids without slowing the pipeline.",
    ],
    cta: "Send me the checklist",
    thanks: "Check your inbox. The checklist is on the way.",
  },
  q2: {
    slug: "q2",
    eyebrow: "Free framework",
    title: "The Q1 / Q2 Framework",
    subtitle: "Where the work actually moves the company forward — and where the day disappears.",
    bullets: [
      "Sort your week into the four quadrants contractors actually live in.",
      "Identify the Q2 work you keep postponing.",
      "Get back the hours that build the business behind the jobs.",
    ],
    cta: "Send me the framework",
    thanks: "On its way. Open it when you have ten quiet minutes.",
  },
  silos: {
    slug: "silos",
    eyebrow: "Free framework",
    title: "The Three Silos Framework",
    subtitle: "Sales. Operations. Finance. The three silos every contractor company runs on — or breaks on.",
    bullets: [
      "See where your company is actually leaking.",
      "Diagnose the silo that's quietly capping your growth.",
      "A simple operating lens, not a 90-slide framework.",
    ],
    cta: "Send me the framework",
    thanks: "Sent. Read it before your next Monday review.",
  },
} as const;

export type LeadMagnetKey = keyof typeof LEAD_MAGNETS;
