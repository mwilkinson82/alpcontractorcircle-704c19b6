import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./CpmIntensive.css";

export const CPM_SEO = {
  title: "CPM Schedule Intensive (2-Day) | ALP Contractor Circle",
  description:
    "Two live days for contractor CEOs and PMs. Day 1 build the CPM, Day 2 delay analysis. Includes 30 days of Primavera P6 Professional free from Oracle so you build your own schedule in class. Tuition $1,997. Not software school.",
  canonical: "https://alpcontractorcircle.com/cpm-intensive",
  image: "https://alpcontractorcircle.com/og-contractor-circle.png",
};

const offerStrip = [
  { label: "Format", value: "2 live days" },
  { label: "Tuition", value: "$1,997" },
  { label: "Seats", value: "No cap" },
  { label: "Date", value: "TBA" },
  { label: "Days", value: "Day 1 CPM · Day 2 Delay analysis" },
];

const agenda = [
  {
    day: "Day 1",
    title: "CPM",
    critical: false,
    image: "/assets/cpm-intensive/schedule-gantt.png",
    imageAlt: "Gantt bars and activity data from a real construction schedule",
    imageCaption: "PS338 · baseline bars",
    beats: [
      "What CPM is",
      "IDs",
      "Descriptions",
      "Durations",
      "Relationships / logic",
      "Critical path",
      "Baseline",
      "Updates",
      "Concurrent-delay discipline",
      "Intro fragments / COs",
      "Reports",
      "Narrative",
      "P6 as camera",
    ],
  },
  {
    day: "Day 2",
    title: "Delay analysis",
    critical: true,
    image: "/assets/cpm-intensive/tallman-longest-path.png",
    imageAlt: "Tallman Island longest-path schedule with critical activities in red",
    imageCaption: "Tallman Island · longest path",
    beats: [
      "Plan vs as-built",
      "Collapsed as-built",
      "Windows",
      "Prove delay",
      "Fragments in analysis",
      "Delay-claim narratives",
    ],
  },
];

const outcomes = [
  {
    number: "01",
    title: "Build a schedule that holds up.",
    body: "Activity IDs, descriptions, durations and logic ties that read clean and do not invent float.",
  },
  {
    number: "02",
    title: "Set a baseline the right way.",
    body: "The baseline everything else gets measured against, built so it survives the argument later.",
  },
  {
    number: "03",
    title: "Run honest updates.",
    body: "Data date, actual progress, remaining duration — updates that reflect the job instead of protecting a story.",
  },
  {
    number: "04",
    title: "Prove time on Day 2.",
    body: "Plan vs as-built, collapsed as-built, windows and narratives — delay analysis run on the schedule you built.",
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
  { term: "On screen", detail: "Classroom demos run in P6 Professional, not OverWatch." },
  { term: "Bring", detail: "One live job you can talk through with names and numbers removed." },
];

const fitFor = [
  "You are a CEO, owner or PM who carries the job, the schedule and the money.",
  "Your schedules get built once for the owner and never updated again.",
  "You lose time arguments because the record does not back the field.",
  "You want your own people running updates instead of paying for every look.",
];

const fitNot = [
  "You want P6 click-paths, ribbon tours and software certification.",
  "You want a pretty Gantt for the wall and nothing behind it.",
  "You want project-specific legal advice inside a group training.",
  "You want to watch slides instead of working on a live job.",
];

const faq = [
  {
    q: "What does the P6 trial include?",
    a: "When you lock in, you get the link to Oracle's 30-day free trial of Primavera P6 Professional so you can build your own schedule in class. A company P6 license works just as well. We do not provide Oracle Academy student licenses.",
  },
  {
    q: "What software and machine do I need?",
    a: "A Windows machine running Primavera P6 Professional, installed and opening before Day 1. Classroom demos are shown in P6 Professional, not OverWatch. This is still not software school — the software is the camera, the method is the work.",
  },
  {
    q: "What is the format?",
    a: "Two live days via Google Meet. Working session, not a lecture — Day 1 on CPM, Day 2 on delay analysis.",
  },
  {
    q: "How is this different from the Damage-for-Delay intensive?",
    a: "Damage-for-Delay is the broader damages and money intensive — LDs and claim packaging beyond schedule method. Day 2 of this intensive is the schedule and analysis method block: how to do delay analysis with the CPM (plan vs as-built, collapsed as-built, windows, prove delay, fragments in analysis, delay-claim narratives).",
  },
  {
    q: "Is the session recorded?",
    a: "Yes. The recording goes to attendees only. It is not added to a Contractor Circle library or resold.",
  },
  {
    q: "How many seats?",
    a: "Enrollment is open — there is no seat cap.",
  },
  {
    q: "When is the date?",
    a: "The two live days are being set. Enrollment opens once the date is locked and the payment link lands.",
  },
  {
    q: "What are the refund terms?",
    a: "Refund and transfer terms are TBD and will be posted before enrollment opens.",
  },
];

export default function CpmIntensive() {
  return (
    <div className="cpm-page">
      <Helmet>
        <title>{CPM_SEO.title}</title>
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

      <header className="cpm-nav">
        <a className="cpm-mark" href="/" aria-label="ALP Contractor Circle home">
          <span>ALP</span>
          <small>CPM Schedule Intensive</small>
        </a>
        <a className="cpm-nav-cta" href="#checkout">See tuition</a>
      </header>

      <main>
        <section className="cpm-hero">
          <div>
            <p className="cpm-trial-badge">
              <b>Included</b>
              <span>30 days of Primavera P6 Professional — free Oracle trial</span>
            </p>
            <h1>
              Own the CPM.<br />
              Build it in P6.<br />
              <em>Prove time with it.</em>
            </h1>
            <p className="cpm-hero-sub">
              <strong>Two live days.</strong> You build your own schedule in class on a free 30-day P6 Professional
              trial — the link comes when you lock in. Day 1 builds the CPM. Day 2 proves delay with it.
            </p>
            <p className="cpm-soft">Not software school · Live via Google Meet · Recording for attendees</p>
            <div className="cpm-hero-actions">
              <a href="#checkout" className="cpm-btn">See tuition</a>
              <a href="#agenda" className="cpm-jump">See the two days ↓</a>
            </div>
          </div>

          {/* HERO VISUAL — real schedule export. Swap the src for another crop when needed. */}
          <figure className="cpm-board cpm-slot" data-asset-slot="tallman-hero-schedule">
            <div className="cpm-board-head">
              <span>Schedule board</span>
              <time>Data date TBA</time>
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
            Own the CPM. Build it. Update it. <em>Prove time with it.</em>
          </h2>
          <div className="cpm-promise-cols">
            <p>
              Jobs slip. Change orders pile up. The office argues with the field about who lost the two weeks, and
              nobody can point at a schedule that proves it. The money leaves quietly.
            </p>
            <p>
              These are the two working days where you build the schedule yourself, update it honestly, and then use it
              to show where the time went and what it cost.
            </p>
          </div>
          <blockquote className="cpm-quote">
            “If you cannot build it and update it, you do not own it — and you cannot prove time with it.”
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
              This is the record a time argument gets decided on — activity data on the left, bars on the
              right, the path that drives the end date running through it.
            </figcaption>
          </figure>
        </section>

        <section id="agenda" className="cpm-spine">
          <header className="cpm-head">
            <p className="cpm-label">Two-day outline</p>
            <h2>Day 1 builds the CPM. Day 2 proves delay with it.</h2>
            <p>Beat by beat, on your own job, in your own file. Session times post once the two dates are confirmed.</p>
          </header>

          {agenda.map((day) => (
            <div key={day.day} className={`cpm-track${day.critical ? " is-critical" : ""}`}>
              <div className="cpm-track-id">
                <span>{day.day}</span>
                <h3>{day.title}</h3>
                <time>Times TBA</time>
                {/* ASSET SWAP SLOT — Tallman Island export for this day drops in here. */}
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
            <h2>Four things that are yours when the second day ends.</h2>
            <p>Every job, contract and calendar is different. The method is the same, and you run it yourself.</p>
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
            Not included — P6 / MSP click-path tourism.
          </p>
        </section>

        <section className="cpm-setup">
          <p className="cpm-label">Before Day 1</p>
          <h2 className="cpm-setup-title">You build in the software, on your own machine.</h2>
          <p className="cpm-setup-lede">
            When you lock in, you get the link to Oracle’s 30-day P6 Professional trial so you can build your own
            schedule in class.
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
            We do not provide Oracle Academy student licenses. Software is the camera — you still need it installed to
            build in class.
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
                <p className="cpm-label cpm-label-mute">Skip it if</p>
                <h3>You want a software tour.</h3>
              </div>
              <ul className="cpm-not">
                {fitNot.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="checkout" className="cpm-tuition">
          <p className="cpm-label">Tuition</p>
          <h2>Tuition is set. Enrollment opens next.</h2>
          <p className="cpm-setup-lede">
            The price below is final. Enrollment opens once the date and the payment link land.
          </p>
          <div className="cpm-tuition-grid">
            <article className="cpm-card">
              <span>Individual seat</span>
              <div className="cpm-price">$1,997</div>
              <p>
                One named attendee · two live days · 30-day P6 Professional trial link · recording included
              </p>
              <a className="cpm-btn cpm-btn-pending" href="#checkout" aria-disabled="true">
                Checkout opens when date + Payment Link land
              </a>
              <small>No payment is being collected on this page.</small>
            </article>
            <aside className="cpm-terms" aria-label="Terms">
              <div><span>Date</span><strong>TBA</strong></div>
              <div><span>Seats</span><strong>No cap</strong></div>
              <div><span>Software</span><strong>P6 Professional · 30-day trial</strong></div>
              <div><span>Recording</span><strong>Attendees only</strong></div>
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
                <summary>{item.q}<span>+</span></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cpm-closing">
          <p className="cpm-label">Time is the money nobody itemizes.</p>
          <h2>Own the CPM or keep paying for the days you cannot prove.</h2>
          <a href="#checkout" className="cpm-btn">See tuition</a>
        </section>
      </main>

      <footer className="cpm-footer">
        <div><strong>ALP</strong><span>CPM Schedule Intensive (2-Day)</span></div>
        <nav>
          <Link to="/cancellation-policy">Cancellation policy</Link>
          <a href="https://app.alpcontractorcircle.com/login">Member sign in</a>
          <a href="/">Contractor Circle</a>
        </nav>
        <p>Educational and professional training. Not legal advice. No guarantee of entitlement or recovery.</p>
      </footer>

      <a className="cpm-mobile-cta" href="#checkout">
        <span>$1,997</span>
        <strong>See tuition</strong>
      </a>
    </div>
  );
}
