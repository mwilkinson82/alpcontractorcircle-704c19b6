import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  Archive,
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  LockKeyhole,
  MessageSquare,
  Network,
  Play,
  Rocket,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";


import HeroIntroMotion from "./HeroIntroMotion";
import OwnerBottleneck from "./OwnerBottleneck";
import "./ContractorCircle.css";

type CloudflareStreamPlayer = {
  autoplay: boolean;
  controls: boolean;
  loop: boolean;
  muted: boolean;
  paused: boolean;
  play: () => Promise<void>;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

declare global {
  interface Window {
    Stream?: (element: HTMLIFrameElement) => CloudflareStreamPlayer;
  }
}

const CHECKOUT_URL =
  "https://buy.stripe.com/28EcN66xPcXk53GdXIeQM18";
const CLOUDFLARE_STREAM_ID = "5867cd561f133a4299bfb06e9e2f01d1";
const CLOUDFLARE_STREAM_SCRIPT_SRC =
  "https://embed.cloudflarestream.com/embed/sdk.latest.js";
const CLOUDFLARE_STREAM_IFRAME_SRC = `https://iframe.videodelivery.net/${CLOUDFLARE_STREAM_ID}?autoplay=true&muted=true&loop=true&controls=false&preload=auto&letterboxColor=transparent`;
const HERO_VIDEO_POSTER = "/manus-storage/alp-hero-poster_167efce2.webp";
const AOS_URL = "https://alpos.alpcontractorcircle.com";
const HANDBOOK_URL = "https://alphandbook.com";
const PORTAL_LOGIN_URL = "https://app.alpcontractorcircle.com/login";
const WHY_AOS_URL = "https://why.alpcontractorcircle.com";

const problemItems: Array<{ icon: LucideIcon; text: string }> = [
  { icon: Users, text: "Every decision comes back to you." },
  { icon: CalendarDays, text: "Selections are late." },
  { icon: UserRoundCheck, text: "PMs manage differently." },
  { icon: MessageSquare, text: "Meetings create talk, not traction." },
  {
    icon: CircleDollarSign,
    text: "Cash, schedule, and risk are reviewed too late.",
  },
  { icon: LockKeyhole, text: "The company grows, but the owner gets trapped." },
];

const installedItems: Array<{
  number: string;
  icon: LucideIcon;
  title: string;
  outcome: string;
  body: string;
}> = [
  {
    number: "01",
    icon: Settings2,
    title: "AOS Application",
    outcome: "Unlimited workspaces + seats",
    body: "Vision. Rocks. Scorecard. L10. Issues. To-Dos. The contractor operating system your team can actually run.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Marshall Guidance",
    outcome: "Real reads on real issues",
    body: "Ask Marshall, bring the constraint, and get the next move from the same playbooks behind the program.",
  },
  {
    number: "03",
    icon: Video,
    title: "Calls + Bootcamps",
    outcome: "Guidance becomes implementation",
    body: "Bi-weekly live calls plus monthly bootcamps. The room finds the issue, then builds the operating asset.",
  },
  {
    number: "04",
    icon: Play,
    title: "Replay Library",
    outcome: "Training that compounds",
    body: "Every call, every bootcamp, every guest speaker. Training you can revisit anytime.",
  },
  {
    number: "05",
    icon: BookOpen,
    title: "Templates + Handbook",
    outcome: "Doctrine plus deployable assets",
    body: "The field manual, AOS assets, and templates for contracts, estimating, finance, leadership, and operations.",
  },
  {
    number: "06",
    icon: Users,
    title: "Community + Tools",
    outcome: "A room between sessions",
    body: "Private Discord, command tools, Contract Readiness, SOP Builder, and the growing ALP operator toolset.",
  },
];

const productProofItems: Array<{
  number: string;
  eyebrow: string;
  headlineLines: [string, string];
  body: string;
  image: string;
  imageAlt: string;
  points: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; href: string; variant?: "blue" }>;
  walkthrough?: {
    label: string;
    title: string;
    body: string;
    href: string;
    cta: string;
  };
}> = [
  {
    number: "01",
    eyebrow: "Member Portal",
    headlineLines: ["The command center", "between calls."],
    body: "The portal is the front door of the Circle: Ask Marshall, calls, submissions, tools, templates, the vault, and the daily move all live in one place.",
    image: "/manus-storage/portal-ask-marshall_2e6c40e1.png",
    imageAlt: "ALP Contractor Circle member portal command center",
    points: [
      { label: "Command", value: "Ask, access, act." },
      { label: "Daily move", value: "One next action, not noise." },
      { label: "Member value", value: "Everything lives in one place." },
    ],
    links: [
      { label: "Open portal", href: "https://app.alpcontractorcircle.com" },
    ],
  },
  {
    number: "02",
    eyebrow: "Calls + Bootcamps",
    headlineLines: ["The room is live.", "The work is real."],
    body: "The live room and monthly bootcamps are where owner pressure becomes a decision, a tool, a template, or a system the company can use on Monday. The replays keep that leverage available after the call.",
    image: "/manus-storage/exact-bootcamp_9c719283.png",
    imageAlt: "Contractor Circle bi-weekly call replay and bootcamp screen",
    points: [
      { label: "Live room", value: "Bring the real issue." },
      { label: "Bootcamp", value: "Build the system live." },
      { label: "Replay", value: "Every session stays useful." },
    ],
  },
  {
    number: "03",
    eyebrow: "AOS",
    headlineLines: ["The operating system", "is included."],
    body: "AOS is the weekly operating cadence: vision, people, data, issues, process, and traction in one application. Members get unlimited workspaces and unlimited seats.",
    image: "/manus-storage/exact-aos_3819276c.png",
    imageAlt:
      "AOS scorecard showing weekly operating metrics and 13-week history",
    points: [
      { label: "Workspaces", value: "Unlimited companies and divisions." },
      { label: "Seats", value: "Unlimited team access." },
      { label: "Cadence", value: "Scorecard, rocks, issues, to-dos." },
    ],
    walkthrough: {
      label: "Interactive walkthrough",
      title: "What must be true for a contracting company to actually work?",
      body: "Why AOS is the deeper explanation: first principles, the five functions, and why the system belongs inside the application.",
      href: WHY_AOS_URL,
      cta: "Walk through Why AOS",
    },
    links: [
      { label: "Why AOS exists", href: WHY_AOS_URL, variant: "blue" },
      { label: "Open AOS app", href: AOS_URL },
    ],
  },
  {
    number: "04",
    eyebrow: "Templates",
    headlineLines: ["Templates that install", "the missing system."],
    body: "Templates give the team a starting point for work that should never live only in memory: preconstruction, buyout, change orders, billing, closeout, and recurring management.",
    image: "/manus-storage/exact-templates_b1f9f2d4.png",
    imageAlt: "Contractor Circle template library page",
    points: [
      { label: "Library", value: "26 deployable templates." },
      { label: "Categories", value: "Contracts, estimating, finance, ops." },
      { label: "Use", value: "Start with the asset, then adapt." },
    ],
  },
  {
    number: "05",
    eyebrow: "ALP Handbook",
    headlineLines: ["The field manual", "comes with it."],
    body: "Members get the ALP Handbook as a full web experience: the doctrine, operating language, and field manual for building the company behind the projects.",
    image: "/manus-storage/exact-handbook_5cfe7914.png",
    imageAlt: "ALP Handbook full web experience",
    points: [
      { label: "Format", value: "Full web handbook." },
      { label: "Doctrine", value: "Think, decide, document, lead." },
      { label: "Use", value: "Reference while operating." },
    ],
    links: [{ label: "Open handbook", href: HANDBOOK_URL }],
  },
  {
    number: "06",
    eyebrow: "Community",
    headlineLines: ["Discord is where", "the work continues."],
    body: "The private Discord server is the room between sessions: wins, estimating debates, numbers, field leadership, and the issues that earn time on the next call.",
    image: "/manus-storage/exact-community_e45de5f2.png",
    imageAlt: "Contractor Circle Discord community page",
    points: [
      { label: "Members only", value: "Every account is active." },
      { label: "Always on", value: "Post overnight. Get a take by morning." },
      { label: "Feeds calls", value: "Threads become the agenda." },
    ],
  },
  {
    number: "07",
    eyebrow: "Ask Marshall",
    headlineLines: ["Ask the issue.", "Get the read."],
    body: "The reply page is where a vague owner problem becomes a clearer read, a recommendation, and a move the contractor can actually make.",
    image: "/manus-storage/portal-ask-reply_d776f93c.png",
    imageAlt:
      "Ask Marshall reply page with a detailed contractor issue response",
    points: [
      { label: "Context", value: "One question, one operating read." },
      { label: "Judgment", value: "What it means and what to do next." },
      { label: "Leverage", value: "Marshall's playbooks in the portal." },
    ],
    links: [
      { label: "Open portal", href: "https://app.alpcontractorcircle.com" },
    ],
  },
  {
    number: "08",
    eyebrow: "SOP Builder",
    headlineLines: ["The SOP is not a doc.", "It is the machine."],
    body: "The SOP Builder turns a seat, department, and constraint into a usable operating procedure with purpose, scope, triggers, inputs, steps, outputs, KPIs, and escalation rules.",
    image: "/manus-storage/exact-sop-builder_b6175c39.png",
    imageAlt: "SOP Priority Builder in the Operator's Workbench",
    points: [
      { label: "Seat", value: "Built by department and owner." },
      { label: "Procedure", value: "Steps, outputs, KPIs, exceptions." },
      { label: "Vault", value: "Save, email, download, revise." },
    ],
  },
  {
    number: "09",
    eyebrow: "Contract Readiness Scan",
    headlineLines: ["Vague problems become", "command packets."],
    body: "Upload the contract. The scan reads for cash, schedule, scope, and margin risk before the owner signs the thing that can hurt the job.",
    image: "/manus-storage/tool-contract-readiness_8ec4fb39.png",
    imageAlt: "Contract readiness scan tool with contract risk findings",
    points: [
      { label: "Cash", value: "Payment and collection risk." },
      { label: "Schedule", value: "LDs, notice, critical path exposure." },
      { label: "Output", value: "Sample language and negotiation points." },
    ],
  },
];

const fitItems: Array<{ icon: LucideIcon; text: string }> = [
  {
    icon: ShieldCheck,
    text: "You are doing real volume but still feel trapped.",
  },
  { icon: Network, text: "You have PMs, but too much still runs through you." },
  {
    icon: ClipboardList,
    text: "You want to scale, but the company needs structure first.",
  },
  {
    icon: Check,
    text: "You know the next level requires systems, not more hustle.",
  },
];

const onboardingSteps = [
  {
    number: "01",
    title: "Welcome email",
    body: "Your receipt, portal link, Discord invite, and first move arrive immediately.",
  },
  {
    number: "02",
    title: "Get inside the room",
    body: "Portal and Discord open so the work has one home from day one.",
  },
  {
    number: "03",
    title: "Post the real constraint",
    body: "Introduce the company and the pressure you want solved first.",
  },
  {
    number: "04",
    title: "Pull the first asset",
    body: "Use the replay, playbook, or template connected to that constraint.",
  },
  {
    number: "05",
    title: "Set up AOS",
    body: "Open the workspace that will hold numbers, rocks, issues, and to-dos.",
  },
  {
    number: "06",
    title: "Bring it to the call",
    body: "One real issue comes into the live room and leaves with a next move.",
  },
];

const stats = [
  {
    icon: CircleDollarSign,
    value: "$2.5B+",
    label: "Built from real construction experience",
  },
  {
    icon: Users,
    value: "Private Community",
    label: "Construction owners serious about scaling",
  },
  {
    icon: CalendarDays,
    value: "Weekly Rhythm",
    label: "Live calls every Sunday at 5 PM",
  },
  {
    icon: Archive,
    value: "Unlimited AOS Access",
    label: "Unlimited workspaces and unlimited seats",
  },
];

const proofStats = [
  { value: "$100M+", label: "Total revenue generated by members" },
  { value: "33x", label: "Average growth multiple shown on the main site" },
  { value: "1 Month", label: "Fastest reported result" },
  { value: "$2.5B+", label: "Construction experience behind the doctrine" },
];

const memberResults = [
  {
    company: "CNY Group",
    timeline: "18 months with ALP",
    before: "$600K",
    after: "$20M",
    multiple: "33x",
  },
  {
    company: "Trojan Roofing",
    timeline: "First year with ALP",
    before: "$300K",
    after: "$10M",
    multiple: "33x",
  },
  {
    company: "Davis Contracting",
    timeline: "6 months with ALP",
    before: "$1M",
    after: "$4M",
    multiple: "4x",
  },
  {
    company: "Sage Construction",
    timeline: "1 year with ALP",
    before: "$0",
    after: "$2M",
    multiple: "∞",
  },
  {
    company: "ARC Construction Group",
    timeline: "1 year with ALP",
    before: "$0",
    after: "$2M",
    multiple: "∞",
  },
];

const testimonials = [
  {
    quote:
      "Marshall's classes are one of a kind. He teaches lessons that would take you years to learn yourself.",
    name: "Olive Tree Builds",
  },
  {
    quote:
      "There is nothing like Marshall. This is real world stuff here. My 2nd month as a contractor and I'm at a quarter million in revenue.",
    name: "Sage Construction",
  },
  {
    quote:
      "ALP is super impactful. I have tried many other coaching programs, and none compare to what I've learned.",
    name: "Davis Contracting",
  },
];

type Pillar = {
  number: string;
  eyebrow: string;
  title: string;
  outcome: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  icon: LucideIcon;
  isGateway?: boolean;
};

const pillars: Pillar[] = [
  {
    number: "01",
    eyebrow: "Bi-weekly Calls + Curriculum",
    title: "Live with Marshall, on a real curriculum.",
    outcome: "Bring the issue. Leave with the move.",
    bullets: [
      "Live with Marshall, every other week",
      "Set curriculum, not open Q&A",
      "Replays stay in the portal for life",
    ],
    image: "/manus-storage/exact-bootcamp_9c719283.png",
    imageAlt: "Bi-weekly Contractor Circle call session",
    icon: CalendarDays,
  },
  {
    number: "02",
    eyebrow: "Monthly Bootcamp",
    title: "Build the system live, in one sitting.",
    outcome: "One operating system installed per month.",
    bullets: [
      "One operating system per bootcamp",
      "Templates and SOPs walk out the door",
      "Replay and workbook stay for reference",
    ],
    image: "/manus-storage/exact-sop-builder_b6175c39.png",
    imageAlt: "Contractor Circle monthly bootcamp",
    icon: Rocket,
  },
  {
    number: "03",
    eyebrow: "Community",
    title: "The room between sessions.",
    outcome: "Owners who actually run the work.",
    bullets: [
      "Members-only Discord, every account active",
      "Post overnight, get a read by morning",
      "Threads feed the next call agenda",
    ],
    image: "/manus-storage/exact-community_e45de5f2.png",
    imageAlt: "Contractor Circle Discord community",
    icon: Users,
  },
  {
    number: "04",
    eyebrow: "Portal",
    title: "One front door for everything else.",
    outcome: "Replays, templates, the handbook, and Ask Marshall.",
    bullets: [
      "Replays stay organized by topic",
      "Templates and the handbook are one click away",
      "Ask Marshall lives inside the member portal",
    ],
    image: "/manus-storage/portal-ask-marshall_2e6c40e1.png",
    imageAlt: "Contractor Circle portal command center",
    icon: Network,
    isGateway: true,
  },
  {
    number: "05",
    eyebrow: "AOS + Proprietary Tools",
    title: "The operating system is included.",
    outcome: "AOS workspaces plus the tools that expose the constraint.",
    bullets: [
      "Unlimited AOS workspaces and seats",
      "SOP Builder and Contract Readiness Scanner",
      "Owner Dependency Scorecards",
    ],
    image: "/manus-storage/exact-aos_3819276c.png",
    imageAlt: "AOS workspace scorecard and operating cadence",
    icon: Settings2,
  },
];

const memoryFillWords = [
  "Memory",
  "is",
  "not",
  "management.",
  "The",
  "owner",
  "remembering",
  "everything",
  "is",
  "not",
  "a",
  "system.",
  "Contractor",
  "Circle",
  "is",
  "the",
  "operating",
  "system,",
  "the",
  "education,",
  "and",
  "the",
  "community",
  "that",
  "installs",
  "it —",
  "bi-weekly",
  "calls",
  "with",
  "Marshall,",
  "a",
  "private",
  "community",
  "of",
  "operators,",
  "and",
  "the",
  "AOS",
  "platform",
  "your",
  "team",
  "runs",
  "the",
  "business",
  "on.",
];


function ScrollFillText({ words }: { words: string[] }) {
  return (
    <p className="cc-scroll-fill-text" data-memory-fill>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} data-fill-word>
          {word}
        </span>
      ))}
    </p>
  );
}

function PillarsSection() {
  const items = productProofItems;
  const [activeFanIndex, setActiveFanIndex] = useState(() => Math.floor(items.length / 2));
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openItem = openIndex !== null ? items[openIndex] : null;
  const rotateFan = (direction: -1 | 1) => {
    setActiveFanIndex(current => (current + direction + items.length) % items.length);
  };

  return (
    <section
      className="cc-pillars-section"
      aria-label="Everything inside Contractor Circle"
    >
      <div className="cc-pillars-inner">
        <div className="cc-pillars-copy cc-caption">
          <h2>
            <span>Everything inside the Circle</span>
          </h2>
        </div>

        <div className="cc-fan-stage">
          <div
            className="cc-fan-track"
            data-circle-fan
            role="list"
          >
            {items.map((item, index) => {
              let slot = index - activeFanIndex;
              if (slot > items.length / 2) slot -= items.length;
              if (slot < -items.length / 2) slot += items.length;
              const distance = Math.abs(slot);
              const angle = slot * 6.1;
              const style = {
                "--fan-slot": slot,
                "--fan-distance": distance,
                "--fan-angle": `${angle}deg`,
                "--fan-angle-final": `${angle}deg`,
                "--fan-angle-start": `${slot * 4.7}deg`,
                "--fan-z": 90 - Math.round(distance * 4),
              } as CSSProperties;
              return (
                <div
                  key={item.number}
                  className="cc-fan-card"
                  style={style}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="cc-fan-card-hit"
                    aria-label={`${item.eyebrow}: ${item.headlineLines.join(" ")} — open details`}
                    onClick={() => {
                      setOpenIndex(index);
                    }}
                  >
                    <figure className="cc-fan-card-media">
                      <img src={item.image} alt={item.imageAlt} loading="lazy" />
                    </figure>
                    <div className="cc-fan-card-body">
                      <h3>{item.headlineLines.join(" ")}</h3>
                      <p className="cc-fan-card-body-copy">{item.body}</p>
                      <span className="cc-fan-card-learn" aria-hidden="true">
                        Learn More <span className="cc-fan-card-learn-arrow">→</span>
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          <div className="cc-fan-controls" aria-label="Browse Circle inclusions">
            <button
              type="button"
              className="cc-fan-arrow"
              aria-label="Previous inclusion"
              onClick={() => rotateFan(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="cc-fan-arrow"
              aria-label="Next inclusion"
              onClick={() => rotateFan(1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={openIndex !== null}
        onOpenChange={open => {
          if (!open) setOpenIndex(null);
        }}
      >
        <DialogContent className="cc-fan-modal">
          {openItem ? (
            <div className="cc-fan-modal-grid">
              <figure className="cc-fan-modal-media">
                <img src={openItem.image} alt={openItem.imageAlt} />
              </figure>
              <div className="cc-fan-modal-body">
                <p className="cc-fan-modal-eyebrow">
                  <span>{openItem.number}</span>
                  {openItem.eyebrow}
                </p>
                <h3>{openItem.headlineLines.join(" ")}</h3>
                <p className="cc-fan-modal-copy">{openItem.body}</p>
                <ul className="cc-fan-modal-points">
                  {openItem.points.map(point => (
                    <li key={point.label}>
                      <Check aria-hidden="true" />
                      <div>
                        <strong>{point.label}</strong>
                        <span>{point.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="cc-fan-modal-actions">
                  <a
                    href={CHECKOUT_URL}
                    className="cc-fan-modal-link is-primary"
                  >
                    Join the Circle
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                  {openItem.walkthrough && (
                    <a
                      href={openItem.walkthrough.href}
                      target="_blank"
                      rel="noreferrer"
                      className="cc-fan-modal-link"
                    >
                      {openItem.walkthrough.cta}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  )}
                  {openItem.links?.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`cc-fan-modal-link${link.variant === "blue" ? " is-blue" : ""}`}
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  ))}
                </div>

              </div>
            </div>
          ) : null}
          <DialogClose className="cc-fan-modal-close" aria-label="Close">
            <X aria-hidden="true" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
}



function useCloudflareStreamRuntime() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.Stream) {
      setIsReady(true);
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${CLOUDFLARE_STREAM_SCRIPT_SRC}"]`
    );
    const handleLoad = () => setIsReady(true);

    if (!script) {
      script = document.createElement("script");
      script.src = CLOUDFLARE_STREAM_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", handleLoad);

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, []);

  return isReady;
}

export default function ContractorCircle() {
  const rootRef = useRef<HTMLDivElement>(null);
  const streamFrameRef = useRef<HTMLIFrameElement>(null);
  const streamPlayerRef = useRef<CloudflareStreamPlayer | null>(null);
  
  const mutedPreferenceRef = useRef(true);
  const heroRevealStartedRef = useRef(false);
  const heroIntroCompleteRef = useRef(false);
  const heroPlaybackSeenRef = useRef(false);
  const [muted, setMuted] = useState(true);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const [heroFrameLoaded, setHeroFrameLoaded] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [heroIntroComplete, setHeroIntroComplete] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [heroRevealActive, setHeroRevealActive] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);

  const streamRuntimeReady = useCloudflareStreamRuntime();
  useContractorCircleMotion(rootRef);

  const handleHeroIntroComplete = useCallback(() => {
    setHeroIntroComplete(true);
  }, []);

  useEffect(() => {
    heroIntroCompleteRef.current = heroIntroComplete;
  }, [heroIntroComplete]);




  const ensureHeroVideoPlayback = useCallback((allowMutedFallback = false) => {
    const player = streamPlayerRef.current;
    if (!player) return;

    void player.play().catch(() => {
      if (!allowMutedFallback) return;
      player.muted = true;
      setMuted(true);
      void player.play().catch(() => undefined);
    });
  }, []);

  const scheduleHeroVideoPlayback = useCallback(() => {
    if (typeof window === "undefined") return () => undefined;

    const retryDelays = [0, 180, 640, 1380, 2600, 4200];
    const timers = retryDelays.map(delay =>
      window.setTimeout(() => ensureHeroVideoPlayback(true), delay)
    );

    return () => {
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [ensureHeroVideoPlayback]);

  useEffect(() => {
    document.title =
      "ALP Contractor Circle | Operating System for Construction Owners";
    const description =
      "The Contractor Circle gives construction owners the operating system, tools, and weekly rhythm to scale without becoming the bottleneck.";
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, []);

  useEffect(() => {
    if (!streamRuntimeReady || !window.Stream || !streamFrameRef.current) {
      return;
    }

    const player = window.Stream(streamFrameRef.current);
    streamPlayerRef.current = player;
    let readyTimer = 0;
    const markReady = () => {
      heroPlaybackSeenRef.current = true;
      if (!heroIntroCompleteRef.current) return;

      window.clearTimeout(readyTimer);
      readyTimer = window.setTimeout(() => {
        setVideoUnavailable(false);
        setHeroVideoReady(true);
      }, 1800);
    };
    const playWhenReady = () => {
      ensureHeroVideoPlayback(true);
    };
    const markUnavailable = () => {
      setVideoUnavailable(true);
      setHeroVideoReady(true);
    };

    player.autoplay = true;
    player.controls = false;
    player.loop = true;
    player.muted = mutedPreferenceRef.current;
    setMuted(mutedPreferenceRef.current);
    player.addEventListener?.("canplay", playWhenReady);
    player.addEventListener?.("playing", markReady);
    player.addEventListener?.("error", markUnavailable);
    const cancelPlaybackRetries = scheduleHeroVideoPlayback();

    return () => {
      cancelPlaybackRetries();
      window.clearTimeout(readyTimer);
      player.removeEventListener?.("canplay", playWhenReady);
      player.removeEventListener?.("playing", markReady);
      player.removeEventListener?.("error", markUnavailable);
      streamPlayerRef.current = null;
    };
  }, [ensureHeroVideoPlayback, scheduleHeroVideoPlayback, streamRuntimeReady]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!heroFrameLoaded || !streamRuntimeReady) return;

    return scheduleHeroVideoPlayback();
  }, [heroFrameLoaded, scheduleHeroVideoPlayback, streamRuntimeReady]);

  useEffect(() => {
    if (typeof window === "undefined" || !heroIntroComplete) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timers = [0, 120, 360, 840, 1440, 2400].map(delay =>
      window.setTimeout(() => ensureHeroVideoPlayback(true), delay)
    );
    let revealTimer = 0;
    let readyBridgeTimer = 0;

    if (!prefersReducedMotion && !heroRevealStartedRef.current) {
      heroRevealStartedRef.current = true;
      setHeroRevealActive(true);
      revealTimer = window.setTimeout(() => setHeroRevealActive(false), 1900);
    }

    if (heroPlaybackSeenRef.current) {
      readyBridgeTimer = window.setTimeout(() => {
        setVideoUnavailable(false);
        setHeroVideoReady(true);
      }, prefersReducedMotion ? 0 : 2200);
    }

    return () => {
      timers.forEach(timer => window.clearTimeout(timer));
      window.clearTimeout(revealTimer);
      window.clearTimeout(readyBridgeTimer);
    };
  }, [ensureHeroVideoPlayback, heroIntroComplete, streamRuntimeReady]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    let retryTimer = 0;
    let heartbeatTimer = 0;
    const replayIfHeroIsVisible = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const player = streamPlayerRef.current;
        const frame = streamFrameRef.current;
        if (!player || !frame) return;

        const rect = frame.getBoundingClientRect();
        const isNearHero = window.scrollY < window.innerHeight * 1.35;
        const isHeroVisible =
          isNearHero ||
          (rect.bottom > 0 && rect.top < window.innerHeight * 1.15);
        if (isHeroVisible) {
          ensureHeroVideoPlayback(true);
          window.clearTimeout(retryTimer);
          retryTimer = window.setTimeout(() => {
            ensureHeroVideoPlayback(true);
            retryTimer = window.setTimeout(
              () => ensureHeroVideoPlayback(true),
              420
            );
          }, 140);
        }
      });
    };

    const replayAfterScrollSettles = () => {
      replayIfHeroIsVisible();
      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(() => {
        replayIfHeroIsVisible();
        retryTimer = window.setTimeout(replayIfHeroIsVisible, 520);
      }, 180);
    };

    const replayAfterVisibilityReturn = () => {
      if (!document.hidden) {
        replayAfterScrollSettles();
      }
    };

    window.addEventListener("scroll", replayIfHeroIsVisible, { passive: true });
    window.addEventListener("scrollend", replayAfterScrollSettles);
    window.addEventListener("wheel", replayAfterScrollSettles, {
      passive: true,
    });
    window.addEventListener("resize", replayIfHeroIsVisible);
    window.addEventListener("orientationchange", replayAfterScrollSettles);
    window.addEventListener("focus", replayIfHeroIsVisible);
    window.addEventListener("pageshow", replayIfHeroIsVisible);
    window.addEventListener("pointerup", replayAfterScrollSettles, {
      passive: true,
    });
    window.addEventListener("touchend", replayAfterScrollSettles, {
      passive: true,
    });
    window.addEventListener("touchmove", replayIfHeroIsVisible, {
      passive: true,
    });
    document.addEventListener("visibilitychange", replayAfterVisibilityReturn);
    heartbeatTimer = window.setInterval(() => {
      if (!document.hidden) replayIfHeroIsVisible();
    }, 900);
    replayIfHeroIsVisible();

    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      window.clearTimeout(retryTimer);
      window.clearInterval(heartbeatTimer);
      window.removeEventListener("scroll", replayIfHeroIsVisible);
      window.removeEventListener("scrollend", replayAfterScrollSettles);
      window.removeEventListener("wheel", replayAfterScrollSettles);
      window.removeEventListener("resize", replayIfHeroIsVisible);
      window.removeEventListener("orientationchange", replayAfterScrollSettles);
      window.removeEventListener("focus", replayIfHeroIsVisible);
      window.removeEventListener("pageshow", replayIfHeroIsVisible);
      window.removeEventListener("pointerup", replayAfterScrollSettles);
      window.removeEventListener("touchend", replayAfterScrollSettles);
      window.removeEventListener("touchmove", replayIfHeroIsVisible);
      document.removeEventListener(
        "visibilitychange",
        replayAfterVisibilityReturn
      );
    };
  }, [ensureHeroVideoPlayback, streamRuntimeReady]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mobileQuery = window.matchMedia("(max-width: 860px)");
    const updateMobileCta = () => {
      const threshold = Math.min(760, window.innerHeight * 0.9);
      const productDeck =
        document.querySelector<HTMLElement>(".cc-pillars-section");
      const deckRect = productDeck?.getBoundingClientRect();
      const isInsideProductDeck = deckRect
        ? deckRect.top < window.innerHeight * 0.82 && deckRect.bottom > 96
        : false;
      const shouldShow =
        mobileQuery.matches &&
        window.scrollY > threshold &&
        !isInsideProductDeck;
      setShowMobileCta(current =>
        current === shouldShow ? current : shouldShow
      );
    };

    updateMobileCta();
    window.addEventListener("scroll", updateMobileCta, { passive: true });
    window.addEventListener("resize", updateMobileCta);
    mobileQuery.addEventListener("change", updateMobileCta);

    return () => {
      window.removeEventListener("scroll", updateMobileCta);
      window.removeEventListener("resize", updateMobileCta);
      mobileQuery.removeEventListener("change", updateMobileCta);
    };
  }, []);

  const toggleAudio = () => {
    const player = streamPlayerRef.current;
    const nextMuted = !muted;
    mutedPreferenceRef.current = nextMuted;
    setMuted(nextMuted);

    if (!player) return;
    player.muted = nextMuted;
    if (!nextMuted || player.paused) ensureHeroVideoPlayback();
  };

  return (
    <div ref={rootRef} className="cc-page">
      <header
        className={`cc-nav ${heroIntroComplete ? "is-on-video" : "is-on-paper"}`}
        aria-label="ALP Contractor Circle"
      >
        <a
          href="#top"
          className="cc-brand"
          aria-label="ALP Contractor Circle home"
        >
          <span className="cc-brand-mark">ALP</span>
          <span className="cc-brand-name">Contractor Circle</span>
        </a>
        <nav className="cc-nav-actions" aria-label="Primary">
          <a href={PORTAL_LOGIN_URL} className="cc-nav-link">
            Sign In
          </a>
          <a href={CHECKOUT_URL} className="cc-nav-button">
            Get Started
          </a>
        </nav>
      </header>

      <main id="top">
        <section
          className={`cc-video-hero ${
            heroVideoReady || videoUnavailable
              ? "is-video-ready"
              : "is-video-loading"
          } ${
            heroIntroComplete
              ? "is-hero-intro-complete"
              : "is-hero-intro-active"
          } ${heroRevealActive ? "is-hero-intro-revealing" : ""}`}
          aria-label="Contractor Circle introduction video"
        >
          <img
            className="cc-video-poster"
            src={HERO_VIDEO_POSTER}
            alt=""
            aria-hidden="true"
          />
          <div className="cc-video-media">
            <iframe
              ref={streamFrameRef}
              className="cc-video cc-stream-video"
              title="Contractor Circle introduction video"
              src={CLOUDFLARE_STREAM_IFRAME_SRC}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="eager"
              onLoad={() => {
                setHeroFrameLoaded(true);
                setVideoUnavailable(false);
              }}
              onError={() => {
                setVideoUnavailable(true);
                setHeroVideoReady(true);
              }}
            />
          </div>
          <div className="cc-hero-loader" aria-hidden="true">
            <SystemsField className="cc-hero-loader-field" variant="stack" />
            <div className="cc-loader-deck">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="cc-loader-readout">
              <span>ALP</span>
              <strong>Contractor Circle</strong>
            </div>
          </div>
          {videoUnavailable ? (
            <img
              className="cc-video-fallback"
              src={HERO_VIDEO_POSTER}
              alt=""
              aria-hidden="true"
            />
          ) : null}
          <div className="cc-video-shade" />
          <HeroIntroMotion onComplete={handleHeroIntroComplete} />
          {!videoUnavailable ? (
            <button
              className="cc-sound-button"
              type="button"
              onClick={toggleAudio}
            >
              {muted ? "Tap for Sound" : "Sound On"}
            </button>
          ) : null}
        </section>

        <div id="whats-installed">
          <PillarsSection />
        </div>

        <section className="cc-hero-copy cc-caption">
          <p className="cc-eyebrow" data-caption>
            Contractor Circle
          </p>
          <h2>
            <span data-caption>Build the company </span>
            <span data-caption>behind the projects.</span>
          </h2>
          <p className="cc-subhead" data-caption>
            Your competitors are installing systems. Contractor Circle gives
            construction owners AOS, the portal, tools, templates, replays, and
            the weekly rhythm to scale without becoming the bottleneck.
          </p>
          <div className="cc-hero-actions">
            <a href={CHECKOUT_URL} className="cc-button cc-button-dark">
              Join the Circle
            </a>
            <a href="#whats-installed" className="cc-inline-link">
              See what's inside
            </a>
          </div>
        </section>

        <section
          className="cc-card-stack"
          aria-label="Contractor Circle story"
        >
          <div className="cc-stack-sticky">
            <article className="cc-stack-card cc-stack-card-shift">
              <div className="cc-memory-system cc-caption">
                <div className="cc-memory-copy">
                  <p className="cc-eyebrow" data-caption>
                    The Shift
                  </p>
                  <ScrollFillText words={memoryFillWords} />
                </div>
              </div>
            </article>

            <article className="cc-stack-card cc-stack-card-problem">
              <OwnerBottleneck />
            </article>
          </div>
        </section>


        <section
          className="cc-card-stack"
          aria-label="Contractor Circle proof and offer"
        >
          
          <div className="cc-stack-sticky">
            <article className="cc-stack-card cc-stack-card-proof">
              <div className="cc-proof-ledger">
                <div className="cc-proof-ledger-copy cc-caption">
                  <p className="cc-eyebrow" data-caption>
                    Proof
                  </p>
                  <h2>
                    <span data-caption>Not theory.</span>
                    <span data-caption>Real companies, changed.</span>

                  </h2>
                  <p className="cc-subhead" data-caption>
                    The proof is not that a portal exists. The proof is what
                    happens when owners stop carrying every decision themselves.
                  </p>
                  <a
                    href={CHECKOUT_URL}
                    className="cc-button cc-button-dark"
                    data-caption
                  >
                    Join the Circle
                  </a>
                </div>
                <div className="cc-proof-ledger-visual cc-detail-reveal">
                  <div className="cc-proof-stat-grid">
                    {proofStats.map(stat => (
                      <div className="cc-proof-stat" key={stat.value}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="cc-member-results"
                    aria-label="Member growth examples"
                  >
                    {memberResults.map(result => (
                      <article
                        className="cc-member-result"
                        key={result.company}
                      >
                        <header>
                          <div>
                            <strong>{result.company}</strong>
                            <span>{result.timeline}</span>
                          </div>
                          <em>{result.multiple}</em>
                        </header>
                        <dl>
                          <div>
                            <dt>Before</dt>
                            <dd>{result.before}</dd>
                          </div>
                          <div>
                            <dt>After ALP</dt>
                            <dd>{result.after}</dd>
                          </div>
                        </dl>
                      </article>
                    ))}
                  </div>
                  <div
                    className="cc-testimonial-strip"
                    aria-label="Member testimonials"
                  >
                    {testimonials.map(testimonial => (
                      <figure className="cc-testimonial" key={testimonial.name}>
                        <div className="cc-testimonial-mark" aria-hidden="true">
                          5 star member read
                        </div>
                        <blockquote>"{testimonial.quote}"</blockquote>
                        <figcaption>
                          {testimonial.name}
                          <span>ALP Member</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                  <p className="cc-proof-disclaimer">
                    Results vary. These are real members who committed to the
                    process, showed up consistently, and executed on what they
                    learned.
                  </p>
                </div>
              </div>
            </article>






            <article className="cc-stack-card cc-stack-card-fit">
              <div className="cc-fit-diagnostic">
                <div className="cc-caption">
                  <p className="cc-eyebrow" data-caption>
                    Who This Is For
                  </p>
                  <h2>
                    <span data-caption>For owners doing real volume,</span>
                    <span data-caption>but still carrying the company.</span>
                  </h2>
                  <p className="cc-subhead" data-caption>
                    If the business is growing and the operating pressure still
                    routes through you, the next level is not more hustle. It is
                    a system your team can use without waiting on your memory.
                  </p>
                  <div className="cc-fit-list">
                    {fitItems.map(({ icon: Icon, text }) => (
                      <article key={text} className="cc-fit-item">
                        <Icon aria-hidden="true" />
                        <p>{text}</p>
                      </article>
                    ))}
                  </div>
                </div>
                <aside className="cc-owner-panel cc-detail-reveal">
                  <span>Owner signal</span>
                  <strong>You are still the hub.</strong>
                  <p>
                    PMs ask. Finance waits. Decisions bounce back. Meetings end
                    with talk, but not enough visible ownership.
                  </p>
                  <div>
                    <b>What changes</b>
                    <small>
                      Vision, numbers, issues, to-dos, roles, and tools move
                      into a weekly operating rhythm.
                    </small>
                  </div>
                </aside>
              </div>
            </article>

            <article
              id="after-checkout"
              className="cc-stack-card cc-stack-card-onboarding"
            >
              <div className="cc-onboarding-card">
                <div className="cc-onboarding-copy cc-caption">
                  <p className="cc-eyebrow" data-caption>
                    After Checkout
                  </p>
                  <h2>
                    <span data-caption>Your first move</span>
                    <span data-caption>starts now.</span>
                  </h2>
                  <p className="cc-subhead" data-caption>
                    After checkout, the goal is not to browse a library. It is
                    to get into the room, name the first operating constraint,
                    and start moving the company into AOS.
                  </p>
                  <a
                    href={CHECKOUT_URL}
                    className="cc-button cc-button-dark"
                    data-caption
                  >
                    Join the Circle
                  </a>
                </div>
                <div
                  className="cc-onboarding-steps"
                  aria-label="What happens after joining"
                >
                  {onboardingSteps.map(step => (
                    <article
                      className="cc-onboarding-step cc-detail-reveal"
                      key={step.number}
                    >
                      <span>{step.number}</span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </article>

            <article className="cc-stack-card cc-stack-card-close">
              <div className="cc-close-card cc-caption">
                <p className="cc-eyebrow" data-caption>
                  Get Control Now
                </p>
                <h2>
                  <span data-caption>Get control now.</span>
                  <span data-caption>Build the real business.</span>
                </h2>
                <p className="cc-subhead" data-caption>
                  Your confusion ends when the company has cadence, numbers,
                  ownership, and tools. Your profit is hiding in the system.
                </p>
                <div className="cc-close-steps">
                  {[
                    ["Clarity", "See the real constraint."],
                    ["Control", "Put an owner and cadence on it."],
                    ["Profit", "Protect margin before it leaks."],
                  ].map(([label, text]) => (
                    <div className="cc-close-step cc-detail-reveal" key={label}>
                      <span>{label}</span>
                      <strong>{text}</strong>
                    </div>
                  ))}
                </div>
                <a href={CHECKOUT_URL} className="cc-button cc-button-light">
                  Join the Circle
                </a>
              </div>
            </article>

            <article className="cc-stack-card cc-stack-card-pricing">
              <div className="cc-pricing-copy cc-caption">
                <p className="cc-eyebrow" data-caption>
                  Founding Membership
                </p>
                <h2>
                  <span data-caption>
                    <em>$497</em>/month
                  </span>
                </h2>
                <p className="cc-subhead" data-caption>
                  Includes live calls, bootcamps, replays, templates, tools, and
                  full AOS access with unlimited workspaces and unlimited seats.
                </p>
                <a href={CHECKOUT_URL} className="cc-button cc-button-light">
                  Join the Circle
                </a>
                <p className="cc-fine-print">
                  Limited founding memberships available.
                </p>
              </div>
            </article>
          </div>
        </section>

        <OwnerBottleneck />

        <section
          className="cc-stats"
          aria-label="Contractor Circle proof points"
        >
          <div className="cc-section-inner cc-stats-grid">
            {stats.map(({ icon: Icon, value, label }) => (
              <article key={value} className="cc-stat">
                <Icon aria-hidden="true" />
                <p>{value}</p>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </section>

        <section
          className="cc-mega-close"
          aria-label="Contractor Circle closing call to action"
        >
          <div className="cc-mega-close-bar">
            <span>Build the company behind the projects.</span>
            <a href={CHECKOUT_URL}>Join the Circle</a>
          </div>
          <h2 className="cc-mega-word">Contractor Circle</h2>
        </section>
      </main>

      <footer className="cc-footer">
        <p>© 2026 ALP Contractor Circle. All rights reserved.</p>
        <div>
          <a href={HANDBOOK_URL} target="_blank" rel="noreferrer">
            ALP Handbook
          </a>
          <a href={AOS_URL} target="_blank" rel="noreferrer">
            AOS
          </a>
          <a
            href="https://instagram.com/realmarshallwilkinson"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </footer>

      <a
        href={CHECKOUT_URL}
        className={`cc-mobile-sticky-cta${showMobileCta ? " is-visible" : ""}`}
        aria-hidden={!showMobileCta}
        tabIndex={showMobileCta ? 0 : -1}
      >
        <span>Join the Circle</span>
        <strong>$497/mo</strong>
      </a>
    </div>
  );
}

function useContractorCircleMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let mobileCardObserver: IntersectionObserver | null = null;
    let revealVisibleMobileCards: (() => void) | null = null;
    let mobileRevealTimers: number[] = [];
    const motionCleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        root.dataset.motionMode = "reduced";
        gsap.set(
          "[data-caption], [data-fill-word], .cc-reveal, .cc-hero-copy, .cc-problem-card, .cc-install-item, .cc-asset-card, .cc-fit-item, .cc-aos-row, .cc-aos-core, .cc-detail-reveal, .cc-stat, .cc-mega-word",
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: "none",
            color: "rgba(21, 21, 21, 1)",
            rotate: 0,
            rotateX: 0,
            rotateY: 0,
            clipPath: "inset(0% 0% 0% 0% round 0px)",
          }
        );
        return;
      }

      const touchStackRisk = window.matchMedia(
        "(hover: none) and (pointer: coarse)"
      ).matches;
      const widthCompact = window.matchMedia("(max-width: 860px)").matches;
      const touchCompact =
        touchStackRisk && window.matchMedia("(max-width: 1024px)").matches;
      const lowHeightDesktop = window.matchMedia(
        "(min-width: 861px) and (max-height: 840px)"
      ).matches;
      const isCompact = widthCompact || touchCompact;
      root.dataset.motionMode = lowHeightDesktop
        ? "flow"
        : isCompact
          ? "compact"
          : "desktop";

      const setupPillarFan = (): (() => void) | undefined => {
        const fan = root.querySelector<HTMLElement>("[data-circle-fan]");
        if (!fan) return;
        const cards = Array.from(
          fan.querySelectorAll<HTMLElement>(".cc-fan-card")
        );
        if (!cards.length) return;

        if (isCompact) {
          gsap.set(cards, {
            clearProps: "transform,opacity,visibility,x,y,scale,rotate",
          });
          return;
        }

        gsap.set(cards, {
          xPercent: -50,
          transformOrigin: "50% var(--fan-radius)",
          rotate: index => {
            const slot = Number(cards[index].style.getPropertyValue("--fan-slot")) || 0;
            return slot * 4.7;
          },
          y: 118,
          scale: 0.96,
          autoAlpha: 0,
        });

        gsap.to(cards, {
          rotate: index => {
            const slot = Number(cards[index].style.getPropertyValue("--fan-slot")) || 0;
            return slot * 6.1;
          },
          y: 0,
          scale: 1,
          autoAlpha: 1,
          ease: "power3.out",
          duration: 1.05,
          stagger: {
            each: 0.045,
            from: "center",
          },
          scrollTrigger: {
            trigger: fan,
            start: "top 76%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      };

      const setupAssetDeck = () => {
        const deck = root.querySelector<HTMLElement>("[data-asset-carousel]");
        if (!deck) return;
        const cards = Array.from(
          deck.querySelectorAll<HTMLElement>(".cc-asset-card")
        );
        if (!cards.length) return;

        // Per-card target rotation matching the CSS rest tilt.
        const restRotation = (i: number) => {
          if ((i + 1) % 3 === 0) return -1;
          return i % 2 === 0 ? -3 : 4;
        };
        const restY = (i: number) => {
          if ((i + 1) % 3 === 0) return 14;
          return i % 2 === 0 ? 8 : -4;
        };

        // Scroll-in stagger: each card rises and tilts into its CSS rest state.
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 100, rotate: 0, autoAlpha: 0, scale: 0.92 },
            {
              y: restY(i),
              rotate: restRotation(i),
              autoAlpha: 1,
              scale: 1,
              ease: "power2.out",
              duration: 0.8,
              delay: i * 0.07,
              scrollTrigger: {
                trigger: deck,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        if (isCompact) return;

        // Auto-drift: slow horizontal scroll while the deck is in view,
        // paused on pointer interaction.
        let raf = 0;
        let last = performance.now();
        let active = false;
        let paused = false;
        const speed = 22; // px/sec

        const tick = (now: number) => {
          const dt = (now - last) / 1000;
          last = now;
          if (active && !paused) {
            const max = deck.scrollWidth - deck.clientWidth;
            if (max > 0) {
              let next = deck.scrollLeft + speed * dt;
              if (next >= max) next = 0;
              deck.scrollLeft = next;
            }
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        ScrollTrigger.create({
          trigger: deck,
          start: "top 75%",
          end: "bottom 25%",
          onToggle: self => {
            active = self.isActive;
            last = performance.now();
          },
        });

        const pause = () => { paused = true; };
        const resume = () => { paused = false; last = performance.now(); };
        deck.addEventListener("pointerenter", pause);
        deck.addEventListener("pointerleave", resume);
        deck.addEventListener("pointerdown", pause);
        deck.addEventListener("focusin", pause);
        deck.addEventListener("focusout", resume);

        return () => {
          cancelAnimationFrame(raf);
          deck.removeEventListener("pointerenter", pause);
          deck.removeEventListener("pointerleave", resume);
          deck.removeEventListener("pointerdown", pause);
          deck.removeEventListener("focusin", pause);
          deck.removeEventListener("focusout", resume);
        };
      };

      const setupMemoryFill = () => {
        const memoryText = root.querySelector<HTMLElement>("[data-memory-fill]");
        if (!memoryText) return;
        const words = Array.from(
          memoryText.querySelectorAll<HTMLElement>("[data-fill-word]")
        );
        if (!words.length) return;

        gsap.set(words, { color: "rgba(21, 21, 21, 0.19)" });
        gsap.to(words, {
          color: "rgba(21, 21, 21, 1)",
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: memoryText,
            start: "top 78%",
            end: "bottom 42%",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
      };



      if (isCompact) {
        gsap.set("[data-caption]", {
          autoAlpha: 0,
          y: 30,
          filter: "blur(5px)",
        });
        gsap.set(
          ".cc-reveal, .cc-hero-copy, .cc-stat, .cc-mega-word",
          {
            autoAlpha: 0,
            y: 54,
            scale: 0.975,
            filter: "blur(7px)",
          }
        );
        gsap.set(
          ".cc-problem-card, .cc-install-item, .cc-fit-item, .cc-aos-row, .cc-aos-core, .cc-detail-reveal, .cc-hero-actions, .cc-onboarding-step",
          {
            autoAlpha: 0,
            y: 30,
            scale: 0.975,
            filter: "blur(4px)",
            clipPath: "inset(0% 0% 0% 0% round 0px)",
          }
        );

        gsap.fromTo(
          ".cc-video-media",
          { autoAlpha: 1, scale: 1 },
          {
            autoAlpha: 0.76,
            scale: 1.025,
            ease: "none",
            scrollTrigger: {
              trigger: ".cc-video-hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );

        const heroCopy = root.querySelector<HTMLElement>(".cc-hero-copy");
        if (heroCopy) {
          const heroCaptionLines =
            heroCopy.querySelectorAll<HTMLElement>("[data-caption]");
          const heroActions =
            heroCopy.querySelectorAll<HTMLElement>(".cc-hero-actions");
          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: heroCopy,
              start: "top 95%",
              end: "top 55%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          heroTimeline.to(
            heroCopy,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              ease: "power3.inOut",
              duration: 1,
            },
            0
          );

          if (heroCaptionLines.length) {
            heroTimeline.to(
              heroCaptionLines,
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                ease: "power3.out",
                stagger: 0.08,
                duration: 0.72,
              },
              0.12
            );
          }

          if (heroActions.length) {
            heroTimeline.to(
              heroActions,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                ease: "power3.out",
                duration: 0.55,
              },
              0.46
            );
          }
        }

        setupMemoryFill();
        const assetDeckCleanup = setupAssetDeck();
        const pillarFanCleanup = setupPillarFan();
        if (assetDeckCleanup) motionCleanups.push(assetDeckCleanup);
        if (pillarFanCleanup) motionCleanups.push(pillarFanCleanup);

        const mobileStackCards =
          gsap.utils.toArray<HTMLElement>(".cc-stack-card");
        gsap.set(mobileStackCards, {
          autoAlpha: 0.82,
          y: 38,
          scale: 0.985,
          filter: "blur(5px)",
        });
        gsap.set(mobileStackCards[0], {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });

        mobileStackCards.forEach(card => {
          const lines = card.querySelectorAll<HTMLElement>("[data-caption]");
          const detailItems = card.querySelectorAll<HTMLElement>(
          ".cc-problem-card, .cc-install-item, .cc-fit-item, .cc-aos-row, .cc-aos-core, .cc-detail-reveal, .cc-onboarding-step"
          );
          const productImage = card.querySelector<HTMLElement>(
            ".cc-product-shot img"
          );
          if (productImage) {
            gsap.set(productImage, { yPercent: 7, scale: 0.965 });
          }

          const cardTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 94%",
              end: "top 58%",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });

          cardTimeline.to(
            card,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              ease: "power3.inOut",
              duration: 1,
            },
            0
          );

          if (lines.length) {
            cardTimeline.to(
              lines,
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                ease: "power3.out",
                stagger: 0.05,
                duration: 0.72,
              },
              0.14
            );
          }

          if (detailItems.length) {
            cardTimeline.to(
              detailItems,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                ease: "power3.out",
                stagger: 0.035,
                duration: 0.66,
              },
              0.34
            );
          }

          if (productImage) {
            cardTimeline.to(
              productImage,
              {
                yPercent: 0,
                scale: 1,
                ease: "power3.out",
                duration: 0.86,
              },
              0.12
            );
          }
        });

        const revealMobileCard = (card: HTMLElement) => {
          if (card.dataset.mobileRevealed === "true") return;
          card.dataset.mobileRevealed = "true";

          const lines = card.querySelectorAll<HTMLElement>("[data-caption]");
          const detailItems = card.querySelectorAll<HTMLElement>(
            ".cc-problem-card, .cc-install-item, .cc-fit-item, .cc-aos-row, .cc-aos-core, .cc-detail-reveal, .cc-onboarding-step"
          );
          const productImage = card.querySelector<HTMLElement>(
            ".cc-product-shot img"
          );

          gsap.to(card, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.78,
            ease: "power3.out",
            overwrite: "auto",
          });

          if (lines.length) {
            gsap.to(lines, {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              stagger: 0.045,
              ease: "power3.out",
              overwrite: "auto",
              delay: 0.06,
            });
          }

          if (detailItems.length) {
            gsap.to(detailItems, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.64,
              stagger: 0.035,
              ease: "power3.out",
              overwrite: "auto",
              delay: 0.16,
            });
          }

          if (productImage) {
            gsap.to(productImage, {
              yPercent: 0,
              scale: 1,
              duration: 0.74,
              ease: "power3.out",
              overwrite: "auto",
              delay: 0.08,
            });
          }
        };

        if ("IntersectionObserver" in window) {
          mobileCardObserver = new IntersectionObserver(
            entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  revealMobileCard(entry.target as HTMLElement);
                }
              });
            },
            { threshold: [0.12, 0.28], rootMargin: "0px 0px -10% 0px" }
          );
          mobileStackCards.forEach(card => mobileCardObserver?.observe(card));
        } else {
          mobileStackCards.forEach(revealMobileCard);
        }

        revealVisibleMobileCards = () => {
          mobileStackCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight * 0.94) {
              revealMobileCard(card);
            }
          });
        };

        window.addEventListener("scroll", revealVisibleMobileCards, {
          passive: true,
        });
        window.addEventListener("touchmove", revealVisibleMobileCards, {
          passive: true,
        });
        window.addEventListener("resize", revealVisibleMobileCards);
        requestAnimationFrame(revealVisibleMobileCards);
        mobileRevealTimers = [
          window.setTimeout(revealVisibleMobileCards, 220),
          window.setTimeout(revealVisibleMobileCards, 900),
        ];

        gsap.utils.toArray<HTMLElement>(".cc-stat").forEach(stat => {
          gsap.to(stat, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.62,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stat,
              start: "top 88%",
              once: true,
            },
          });
        });

        ScrollTrigger.refresh();
        return;
      }

      gsap.set("[data-caption]", {
        autoAlpha: 0,
        y: 26,
        filter: "blur(5px)",
      });

      gsap.fromTo(
        ".cc-video-media",
        { autoAlpha: 1, scale: 1 },
        {
          scale: 1.08,
          autoAlpha: 0.58,
          ease: "none",
          scrollTrigger: {
            trigger: ".cc-video-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      const heroCopy = root.querySelector<HTMLElement>(".cc-hero-copy");
      if (heroCopy) {
        const heroCaptionLines =
          heroCopy.querySelectorAll<HTMLElement>("[data-caption]");
        const heroActions =
          heroCopy.querySelectorAll<HTMLElement>(".cc-hero-actions");
        gsap.set(heroActions, { autoAlpha: 0, y: 28 });
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroCopy,
            start: "top 84%",
            end: "center 40%",
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });

        heroTimeline.fromTo(
          heroCopy,
          {
            autoAlpha: 0.18,
            y: 84,
            scale: 0.965,
            filter: "blur(10px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "power3.inOut",
            duration: 1,
          },
          0
        );

        if (heroCaptionLines.length) {
          heroTimeline.to(
            heroCaptionLines,
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "power3.out",
              stagger: 0.08,
              duration: 0.76,
            },
            0.12
          );
        }

        if (heroActions.length) {
          heroTimeline.to(
            heroActions,
            {
              autoAlpha: 1,
              y: 0,
              ease: "power3.out",
              duration: 0.54,
              immediateRender: false,
            },
            0.48
          );
        }
      }

      gsap.utils.toArray<HTMLElement>(".cc-reveal").forEach(section => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          }
        );
      });

      const animateCaption = (card: HTMLElement) => {
        const lines = card.querySelectorAll<HTMLElement>("[data-caption]");
        const detailItems = card.querySelectorAll<HTMLElement>(
          ".cc-problem-card, .cc-install-item, .cc-fit-item, .cc-aos-row, .cc-aos-core, .cc-detail-reveal"
        );
        if (card.dataset.captionPlayed === "true") return;
        card.dataset.captionPlayed = "true";
        if (lines.length) {
          gsap.to(lines, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.92,
            stagger: 0.075,
            ease: "power3.out",
          });
        }
        if (detailItems.length) {
          gsap.fromTo(
            detailItems,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.58,
              stagger: 0.055,
              ease: "power3.out",
              delay: 0.12,
            }
          );
        }
      };

      const addCaptionToTimeline = (
        timeline: gsap.core.Timeline,
        card: HTMLElement,
        at: number
      ) => {
        const lines = card.querySelectorAll<HTMLElement>("[data-caption]");
        const detailItems = card.querySelectorAll<HTMLElement>(
          ".cc-problem-card, .cc-install-item, .cc-fit-item, .cc-aos-row, .cc-aos-core, .cc-detail-reveal"
        );

        if (lines.length) {
          timeline.to(
            lines,
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.48,
              stagger: 0.055,
              ease: "power3.out",
            },
            at
          );
        }

        if (detailItems.length) {
          timeline.fromTo(
            detailItems,
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.48,
              stagger: 0.035,
              ease: "power3.out",
              immediateRender: false,
            },
            at + 0.05
          );
        }
      };

      setupMemoryFill();
      const assetDeckCleanup = setupAssetDeck();
      const pillarFanCleanup = setupPillarFan();
      if (assetDeckCleanup) motionCleanups.push(assetDeckCleanup);
      if (pillarFanCleanup) motionCleanups.push(pillarFanCleanup);

      const stack = root.querySelector<HTMLElement>(".cc-card-stack");
      const stackStage = root.querySelector<HTMLElement>(".cc-stack-sticky");
      const stackCards = gsap.utils.toArray<HTMLElement>(".cc-stack-card");
      const usePinnedStack = false;
      if (stack && stackStage && stackCards.length && usePinnedStack) {
        const compactPinnedStack = window.matchMedia(
          "(max-height: 840px)"
        ).matches;
        const stackBaseYPercent = -50;
        const stackEnterYPercent = compactPinnedStack ? 82 : 112;
        gsap.set(stackCards, {
          xPercent: -50,
          yPercent: stackBaseYPercent,
          zIndex: index => 10 + index,
          filter: "brightness(1)",
        });
        gsap.set(stackCards.slice(1), {
          yPercent: stackEnterYPercent,
          scale: 0.985,
          autoAlpha: 0,
        });
        gsap.set(stackCards[0], {
          autoAlpha: 1,
          xPercent: -50,
          yPercent: stackBaseYPercent,
        });
        gsap.set(
          ".cc-problem-card, .cc-install-item, .cc-fit-item, .cc-aos-row, .cc-aos-core, .cc-detail-reveal",
          {
            autoAlpha: 0,
            y: 22,
          }
        );
        const stackCaptionTargets = stackCards.flatMap(card =>
          Array.from(card.querySelectorAll<HTMLElement>("[data-caption]"))
        );
        const laterStackCaptionTargets = stackCards
          .slice(1)
          .flatMap(card =>
            Array.from(card.querySelectorAll<HTMLElement>("[data-caption]"))
          );
        gsap.set(stackCaptionTargets, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
        });
        gsap.set(laterStackCaptionTargets, {
          autoAlpha: 0.24,
          y: 18,
          filter: "blur(3px)",
        });
        gsap.set(
          ".cc-install-item, .cc-fit-item, .cc-aos-row, .cc-aos-core, .cc-detail-reveal",
          {
            autoAlpha: 0.16,
            y: 18,
          }
        );
        gsap.set(
          stackCards[0].querySelectorAll<HTMLElement>(
            "[data-caption], .cc-problem-card"
          ),
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
          }
        );

        const stackTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stack,
            start: "top top",
            end: () => `+=${stackCards.length * window.innerHeight * 1.05}`,
            scrub: 0.85,
            pin: stackStage,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        addCaptionToTimeline(stackTimeline, stackCards[0], 0);

        stackCards.forEach((card, index) => {
          if (index === 0) return;
          const previous = stackCards[index - 1];
          const at = 0.82 + (index - 1) * 1.12;
          const activeYOffset = compactPinnedStack
            ? Math.min(index * 0.32, 3)
            : Math.min(index * 0.72, 7.5);
          const activeScale = 1 - Math.min(index * 0.004, 0.05);
          const previousYOffset = compactPinnedStack
            ? Math.min(index * 0.42, 4.5)
            : Math.min(index * 0.8, 10);
          const previousScale = 0.956 - Math.min(index * 0.006, 0.074);

          stackTimeline.to(
            card,
            {
              autoAlpha: 1,
              yPercent: stackBaseYPercent + activeYOffset,
              scale: activeScale,
              ease: "power3.inOut",
              duration: 0.95,
            },
            at
          );

          stackTimeline.to(
            previous,
            {
              yPercent: stackBaseYPercent - 2.4 - previousYOffset,
              scale: previousScale,
              filter: "brightness(0.9)",
              ease: "power3.inOut",
              duration: 0.95,
            },
            at
          );

          addCaptionToTimeline(stackTimeline, card, at);
        });
      } else {
        if (isCompact) {
          gsap.set(stackCards, {
            clearProps: "transform,opacity,visibility,filter,x,y,scale,rotate,rotateX,rotateY,rotateZ",
          });
        } else {
          gsap.set(stackCards, {
            autoAlpha: 0.68,
            y: lowHeightDesktop ? 54 : 88,
            scale: 0.94,
            transformPerspective: 1600,
            transformOrigin: "center center",
          });
        }
        gsap.set(
          ".cc-stack-card [data-caption], .cc-stack-card .cc-problem-card, .cc-stack-card .cc-detail-reveal, .cc-stack-card .cc-onboarding-step",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }
        );

        stackCards.forEach((card, index) => {
          if (isCompact) return;
          const direction = index % 2 === 0 ? -1 : 1;
          const isProductCard = card.classList.contains(
            "cc-stack-card-product-proof"
          );
          const fanDistance = isProductCard
            ? direction * (56 + (index % 3) * 18)
            : direction * 18;
          const fanRotation = isProductCard
            ? direction * (index % 3 === 0 ? -4.2 : 3.2)
            : direction * 1.1;
          const productShot = card.querySelector<HTMLElement>(".cc-product-shot");
          const productImage =
            card.querySelector<HTMLElement>(".cc-product-shot img");

          gsap.set(card, {
            x: fanDistance,
            rotateX: isProductCard ? 7.2 : 5.5,
            rotateY: direction * (isProductCard ? 4.8 : 2.8),
            rotateZ: fanRotation,
          });

          const flowTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "bottom 18%",
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          });

          flowTimeline
            .to(
              card,
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                ease: "power3.out",
                duration: 0.5,
              },
              0
            )
            .to(
              card,
              {
                x: isProductCard ? direction * -16 : 0,
                y: isProductCard ? -48 : -34,
                scale: isProductCard ? 0.972 : 0.982,
                rotateX: isProductCard ? -3.2 : -2.4,
                rotateY: direction * (isProductCard ? -2 : -1.2),
                rotateZ: isProductCard ? direction * -1.1 : 0,
                ease: "none",
                duration: 0.5,
              },
              0.5
            );

          if (productShot) {
            gsap.fromTo(
              productShot,
              {
                y: 18,
                x: direction * 16,
                scale: 0.97,
                rotateX: 3.6,
                rotateY: direction * 3.2,
                rotateZ: direction * 1.8,
              },
              {
                y: -28,
                x: direction * -10,
                scale: 1,
                rotateX: 0,
                rotateY: direction * -1.2,
                rotateZ: direction * -0.9,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.9,
                  invalidateOnRefresh: true,
                },
              }
            );
          }

          if (productImage) {
            gsap.fromTo(
              productImage,
              {
                yPercent: 0,
                scale: 1.04,
                filter: "contrast(1.03) saturate(1.04)",
              },
              {
                yPercent: -3,
                scale: 1.01,
                filter: "contrast(1.06) saturate(1.05)",
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              }
            );
          }

          ScrollTrigger.create({
            trigger: card,
            start: "top 74%",
            once: true,
            onEnter: () => animateCaption(card),
          });
        });
      }

      const megaWord = root.querySelector<HTMLElement>(".cc-mega-word");
      if (megaWord) {
        gsap.fromTo(
          megaWord,
          {
            autoAlpha: 0,
            yPercent: 16,
            scale: 0.94,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: megaWord,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      gsap.utils
        .toArray<HTMLElement>(".cc-caption")
        .filter(
          caption =>
            !caption.closest(".cc-stack-card") &&
            !caption.closest(".cc-hero-copy")
        )
        .forEach(caption => {
          const lines = caption.querySelectorAll<HTMLElement>("[data-caption]");
          if (!lines.length) return;
          gsap.to(lines, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: caption,
              start: "top 84%",
              once: true,
            },
          });
        });

      const staggerGroups = [[".cc-stats-grid", ".cc-stat"]] as const;

      staggerGroups.forEach(([trigger, targets]) => {
        gsap.from(targets, {
          autoAlpha: 0,
          y: 22,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger,
            start: "top 80%",
            once: true,
          },
        });
      });
    }, root);

    let refreshTimer = 0;
    const refreshScrollTriggers = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };

    const images = Array.from(root.querySelectorAll<HTMLImageElement>("img"));
    images.forEach(image => {
      if (!image.complete) {
        image.addEventListener("load", refreshScrollTriggers, { once: true });
        image.addEventListener("error", refreshScrollTriggers, { once: true });
      }
    });

    window.addEventListener("load", refreshScrollTriggers);
    window.addEventListener("orientationchange", refreshScrollTriggers);
    window.addEventListener("resize", refreshScrollTriggers);
    refreshScrollTriggers();

    return () => {
      images.forEach(image => {
        image.removeEventListener("load", refreshScrollTriggers);
        image.removeEventListener("error", refreshScrollTriggers);
      });
      window.clearTimeout(refreshTimer);
      window.removeEventListener("load", refreshScrollTriggers);
      window.removeEventListener("orientationchange", refreshScrollTriggers);
      window.removeEventListener("resize", refreshScrollTriggers);
      mobileRevealTimers.forEach(timer => window.clearTimeout(timer));
      if (revealVisibleMobileCards) {
        window.removeEventListener("scroll", revealVisibleMobileCards);
        window.removeEventListener("touchmove", revealVisibleMobileCards);
        window.removeEventListener("resize", revealVisibleMobileCards);
      }
      mobileCardObserver?.disconnect();
      motionCleanups.forEach(cleanup => cleanup());
      delete root.dataset.motionMode;
      ctx.revert();
    };
  }, [rootRef]);
}

function SystemsField({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "stack";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        failIfMajorPerformanceCaveat: false,
      });
    } catch (err) {
      console.warn("SystemsField: WebGL unavailable, skipping render", err);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, variant === "stack" ? 8.4 : 7);

    const group = new THREE.Group();
    scene.add(group);

    const warmLine = new THREE.LineBasicMaterial({
      color: 0xe26a2c,
      transparent: true,
      opacity: variant === "stack" ? 0.22 : 0.34,
    });
    const inkLine = new THREE.LineBasicMaterial({
      color: 0x1b1b1a,
      transparent: true,
      opacity: variant === "stack" ? 0.08 : 0.12,
    });
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0xe26a2c,
      size: variant === "stack" ? 0.04 : 0.032,
      sizeAttenuation: true,
      transparent: true,
      opacity: variant === "stack" ? 0.36 : 0.2,
    });

    const makeGrid = (
      size: number,
      step: number,
      z: number,
      material: THREE.Material
    ) => {
      const vertices: number[] = [];
      for (let i = -size; i <= size; i += step) {
        vertices.push(-size, i, z, size, i, z);
        vertices.push(i, -size, z, i, size, z);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      const lines = new THREE.LineSegments(geometry, material);
      group.add(lines);
      return geometry;
    };

    const makeNodes = (size: number, step: number, z: number) => {
      const vertices: number[] = [];
      for (let x = -size; x <= size; x += step) {
        for (let y = -size; y <= size; y += step) {
          if ((Math.round((x + y) / step) + 100) % 3 !== 0) continue;
          vertices.push(x, y, z);
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      const points = new THREE.Points(geometry, nodeMaterial);
      group.add(points);
      return geometry;
    };

    const geometries =
      variant === "stack"
        ? [
            makeGrid(5.4, 0.72, 0, warmLine),
            makeGrid(7.2, 1.2, -0.85, inkLine),
            makeNodes(5.4, 0.72, 0.18),
          ]
        : [
            makeGrid(3.6, 0.6, 0, warmLine),
            makeGrid(4.4, 0.88, -0.35, inkLine),
          ];

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const stackSection = canvas.closest<HTMLElement>(".cc-card-stack");
    let frame = 0;
    let animationId = 0;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.floor(width));
      const nextHeight = Math.max(1, Math.floor(height));
      renderer.setSize(nextWidth, nextHeight, false);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    };

    const getScrollProgress = () => {
      if (!stackSection) return 0;
      const rect = stackSection.getBoundingClientRect();
      const distance = rect.height + window.innerHeight;
      if (distance <= 0) return 0;
      return Math.min(1, Math.max(0, (window.innerHeight - rect.top) / distance));
    };

    const render = () => {
      frame += 0.004;
      if (!reduceMotion) {
        const progress = variant === "stack" ? getScrollProgress() : 0;
        const targetRotationX =
          variant === "stack"
            ? -0.68 + progress * 0.74 + Math.sin(frame) * 0.04
            : -0.42 + Math.sin(frame) * 0.035;
        const targetRotationY =
          variant === "stack"
            ? 0.18 + progress * 1.28 + Math.cos(frame * 0.8) * 0.05
            : 0.44 + Math.cos(frame * 0.8) * 0.04;
        const targetCameraZ =
          variant === "stack" ? 8.4 - progress * 2.05 : 7;

        group.rotation.x += (targetRotationX - group.rotation.x) * 0.06;
        group.rotation.y += (targetRotationY - group.rotation.y) * 0.06;
        group.position.x = variant === "stack" ? (progress - 0.5) * 0.9 : 0;
        group.position.y =
          (variant === "stack" ? 0.18 - progress * 0.3 : 0) +
          Math.sin(frame * 0.7) * 0.05;
        camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      }
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    render();

    return () => {
      window.cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      geometries.forEach(geometry => geometry.dispose());
      warmLine.dispose();
      inkLine.dispose();
      nodeMaterial.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
