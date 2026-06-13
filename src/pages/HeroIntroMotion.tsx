import { useEffect, useState, type CSSProperties } from "react";

const INTRO_DURATION_MS = 6900;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type FloatingWord = {
  label: string;
  x: string;
  y: string;
  dx: string;
  dy: string;
  delay: number;
  scale: number;
  tone?: "risk" | "quiet";
  mobileSecondary?: boolean;
};

const floatingWords: FloatingWord[] = [
  {
    label: "Contract",
    x: "8%",
    y: "20%",
    dx: "12px",
    dy: "-18px",
    delay: 80,
    scale: 1.05,
  },
  {
    label: "Change Order",
    x: "58%",
    y: "14%",
    dx: "-16px",
    dy: "-14px",
    delay: 170,
    scale: 1.18,
    tone: "risk",
  },
  {
    label: "Schedule",
    x: "31%",
    y: "28%",
    dx: "20px",
    dy: "-22px",
    delay: 250,
    scale: 1.02,
  },
  {
    label: "Takeoff",
    x: "76%",
    y: "26%",
    dx: "-22px",
    dy: "-18px",
    delay: 330,
    scale: 0.94,
  },
  {
    label: "Bids",
    x: "18%",
    y: "52%",
    dx: "18px",
    dy: "-16px",
    delay: 420,
    scale: 0.9,
  },
  {
    label: "Proposal",
    x: "43%",
    y: "60%",
    dx: "-14px",
    dy: "-24px",
    delay: 520,
    scale: 1.05,
  },
  {
    label: "Extension of Time",
    x: "69%",
    y: "48%",
    dx: "-28px",
    dy: "-22px",
    delay: 620,
    scale: 1.1,
    tone: "risk",
    mobileSecondary: true,
  },
  {
    label: "General Conditions",
    x: "10%",
    y: "72%",
    dx: "18px",
    dy: "-20px",
    delay: 720,
    scale: 0.92,
    mobileSecondary: true,
  },
  {
    label: "Committed Costs",
    x: "54%",
    y: "78%",
    dx: "-16px",
    dy: "-22px",
    delay: 820,
    scale: 1,
    mobileSecondary: true,
  },
  {
    label: "Buyout",
    x: "84%",
    y: "68%",
    dx: "-24px",
    dy: "-18px",
    delay: 910,
    scale: 0.9,
  },
  {
    label: "Percent Complete",
    x: "24%",
    y: "36%",
    dx: "26px",
    dy: "-18px",
    delay: 1000,
    scale: 0.88,
    mobileSecondary: true,
  },
  {
    label: "Remaining Costs",
    x: "49%",
    y: "38%",
    dx: "-20px",
    dy: "-20px",
    delay: 1090,
    scale: 1.06,
    tone: "risk",
  },
  {
    label: "Remaining to Be Paid",
    x: "70%",
    y: "82%",
    dx: "-18px",
    dy: "-20px",
    delay: 1180,
    scale: 0.86,
    mobileSecondary: true,
  },
  {
    label: "Cost Codes",
    x: "38%",
    y: "18%",
    dx: "16px",
    dy: "-14px",
    delay: 1260,
    scale: 0.9,
    mobileSecondary: true,
  },
  {
    label: "WIP",
    x: "14%",
    y: "40%",
    dx: "12px",
    dy: "-18px",
    delay: 1340,
    scale: 1.24,
    tone: "risk",
  },
  {
    label: "Lien Waiver",
    x: "80%",
    y: "42%",
    dx: "-20px",
    dy: "-20px",
    delay: 1420,
    scale: 0.92,
    mobileSecondary: true,
  },
  {
    label: "Requisition",
    x: "36%",
    y: "74%",
    dx: "18px",
    dy: "-16px",
    delay: 1510,
    scale: 0.92,
    mobileSecondary: true,
  },
  {
    label: "Lookahead",
    x: "61%",
    y: "62%",
    dx: "-16px",
    dy: "-18px",
    delay: 1600,
    scale: 0.94,
  },
  {
    label: "Delay",
    x: "77%",
    y: "18%",
    dx: "-26px",
    dy: "-22px",
    delay: 1680,
    scale: 1.24,
    tone: "risk",
  },
  {
    label: "Scope Gap",
    x: "25%",
    y: "84%",
    dx: "22px",
    dy: "-16px",
    delay: 1760,
    scale: 1.02,
    tone: "risk",
  },
  {
    label: "Allowance",
    x: "7%",
    y: "62%",
    dx: "16px",
    dy: "-18px",
    delay: 1840,
    scale: 0.9,
    mobileSecondary: true,
  },
  {
    label: "Contingency",
    x: "48%",
    y: "24%",
    dx: "-16px",
    dy: "-16px",
    delay: 1920,
    scale: 0.98,
  },
  {
    label: "Exposure",
    x: "63%",
    y: "34%",
    dx: "-20px",
    dy: "-24px",
    delay: 2000,
    scale: 1.34,
    tone: "risk",
  },
];

const riskDollars = ["$$$", "$$$", "$$$"];

function wordStyle(word: FloatingWord) {
  return {
    "--intro-x": word.x,
    "--intro-y": word.y,
    "--intro-dx": word.dx,
    "--intro-dy": word.dy,
    "--intro-scale": word.scale,
    animationDelay: `${Math.round(word.delay * 0.42)}ms`,
  } as CSSProperties;
}

export default function HeroIntroMotion({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      REDUCED_MOTION_QUERY
    ).matches;

    if (prefersReducedMotion) {
      setShouldRender(false);
      onComplete();
      return;
    }

    const timer = window.setTimeout(() => {
      setShouldRender(false);
      onComplete();
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div className="cc-hero-intro-motion" aria-hidden="true">
      <div className="cc-intro-grid" />
      <div className="cc-intro-scan" />
      <div className="cc-intro-word-cloud">
        {floatingWords.map(word => (
          <span
            key={word.label}
            className={`cc-intro-word${
              word.tone ? ` is-${word.tone}` : ""
            }${word.mobileSecondary ? " is-mobile-secondary" : ""}`}
            style={wordStyle(word)}
          >
            {word.label}
          </span>
        ))}
      </div>

      <div className="cc-intro-chart">
        <span className="cc-intro-axis cc-intro-axis-vertical" />
        <span className="cc-intro-axis cc-intro-axis-horizontal" />

        <div className="cc-intro-chart-column cc-intro-profit-column">
          <span className="cc-intro-chart-label">Profit</span>
          <strong>$500,000</strong>
          <small>Planned Profit</small>
        </div>

        <div className="cc-intro-chart-column cc-intro-risk-column">
          <span className="cc-intro-chart-label">Risk</span>
          <div className="cc-intro-risk-dollars">
            {riskDollars.map((value, index) => (
              <span key={`${value}-${index}`}>{value}</span>
            ))}
          </div>
          <p className="cc-intro-risk-exposure">
            -$175,000
            <small>Risk Exposure</small>
          </p>
        </div>

        <div className="cc-intro-current-profit">
          <span>Current Expected Profit</span>
          <strong>$325,000</strong>
        </div>
      </div>
    </div>
  );
}
