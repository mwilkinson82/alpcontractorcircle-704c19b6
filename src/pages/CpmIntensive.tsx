import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import "./CpmIntensive.css";

const CPM_CHECKOUT_URL = "https://buy.stripe.com/5kQ14oe0h5uSgMo7zkeQM1p";
const CPM_MEMBER_CHECKOUT_URL = "https://buy.stripe.com/9B6cN6bS96yWeEg9HseQM1q";
const PUBLIC_PRICE = "$1,997";
const MEMBER_PRICE = "$1,497";

const CPM_SESSION_HOURS = "10 a.m.–5 p.m. Eastern";

const CPM_SEO = {
  title: "ALP CPM Schedule Intensive (2-Day) | ALP Contractor Circle",
  description:
    "Master CPM scheduling in Primavera P6 with Marshall Wilkinson. Build your own baseline, run reliable updates, analyze delay and establish the time record for extensions and delay damages. September 25–26, 2026. Two live days. $1,997 USD per seat.",
  canonical: "https://alpcontractorcircle.com/cpm-intensive",
  image: "https://alpcontractorcircle.com/og-contractor-circle.png",
};

const offerStrip = [
  { label: "Format", value: "2 live days" },
  { label: "Tuition", value: "$1,997 / seat" },
  { label: "Seats", value: "Unlimited" },
  { label: "Dates", value: "September 25–26, 2026" },
  { label: "Days", value: "Day 1 CPM · Day 2 Delay analysis" },
];

const agenda = [
  {
    day: "Day 1",
    title: "Build and update the CPM.",
    critical: false,
    image: "/assets/cpm-intensive/schedule-gantt.png",
    imageAlt: "Gantt bars and activity data from a real construction schedule",
    imageCaption: "PS338 · Update #1",
    beats: [
      "CPM fundamentals and hands-on Primavera P6 Professional",
      "Build your own schedule: activity IDs, descriptions and durations",
      "Construction sequencing, relationships and logic",
      "Establish a credible baseline and identify the critical path",
      "Update actual starts, finishes, remaining duration and the data date",
      "Keep each update traceable to the baseline and prior update",
      "Concurrent-delay discipline: separate overlapping causes",
      "Insert delay and change-order fragments into the schedule logic",
      "Track critical-path changes and effects on the finish date",
      "Reports and narratives that explain the job to the owner",
      "P6 as the camera: use the schedule as a leading indicator",
    ],
  },
  {
    day: "Day 2",
    title: "Analyze and prove delay.",
    critical: true,
    image: "/assets/cpm-intensive/tallman-longest-path.png",
    imageAlt: "Tallman Island longest-path schedule with critical activities in red",
    imageCaption: "Tallman Island · longest path",
    beats: [
      "Plan vs as-built: compare the intended sequence with the work",
      "Collapsed as-built analysis",
      "Windows analysis: follow the path through successive updates",
      "Prove delay: event, affected activities, critical path and finish",
      "Test overlapping delays and distinguish responsibility",
      "Analyze fragments, resequencing and change-order impacts",
      "Trace trade stacking and disruption alongside productivity records",
      "Build the time record for extensions and delay-damage calculations",
      "Write a delay narrative supported by the schedule and job records",
    ],
  },
];

const outcomes = [
  {
    number: "01",
    title: "Build the baseline you can work from.",
    body: "Create your own schedule in P6. Set realistic construction sequences, durations and logic so the baseline explains how the job is supposed to be built.",
  },
  {
    number: "02",
    title: "Make every update tell the truth.",
    body: "Record actual progress, remaining work and changed logic. Explain movement from the baseline and prior update, and examine concurrent delays rather than hiding them in a revised finish date.",
  },
  {
    number: "03",
    title: "Show what actually drove the delay.",
    body: "Insert delays and change-order fragments into the logic. Trace field conditions, stop-work directions, design problems and resequencing through affected activities to the critical path.",
  },
  {
    number: "04",
    title: "Put time behind the damages calculation.",
    body: "Quantify the supported delay period for an extension of time and the time basis for delay damages. Connect the schedule to the notices, daily reports and cost records that support the claim.",
  },
];

const packs = [
  {
    day: "Day 1 pack",
    title: "Build and run the schedule.",
    items: [
      "CPM one-pager",
      "Activity standards sheet",
      "Logic rules sheet",
      "Baseline checklist",
      "Update runbook",
      "Concurrent-delay card",
      "Intro fragment worksheet",
      "Reports cheat-sheet",
      "Light narrative card",
      "Monday install checklist",
    ],
  },
  {
    day: "Day 2 pack",
    title: "Prove the time.",
    items: [
      "Delay analysis method map",
      "Prove-delay checklist",
      "Analysis fragment worksheet",
      "Delay-claim narrative outline",
    ],
  },
];

const setup = [
  { term: "Machine", detail: "A Windows machine that can run Primavera P6 Professional." },
  { term: "License", detail: "Company P6 license works. Otherwise use the free 30-day P6 Professional trial from Oracle Software Delivery Cloud — installed and running before Day 1." },
  { term: "On screen", detail: "You build and update in Primavera P6 Professional throughout the classroom exercises." },
  { term: "Bring", detail: "A job example with names and sensitive information removed, for classroom practice." },
];

const fitFor = [
  "Construction company owners who need to see time and risk before they turn into a claim.",
  "Project managers who need to build, understand and maintain the schedule they submit to the owner.",
  "Teams that want practical Primavera P6 skills and sound construction scheduling habits.",
  "Contractors who need to explain delay, support extensions and establish the time basis for damages.",
];

const practice = [
  "An unforeseen field condition interrupts a planned activity.",
  "A stop-work direction holds work on the critical path.",
  "A design error or omission changes the sequence or adds work.",
  "The CM directs out-of-sequence work, creating trade stacking and disrupted production.",
];

const faq = [
  {
    q: "Will I actually learn Primavera P6?",
    a: "Yes. Everyone builds their own schedule in Primavera P6 Professional while learning CPM fundamentals and construction scheduling best practices. You work through the baseline, updates, logic, critical path and delay fragments. The purpose is to use P6 to plan the job, manage risk and support a time argument.",
  },
  {
    q: "How does the schedule help with extensions and damages?",
    a: "You learn to connect an event to affected activities, test its effect on the critical path and quantify the supported delay period. That time record supports an extension request and provides the time basis for delay-damage calculations. Notices, contract requirements, daily records and cost evidence still matter; a moved finish date alone does not prove the claim.",
  },
  {
    q: "What does the P6 trial include?",
    a: "When you enroll, you get the link to Oracle's 30-day free trial of Primavera P6 Professional so you can build your own schedule in class. An existing company P6 license also works. Download and trial acceptance take place directly with Oracle.",
  },
  {
    q: "What software and machine do I need?",
    a: "A Windows machine running Primavera P6 Professional, installed and opening before Day 1. Classroom builds and demos use P6 Professional. Think of P6 as the camera: it captures the logic, progress and path you need to explain.",
  },
  {
    q: "What is the format?",
    a: "Two live working days via Google Meet. Day 1 covers hands-on P6 and full CPM scheduling, from the baseline through updates and fragments. Day 2 covers delay analysis methods and the schedule evidence behind time and damages.",
  },
  {
    q: "How is this different from the Damage-for-Delay intensive?",
    a: "This intensive teaches the CPM and P6 work that establishes sequence, cause, critical-path impact and the supported delay period. That is the time foundation for extensions and delay damages. Damage-for-Delay covers the broader damages, money and claim-packaging work beyond the scheduling and analysis methods taught here.",
  },
  {
    q: "Is the session recorded?",
    a: "Yes. The live class is recorded, and the recording is included for attendees. After recording, the class will be packaged as an evergreen course on Learn.",
  },
  {
    q: "How many seats?",
    a: "Tuition is $1,997 USD per seat, one-time. There is no cap on enrollment. Each checkout registers one attendee with one attendee portal.",
  },
  {
    q: "When is the date?",
    a: "The class runs Friday, September 25 and Saturday, September 26, 2026, 10 a.m.–5 p.m. Eastern each day. Checkout is open.",
  },
  {
    q: "What are the refund terms?",
    a: "Refund and transfer terms are TBD.",
  },
];

export default function CpmIntensive() {
  return (
    <div className="cpm-page">
      <Helmet>
        <title>{CPM_SEO.title}</title>
        <meta name="theme-color" content="#F7F2EA" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500;700&display=swap" />
        <meta name="description" content={CPM_SEO.description} />
        <link rel="canonical" href={CPM_SEO.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CPM_SEO.canonical} />
        <meta property="og:title" content={CPM_SEO.title} />
        <meta property="og:description" content={CPM_SEO.description} />
        <meta property="og:image" content={CPM_SEO.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={CPM_SEO.title} />
        <meta name="twitter:description" content={CPM_SEO.description} />
        <meta name="twitter:image" content={CPM_SEO.image} />
      </Helmet>

      <div className="cpm-preview-note">Live online · September 25–26, 2026 · 10 a.m.–5 p.m. Eastern each day</div>

      <header className="cpm-nav">
        <a className="cpm-mark" href="/" aria-label="ALP Contractor Circle home">
          <span>ALP</span>
          <small>CPM Schedule Intensive (2-Day)</small>
        </a>
        <a className="cpm-nav-cta" href={CPM_CHECKOUT_URL}>Checkout</a>
      </header>

      <main>
        <section className="cpm-hero">
          <div>
            <p className="cpm-trial-badge">ALP CPM Schedule Intensive (2-Day) · With Marshall Wilkinson</p>
            <h1>
              Master the CPM.<br />
              Protect your time.<br />
              <em>Prove your delay.</em>
            </h1>
            <p className="cpm-hero-sub">
              <strong>Your most powerful tool for time and risk.</strong> Learn to build and update your own
              schedule in Primavera P6. See trouble coming, show what drives the critical path, and build
              the time record behind extensions and delay-damage calculations.
            </p>
            <p className="cpm-hero-trial">
              <strong>30 days of Primavera P6 Professional — free Oracle trial.</strong> Get the link on
              enrollment and build along in class, or use your existing company license.
            </p>
            <p className="cpm-soft">$1,997 USD per seat · Unlimited seats · Live on Google Meet · Recording included</p>
            <div className="cpm-hero-actions">
              <a href={CPM_CHECKOUT_URL} className="cpm-btn">Checkout →</a>
              <a href="#agenda" className="cpm-jump">See the two days ↓</a>
            </div>
          </div>

          {/* HERO VISUAL — real schedule export. Swap the src for another crop when needed. */}
          <figure className="cpm-board cpm-slot" data-asset-slot="ps338-hero-schedule">
            <div className="cpm-board-head">
              <span>Inside a real schedule</span>
              <span>PS338 / Update 01</span>
            </div>
            {/* REAL ASSET — PS338 Update #1 critical-path staircase (Marshall's job). */}
            <img
              src="/assets/cpm-intensive/hero-critical-path.png"
              alt="Critical path staircase from a real construction schedule update"
              loading="eager"
            />
            <div className="cpm-board-foot">
              <span className="cpm-board-key"><i />Activity</span>
              <span className="cpm-board-key is-critical"><i />Critical path</span>
            </div>
            <figcaption>PS338 · Update #1 — critical path on a live job</figcaption>
          </figure>
        </section>

        <dl className="cpm-strip" aria-label="Offer at a glance">
          {offerStrip.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <section className="cpm-promise">
          <p className="cpm-label">The point</p>
          <h2>
            The baseline is where <em>your protection begins.</em>
          </h2>
          <div className="cpm-promise-cols">
            <p>
              A baseline should explain the construction sequence, the logic between trades and the work that
              drives completion. Every update should show what actually happened, what remains and why the path changed.
            </p>
            <p>
              An update divorced from the baseline and the job record cannot explain that story. Learn to preserve
              the comparison, identify overlapping delays and show the owner which events affected the work — and how.
            </p>
          </div>
          <blockquote className="cpm-quote">
            Build the baseline. Keep the updates connected. Show the cause, the path and the time.
          </blockquote>
        </section>

        {/* REAL ASSET — wide schedule board crop. */}
        <section className="cpm-wide" aria-label="Schedule board">
          <figure data-asset-slot="schedule-board-wide">
            <img
              src="/assets/cpm-intensive/schedule-board.png"
              alt="Wide schedule board showing activity data, bars and milestones on a live job"
              loading="lazy"
            />
            <figcaption>
              <span>Real job, real file</span>
              Sequence, progress and critical path in one working record. Use it to spot risk ahead of the work,
              explain changes to the owner and support the time argument when delay occurs.
            </figcaption>
          </figure>
        </section>

        <section id="agenda" className="cpm-spine">
          <header className="cpm-head">
            <p className="cpm-label">Two-day outline</p>
            <h2>Build it in P6. Update it. Use it to prove time.</h2>
            <p>Friday, September 25 and Saturday, September 26, 2026, 10 a.m.–5 p.m. Eastern each day. Build your own working schedule as you learn.</p>
          </header>

          {agenda.map((day) => (
            <div key={day.day} className={`cpm-track${day.critical ? " is-critical" : ""}`}>
              <div className="cpm-track-id">
                <span>{day.day}</span>
                <h3>{day.title}</h3>
                <p className="cpm-session-time">{day.day === "Day 1" ? "Friday, September 25" : "Saturday, September 26"} · {CPM_SESSION_HOURS}</p>
                {/* REAL ASSET — schedule crop for this day. Swap for another export any time. */}
                <figure className="cpm-mini" data-asset-slot={`schedule-${day.day.toLowerCase().replace(" ", "-")}`}>
                  <img src={day.image} alt={day.imageAlt} loading="lazy" />
                  <figcaption>{day.imageCaption}</figcaption>
                </figure>
              </div>
              <ol className="cpm-bars">
                {day.beats.map((beat, index) => (
                  <li key={beat}>
                    <i>{String(index + 1).padStart(2, "0")}</i>
                    <span className="cpm-bar">
                      <b style={{ width: `${34 + ((index * 17) % 46)}px` }} />
                      <span>{beat}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>

        <section className="cpm-outcomes">
          <header className="cpm-head">
            <p className="cpm-label">What you own after</p>
            <h2>A schedule you can use to protect the job.</h2>
            <p>Learn the software and the scheduling discipline together, then use them to manage risk throughout the job.</p>
          </header>
          <div className="cpm-outcome-list">
            {outcomes.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cpm-packs">
          <header className="cpm-head">
            <p className="cpm-label">Leave-with packs</p>
            <h2>Working tools, not one giant PDF.</h2>
            <p>Files you can hand to a PM on Monday morning.</p>
          </header>
          <div className="cpm-pack-grid">
            {packs.map((pack) => (
              <div key={pack.day} className="cpm-pack">
                <p className="cpm-label">{pack.day}</p>
                <h3>{pack.title}</h3>
                <ul>
                  {pack.items.map((item, index) => (
                    <li key={item}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="cpm-soft" style={{ marginTop: "20px" }}>
            Use P6 to capture the work. Use the method to explain it.
          </p>
        </section>

        <section className="cpm-setup">
          <p className="cpm-label">Before Day 1</p>
          <h2 className="cpm-setup-title">Everyone builds their own schedule.</h2>
          <p className="cpm-setup-lede">
            Learn Primavera P6 Professional as you learn construction scheduling. You build the baseline, enter
            updates and work with delay fragments on your own machine. The Oracle 30-day free trial link is provided on enrollment.
          </p>
          <dl className="cpm-setup-grid">
            {setup.map((row) => (
              <div key={row.term}>
                <dt>{row.term}</dt>
                <dd>{row.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="cpm-soft">
            P6 is the camera. The schedule logic, progress record and analysis are the work. Have your trial or
            company license ready before Day 1.
          </p>
        </section>

        <section className="cpm-fit">
          <header className="cpm-head">
            <p className="cpm-label">Fit</p>
            <h2>Built for people who carry the job.</h2>
          </header>
          <div className="cpm-fit-pair">
            <div>
              <div>
                <p className="cpm-label">Take a seat if</p>
                <h3>You own the schedule and the money.</h3>
              </div>
              <ul>
                {fitFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div>
                <p className="cpm-label">Work through real conditions</p>
                <h3>Show the cause in the schedule.</h3>
              </div>
              <ul>
                {practice.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="cpm-impact-note">
            Follow the effect into trade stacking, lost productivity and the completion date. Use the CPM to
            organize the time analysis, supported by field and cost records, so responsibility is examined
            rather than assumed.
          </p>
        </section>

        <section id="checkout" className="cpm-tuition">
          <p className="cpm-label">Tuition</p>
          <h2>Two days. A method you keep.</h2>
          <p className="cpm-setup-lede">
            Live instruction with Marshall Wilkinson, classroom work in P6 Professional, and the recording afterward. Join us September 25–26, 2026; checkout is open.
          </p>
          <div className="cpm-tuition-grid">
            <article className="cpm-card">
              <span>ALP CPM Schedule Intensive (2-Day)</span>
              <div className="cpm-price">$1,997</div>
              <p>
                $1,997 USD per seat · unlimited seats · one checkout = one attendee portal. Two live days, Oracle’s 30-day P6 Professional trial link and recording included.
              </p>
              <a className="cpm-btn cpm-checkout-btn" href={CPM_CHECKOUT_URL} aria-describedby="cpm-checkout-note">
                Checkout — $1,997 →
              </a>
              <small id="cpm-checkout-note">One-time payment in USD. Live September 25–26, 2026. Each checkout registers one attendee; enrollment has no seat cap.</small>
            </article>
            <aside id="cpm-terms" className="cpm-terms" aria-label="Terms">
              <div><span>Dates</span><strong>September 25–26, 2026</strong></div>
              <div><span>Hours</span><strong>{CPM_SESSION_HOURS} each day</strong></div>
              <div><span>Timezone</span><strong>Eastern Time (New York)</strong></div>
              <div><span>Seats</span><strong>Unlimited</strong></div>
              <div><span>Software</span><strong>P6 Professional · 30-day trial</strong></div>
              <div><span>Recording</span><strong>Included for attendees</strong></div>
              <div><span>Refunds</span><strong>TBD</strong></div>
              <p>Educational and professional training. Not legal advice.</p>
            </aside>
          </div>
        </section>

        <section className="cpm-faq">
          <header className="cpm-head">
            <p className="cpm-label">Before you enroll</p>
            <h2>Direct answers.</h2>
          </header>
          <div>
            {faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}<span aria-hidden="true" /></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cpm-closing">
          <p className="cpm-label">Use the schedule to lead the job.</p>
          <h2>See the risk. Protect the time. Build the proof.</h2>
          <a href={CPM_CHECKOUT_URL} className="cpm-btn">Checkout →</a>
        </section>
      </main>

      <footer className="cpm-footer">
        <div><strong>ALP</strong><span>ALP CPM Schedule Intensive (2-Day)</span></div>
        <nav>
          <a href="#cpm-terms">Enrollment terms — pending</a>
          <a href="https://app.alpcontractorcircle.com/login">Member sign in</a>
          <a href="/">Contractor Circle</a>
        </nav>
        <p>Educational and professional training. Not legal advice. No guarantee of entitlement or recovery.</p>
      </footer>

      <a className="cpm-mobile-cta" href={CPM_CHECKOUT_URL}>
        <span>$1,997</span>
        <strong>Checkout →</strong>
      </a>
    </div>
  );
}
