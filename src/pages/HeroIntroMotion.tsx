import { useEffect, useState } from "react";

// The opening graphic teaches the Indicated Outcome Report (IOR) idea in one
// beat: a project's planned profit, minus the risk you name early, equals the
// gross profit you'll actually land. Kept short so it never gates the hero.
const INTRO_DURATION_MS = 6000;
const INTRO_BRIDGE_START_MS = INTRO_DURATION_MS - 1500;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MAX_VIDEO_WAIT_MS = 4000;

type HeroIntroMotionProps = {
  onComplete: () => void;
  onBridgeStart?: () => void;
  videoPlaying?: boolean;
};

export default function HeroIntroMotion({
  onComplete,
  onBridgeStart,
  videoPlaying = false,
}: HeroIntroMotionProps) {
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });
  const [timerElapsed, setTimerElapsed] = useState(false);
  const [waitDeadlineHit, setWaitDeadlineHit] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      REDUCED_MOTION_QUERY
    ).matches;

    if (prefersReducedMotion) {
      setShouldRender(false);
      onBridgeStart?.();
      onComplete();
      return;
    }

    const bridgeTimer = window.setTimeout(() => {
      onBridgeStart?.();
    }, INTRO_BRIDGE_START_MS);

    const timer = window.setTimeout(() => {
      setTimerElapsed(true);
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(bridgeTimer);
      window.clearTimeout(timer);
    };
  }, [onBridgeStart, onComplete]);

  // Hold the dissolve until the hero frame is ready so the hand-off lands on a
  // real still, not a blank. Hard ceiling protects against a never-ready frame.
  useEffect(() => {
    if (!timerElapsed) return;
    if (typeof window === "undefined") return;
    const deadline = window.setTimeout(() => {
      setWaitDeadlineHit(true);
    }, MAX_VIDEO_WAIT_MS);
    return () => window.clearTimeout(deadline);
  }, [timerElapsed]);

  useEffect(() => {
    if (!timerElapsed) return;
    if (!videoPlaying && !waitDeadlineHit) return;
    setShouldRender(false);
    onComplete();
  }, [timerElapsed, videoPlaying, waitDeadlineHit, onComplete]);

  if (!shouldRender) return null;

  return (
    <div className="cc-hero-intro-motion cc-ior-intro" aria-hidden="true">
      <div className="cc-ior-intro-inner">
        <p className="cc-ior-intro-eyebrow">Indicated Outcome Report</p>
        <h2 className="cc-ior-intro-title">
          Every project is <em>profit</em> — minus the <em>risk</em> you can
          see.
        </h2>

        <div className="cc-ior-intro-figure">
          <div className="cc-ior-intro-track">
            <div className="cc-ior-intro-fill">
              <span className="cc-ior-intro-fill-indicated">
                Indicated gross profit
              </span>
              <span className="cc-ior-intro-fill-risk">Risk exposure</span>
            </div>
          </div>
          <p className="cc-ior-intro-project">Project — Summit Builders</p>
        </div>

        <div className="cc-ior-intro-ledger">
          <div className="cc-ior-intro-cell">
            <small>Planned profit</small>
            <strong>$500,000</strong>
          </div>
          <span className="cc-ior-intro-op">&minus;</span>
          <div className="cc-ior-intro-cell is-risk">
            <small>Risk exposure</small>
            <strong>$175,000</strong>
          </div>
          <span className="cc-ior-intro-op">=</span>
          <div className="cc-ior-intro-cell is-indicated">
            <small>Indicated gross profit</small>
            <strong>$325,000</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
