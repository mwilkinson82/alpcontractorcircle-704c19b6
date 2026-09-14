import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./DelayIntensive.css";
import "./CpmIntensive.css";

export const CPM_SEO = {
  title: "CPM Schedule Intensive (2-Day) | ALP Contractor Circle",
  description:
    "Own the CPM. Build it. Update it. Prove time with it. A two-day live intensive for contractor CEOs and PMs — WBS, logic, calendars, updates, claims-ready as-built. Tuition $1,997. Not software school.",
  canonical: "https://alpcontractorcircle.com/cpm-intensive",
  image: "https://alpcontractorcircle.com/og-contractor-circle.png",
};

const outcomes = [
  {
    number: "01",
    title: "Build a schedule that holds up.",
    body: "Activity IDs, descriptions, durations and relationships that read clean and do not invent float.",
  },
  {
    number: "02",
    title: "Set a baseline the right way.",
    body: "Best practices for creating the baseline everything else gets measured against.",
  },
  {
    number: "03",
    title: "Run honest updates.",
    body: "Data date, actual progress, remaining duration — updates that reflect the job instead of protecting a story.",
  },
  {
    number: "04",
    title: "Work the delay side on Day 2.",
    body: "Delay analysis sits inside this intensive — you use the schedule you built to look at time, impact and exposure.",
  },
];

const packs = [
  {
    day: "Day 1 pack",
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
    items: [
      "Delay analysis method map",
      "Prove-delay checklist",
      "Analysis fragment worksheet",
      "Delay-claim narrative outline",
    ],
  },
];

const agenda = [
  {
    day: "Day 1",
    title: "CPM",
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

const faq = [
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
    q: "What should I prepare?",
    a: "Bring one live job you can talk about with names and numbers removed, and have P6 Professional installed and running before Day 1. You will work on real scope, not a textbook example.",
  },
  {
    q: "What software do I need?",
    a: "A Windows machine running Primavera P6 Professional. A company P6 license is fine. Otherwise start Oracle's 30-day P6 Professional free trial through Oracle Software Delivery Cloud before Day 1 — when you lock in, you get the trial link. Classroom demos use P6 Professional on-screen, not OverWatch. We do not provide Oracle Academy student licenses. This is still not software school: the software is the camera, the method is the work.",
  },
  {
    q: "What are the refund terms?",
    a: "Refund and transfer terms are TBD and will be posted before enrollment opens.",
  },
];

export default function CpmIntensive() {
  return (
    <div className="di-page cpm-page">
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

      <header className="di-nav">
        <a className="di-mark" href="/" aria-label="ALP Contractor Circle home">
          <span>ALP</span>
          <small>Professional Intensive</small>
        </a>
        <a className="di-nav-cta" href="#checkout">See tuition</a>
      </header>

      <main>
        <section className="di-hero">
          <div className="di-hero-copy">
            <p className="di-kicker">Date TBA · 2 days · $1,997 · unlimited seats</p>
            <h1>
              CPM Schedule<br />
              <em>Intensive (2-Day)</em>
            </h1>
            <p className="di-hero-lede">
              <strong>Own the CPM. Build it. Update it. Prove time with it.</strong> 2 days · $1,997 · unlimited seats · Not software school.
            </p>
            <p className="cpm-soft">Day 1 — CPM. Day 2 — Delay analysis. Live via Google Meet · recording included for attendees</p>
            <div className="di-hero-actions">
              <a href="#checkout" className="di-button di-button-primary">See tuition</a>
              <a href="#agenda" className="di-text-link">See the two days ↓</a>
            </div>
          </div>
          <aside className="di-brief" aria-label="Intensive brief">
            <span className="di-brief-label">ALP CPM Schedule Intensive (2-Day)</span>
            <div className="di-brief-rule" />
            <dl>
              <div><dt>Format</dt><dd>Two live days</dd></div>
              <div><dt>Date</dt><dd>TBA</dd></div>
              <div><dt>Room</dt><dd>Open enrollment · no seat cap</dd></div>
              <div><dt>Result</dt><dd>Working CPM ownership</dd></div>
            </dl>
            <p>Software is a camera. The brain is WBS, logic ties, calendars, updates and as-built. You leave owning the schedule instead of renting it.</p>
          </aside>
        </section>

        <section className="di-deadline" aria-label="Schedule status">
          <div className="di-deadline-copy">
            <span>Date</span>
            <strong>Date TBA</strong>
            <p>The two live days are being set. Enrollment opens once the date is locked and the payment link lands.</p>
          </div>
        </section>

        <section className="di-problem">
          <p className="di-section-label">Who this is for</p>
          <h2>Contractors who need to build and own the schedule — not sit through a ribbon tour.</h2>
          <div className="di-problem-grid">
            <p>Jobs slip. Change orders pile up. The office argues with the field about who lost the two weeks, and nobody can point at a schedule that proves it. The money leaves quietly.</p>
            <p>These are the two working days where you build the schedule yourself, update it honestly, and keep the record that protects the profit when time becomes a fight.</p>
          </div>
          <blockquote>“If you cannot build it and update it, you do not own it — and you cannot prove time with it.”</blockquote>
        </section>

        <section className="di-fit">
          <div>
            <p className="di-section-label">This is for you if</p>
            <ul>
              <li>You are a CEO, owner or PM who carries the job, the schedule and the money.</li>
              <li>Your schedules get built once for the owner and never updated again.</li>
              <li>You lose time arguments because the record does not back the field.</li>
              <li>You want your own people running updates instead of paying for every look.</li>
            </ul>
          </div>
          <div>
            <p className="di-section-label">This is not for you if</p>
            <ul>
              <li>You want P6 click-paths, ribbon tours and software certification.</li>
              <li>You want a pretty Gantt for the wall and nothing behind it.</li>
              <li>You want project-specific legal advice inside a group training.</li>
              <li>You want to watch slides instead of working on a live job.</li>
            </ul>
          </div>
        </section>

        <section className="di-gates">
          <header className="di-section-head">
            <p className="di-section-label">Walk out with</p>
            <h2>Four things you own by the end of the second day.</h2>
            <p>Every job, contract and calendar is different. The method is the same, and you run it yourself.</p>
          </header>
          <div className="di-gate-list">
            {outcomes.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="di-deliverables">
          <div className="di-deliverables-intro">
            <p className="di-section-label">Leave-with artifacts</p>
            <h2>Tools, not a giant PDF.</h2>
            <p>Working files you can hand to a PM on Monday morning.</p>
          </div>
          <div className="cpm-pack-grid">
            {packs.map((pack) => (
              <div key={pack.day} className="cpm-pack">
                <p className="di-section-label">{pack.day}</p>
                <ul>
                  {pack.items.map((item, index) => (
                    <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="cpm-soft">Not included — P6 / MSP click-path tourism.</p>
        </section>

        <section className="cpm-prereq" aria-label="What you need before Day 1">
          <p className="di-section-label">Before Day 1</p>
          <h2>You build in the software, on your own machine.</h2>
          <p className="cpm-prereq-line">
            <strong>When you lock in, you get the link to Oracle’s 30-day P6 Professional trial so you can build your own schedule in class.</strong>
          </p>
          <dl className="cpm-prereq-list">
            <div><dt>Machine</dt><dd>Windows machine that can run Primavera P6 Professional.</dd></div>
            <div><dt>License</dt><dd>Company P6 license works. Otherwise use Oracle’s 30-day P6 Professional free trial from Oracle Software Delivery Cloud — installed and running before Day 1.</dd></div>
            <div><dt>On screen</dt><dd>Classroom demos run in P6 Professional, not OverWatch.</dd></div>
            <div><dt>Job</dt><dd>One live job you can talk through with names and numbers removed.</dd></div>
          </dl>
          <p className="cpm-soft">We do not provide Oracle Academy student licenses. Software is the camera — you still need it installed to build in class.</p>
        </section>

        <section id="agenda" className="di-schedule">
          <header className="di-section-head">
            <p className="di-section-label">Two-day outline</p>
            <h2>Day 1 builds the CPM. Day 2 proves delay with it.</h2>
          </header>
          <div className="cpm-day-grid">
            {agenda.map((day) => (
              <article key={day.day} className="cpm-day">
                <div className="cpm-day-head">
                  <span>{day.day}</span>
                  <time>Times TBA</time>
                </div>
                <h3>{day.title}</h3>
                <ul>
                  {day.beats.map((beat) => (
                    <li key={beat}>{beat}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="di-schedule-note">Session times are posted once the two dates are confirmed.</p>
        </section>

        <section id="checkout" className="di-enroll">
          <header>
            <p className="di-section-label">Tuition</p>
            <h2>Tuition is set. Enrollment opens next.</h2>
            <p>The price below is final. Enrollment opens once the date and the payment link land.</p>
          </header>

          <div className="di-price-grid cpm-price-grid">
            <article>
              <div className="di-price-topline">
                <span>Individual seat</span>
              </div>
              <div className="di-price">
                <strong>$1,997</strong>
              </div>
              <p>One named attendee · two live days · recording included</p>
              <a className="di-button di-button-primary cpm-button-pending" href="#checkout" aria-disabled="true">
                Checkout opens when date + Payment Link land
              </a>
              <small>No payment is being collected on this page.</small>
            </article>
          </div>

          <aside className="di-terms-callout" aria-label="Terms">
            <div><span>Date</span><strong>TBA</strong></div>
            <div><span>Recording</span><strong>Attendees only</strong></div>
            <div><span>Refunds</span><strong>TBD</strong></div>
            <p>Educational and professional training. Not legal advice.</p>
          </aside>

          <p className="di-capacity">Open enrollment — no seat cap. Enrollment opens once the date and payment link are live.</p>
        </section>

        <section className="di-faq">
          <header className="di-section-head">
            <p className="di-section-label">Before you enroll</p>
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

        <section className="di-closing">
          <p className="di-section-label">Time is the money nobody itemizes.</p>
          <h2>Own the CPM or keep paying for the days you cannot prove.</h2>
          <a href="#checkout" className="di-button di-button-light">See tuition</a>
        </section>
      </main>

      <footer className="di-footer">
        <div><strong>ALP</strong><span>CPM Schedule Intensive (2-Day)</span></div>
        <nav>
          <Link to="/cancellation-policy">Cancellation policy</Link>
          <a href="https://app.alpcontractorcircle.com/login">Member sign in</a>
          <a href="/">Contractor Circle</a>
        </nav>
        <p>Educational and professional training. Not legal advice. No guarantee of entitlement or recovery.</p>
      </footer>

      <a className="di-mobile-cta" href="#checkout">
        <span>$1,997</span>
        <strong>See tuition</strong>
      </a>
    </div>
  );
}
