import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileText,
  Clock,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  User,
  Activity,
} from "lucide-react";
import "./OwnerBottleneck.css";

gsap.registerPlugin(ScrollTrigger);

type Node = {
  id: string;
  label: string;
  Icon: typeof FileText;
  tint: string; // bg tint
  dot: string; // dot color
  /** card position % within the right stage (top-left of card) */
  x: number;
  y: number;
  /** end point on card edge where the line meets (relative to stage 0-100) */
  ex: number;
  ey: number;
};

// Hub center in stage coords (percent)
const HUB = { x: 62, y: 50, r: 13 };

const NODES: Node[] = [
  {
    id: "contract",
    label: "Contract\nquestions wait\nfor you.",
    Icon: FileText,
    tint: "#EAF1FE",
    dot: "#2D6BF0",
    x: 14, y: 6, ex: 38, ey: 18,
  },
  {
    id: "change",
    label: "Change orders\nget reviewed late.",
    Icon: Clock,
    tint: "#FDECEC",
    dot: "#E54B4B",
    x: 70, y: 6, ex: 78, ey: 18,
  },
  {
    id: "selections",
    label: "Selections slow\nthe schedule.",
    Icon: Calendar,
    tint: "#E6F4EA",
    dot: "#34A853",
    x: 4, y: 40, ex: 32, ey: 47,
  },
  {
    id: "pms",
    label: "PMs manage\ndifferently.",
    Icon: Users,
    tint: "#EFE9FB",
    dot: "#7C4DFF",
    x: 82, y: 40, ex: 84, ey: 47,
  },
  {
    id: "costs",
    label: "Committed costs\nare unclear.",
    Icon: DollarSign,
    tint: "#FBF1D8",
    dot: "#E0A93D",
    x: 22, y: 72, ex: 44, ey: 68,
  },
  {
    id: "risk",
    label: "Risk shows up\ntoo late.",
    Icon: AlertTriangle,
    tint: "#FDECEC",
    dot: "#E54B4B",
    x: 72, y: 72, ex: 78, ey: 68,
  },
];

const BOTTOM = {
  label: "The company needs a\nrhythm the team can run.",
  Icon: Activity,
  tint: "#FFF3E2",
  dot: "#F2994A",
  x: 42, y: 92, ex: 62, ey: 78,
};

// Build a smooth curve from hub edge to card endpoint
function curve(ex: number, ey: number) {
  const sx = HUB.x;
  const sy = HUB.y;
  // control point: pull toward hub-side horizontally then card vertically
  const cx = (sx + ex) / 2;
  const cy = ey > sy ? ey : ey; // gentle s-curve
  const c1x = sx + (ex - sx) * 0.35;
  const c1y = sy;
  const c2x = ex - (ex - sx) * 0.35;
  const c2y = ey;
  return `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
}

export default function OwnerBottleneck() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Prepare paths
      const paths = root.querySelectorAll<SVGPathElement>(".ob-path");
      paths.forEach(p => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });

      if (reduce) {
        gsap.set(".ob-word, .ob-body, .ob-eyebrow, .ob-hub, .ob-card, .ob-dot", {
          opacity: 1, y: 0, scale: 1,
        });
        paths.forEach(p => (p.style.strokeDashoffset = "0"));
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.from(".ob-eyebrow", { opacity: 0, y: 12, duration: 0.5 })
        .from(".ob-word", {
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.06,
        }, "-=0.25")
        .from(".ob-body", { opacity: 0, y: 12, duration: 0.6 }, "-=0.4")
        .from(".ob-hub", {
          opacity: 0,
          scale: 0.6,
          duration: 0.7,
          ease: "back.out(1.6)",
        }, "-=0.5")
        .to(paths, {
          strokeDashoffset: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.inOut",
        }, "-=0.3")
        .from(".ob-card", {
          opacity: 0,
          y: 10,
          scale: 0.94,
          duration: 0.55,
          stagger: 0.07,
        }, "-=0.85")
        .from(".ob-dot", {
          opacity: 0,
          scale: 0,
          duration: 0.35,
          stagger: 0.07,
          ease: "back.out(2)",
        }, "-=0.6");

      // Gentle hub pulse loop
      gsap.to(".ob-hub-ring", {
        scale: 1.12,
        opacity: 0,
        duration: 2.4,
        repeat: -1,
        ease: "power2.out",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const headline = "If everything flows back to the owner, the owner is still the operating system.";

  return (
    <section ref={rootRef} className="ob-section" aria-label="Owner bottleneck">
      <div className="ob-grid">
        <div className="ob-copy">
          <p className="ob-eyebrow">OWNER BOTTLENECK</p>
          <h2 className="ob-headline">
            {headline.split(" ").map((w, i) => (
              <span key={i} className="ob-word-wrap">
                <span className="ob-word">{w}</span>{" "}
              </span>
            ))}
          </h2>
          <p className="ob-body">
            When every decision, update, and exception requires the owner,
            momentum stalls. Visibility drops. Risk compounds. It's not about
            working harder—it's about building a system that runs without you.
          </p>
        </div>

        <div className="ob-stage" aria-hidden="true">
          <svg
            className="ob-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {NODES.map(n => (
              <path
                key={n.id}
                className="ob-path"
                d={curve(n.ex, n.ey)}
                fill="none"
                stroke="#D7DCE3"
                strokeWidth="0.25"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path
              className="ob-path"
              d={curve(BOTTOM.ex, BOTTOM.ey)}
              fill="none"
              stroke="#D7DCE3"
              strokeWidth="0.25"
              vectorEffect="non-scaling-stroke"
            />
            {/* End dots */}
            {NODES.map(n => (
              <circle
                key={`d-${n.id}`}
                className="ob-dot"
                cx={n.ex}
                cy={n.ey}
                r="0.7"
                fill={n.dot}
              />
            ))}
            <circle
              className="ob-dot"
              cx={BOTTOM.ex}
              cy={BOTTOM.ey}
              r="0.7"
              fill={BOTTOM.dot}
            />
          </svg>

          {/* Hub */}
          <div
            className="ob-hub"
            style={{
              left: `${HUB.x}%`,
              top: `${HUB.y}%`,
            }}
          >
            <span className="ob-hub-ring" />
            <span className="ob-hub-ring ob-hub-ring-2" />
            <div className="ob-hub-inner">
              <User strokeWidth={1.5} />
              <span>OWNER</span>
            </div>
          </div>

          {/* Cards */}
          {NODES.map(n => (
            <div
              key={n.id}
              className="ob-card"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <span className="ob-card-icon" style={{ background: n.tint, color: n.dot }}>
                <n.Icon strokeWidth={1.75} />
              </span>
              <p>
                {n.label.split("\n").map((l, i) => (
                  <span key={i}>{l}<br /></span>
                ))}
              </p>
            </div>
          ))}

          {/* Bottom highlighted card */}
          <div
            className="ob-card ob-card-feature"
            style={{ left: `${BOTTOM.x}%`, top: `${BOTTOM.y}%` }}
          >
            <span className="ob-card-icon ob-card-icon-feature" style={{ background: BOTTOM.tint, color: BOTTOM.dot }}>
              <BOTTOM.Icon strokeWidth={1.75} />
              <span className="ob-spark ob-spark-a" />
              <span className="ob-spark ob-spark-b" />
              <span className="ob-spark ob-spark-c" />
            </span>
            <p>
              {BOTTOM.label.split("\n").map((l, i) => (
                <span key={i}>{l}<br /></span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
