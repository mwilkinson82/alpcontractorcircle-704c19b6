import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./DelayIntensive.css";
import "./CpmIntensive.css";

export const CPM_SEO = {
  title: "CPM Schedule Intensive | ALP Contractor Circle",
  description:
    "Own the CPM. Build it. Update it. Prove time with it. One-day live intensive for contractor CEOs and PMs — WBS, logic, calendars, updates, claims-ready as-built. Not software school.",
  canonical: "https://alpcontractorcircle.com/cpm-intensive",
  image: "https://alpcontractorcircle.com/og-contractor-circle.png",
};

const outcomes = [
  {
    number: "01",
    title: "Build and defend a simple CPM.",
    body: "WBS to logic to calendars to a critical path you can explain out loud without a consultant in the room.",
  },
  {
    number: "02",
    title: "Run an honest update.",
    body: "Data date, actual progress, remaining duration. No padding, no lying to yourself, no schedule that only works on paper.",
  },
  {
    number: "03",
    title: "Keep a claims-ready pack.",
    body: "Baseline, updates, constraint and look-ahead log, notice trail — built while the job is moving, not after the fight starts.",
  },
  {
    number: "04",
    title: "Know a Gantt from a proof machine.",
    body: "One looks good in a meeting. The other survives an LD assessment or an extension-of-time fight. You will know which you are holding.",
  },
];

const artifacts = [
  "Schedule Doctrine card",
  "WBS template",
  "Logic rules sheet",
  "Calendar checklist",
  "Update runbook",
  "Constraint / look-ahead log",
  "As-built / claims pack outline",
];

const agenda = [
  { number: "01", title: "Control room why", body: "Why the schedule is a money instrument, not a wall decoration." },
  { number: "02", title: "WBS", body: "Break the job into work you can price, assign and measure." },
  { number: "03", title: "Logic ties", body: "Predecessors, successors and the ties that decide who owns the delay." },
  { number: "04", title: "Calendars", body: "Work days, shutdowns, weather and shift reality." },
  { number: "05", title: "Baseline / float / critical path", body: "What gets frozen, who owns float, where the path actually runs." },
  { number: "06", title: "Weekly updates", body: "The update loop a PM can run every week without a scheduler." },
  { number: "07", title: "Constraint log + look-ahead", body: "Track what is blocking the field and put it on the record." },
  { number: "08", title: "Claims-ready as-built", body: "Turn updates into the contemporaneous record that proves time." },
  { number: "09", title: "Install Monday", body: "What you change on your jobs the next working day." },
];

const faq = [
  {
    q: "What is the format?",
    a: "One live day via Google Meet. Working session, not a lecture — you build, update and defend a schedule during the day.",
  },
  {
    q: "Is the session recorded?",
    a: "Yes. The recording goes to attendees only. It is not added to a Contractor Circle library or resold.",
  },
  {
    q: "How many seats?",
    a: "Seats are limited so every attendee gets time on their own schedule.",
  },
  {
    q: "What should I prepare?",
    a: "Bring one live job you can talk about with names and numbers removed. You will work on real scope, not a textbook example.",
  },
  {
    q: "Do I need P6 or MS Project?",
    a: "No. This is not software school. Software is a camera. The brain is WBS, logic ties, calendars, updates and as-built.",
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
            <p className="di-kicker">Date TBA · Live via Google Meet · Seats limited</p>
            <h1>
              CPM Schedule<br />
              <em>Intensive</em>
            </h1>
            <p className="di-hero-lede">
              <strong>Own the CPM. Build it. Update it. Prove time with it.</strong> One-day intensive for contractor CEOs and PMs — WBS, logic, calendars, updates, claims-ready as-built. Not software school.
            </p>
            <p className="cpm-soft">Live via Google Meet · recording included for attendees</p>
            <div className="di-hero-actions">
              <a href="#checkout" className="di-button di-button-primary">See tuition</a>
              <a href="#agenda" className="di-text-link">See the working day ↓</a>
            </div>
          </div>
          <aside className="di-brief" aria-label="Intensive brief">
            <span className="di-brief-label">ALP CPM Schedule Intensive</span>
            <div className="di-brief-rule" />
            <dl>
              <div><dt>Format</dt><dd>One live day</dd></div>
              <div><dt>Date</dt><dd>TBA</dd></div>
              <div><dt>Room</dt><dd>Seats limited</dd></div>
              <div><dt>Result</dt><dd>Working CPM ownership</dd></div>
            </dl>
            <p>Software is a camera. The brain is WBS, logic ties, calendars, updates and as-built. You leave owning the schedule instead of renting it.</p>
          </aside>
        </section>

        <section className="di-deadline" aria-label="Schedule status">
          <div className="di-deadline-copy">
            <span>Date</span>
            <strong>Date TBA</strong>
            <p>The live day is being set. Tuition and enrollment open once the date is locked.</p>
          </div>
        </section>

        <section className="di-problem">
          <p className="di-section-label">Who this is for</p>
          <h2>Contractors who need to build and own the schedule — not sit through a ribbon tour.</h2>
          <div className="di-problem-grid">
            <p>Jobs slip. Change orders pile up. The office argues with the field about who lost the two weeks, and nobody can point at a schedule that proves it. The money leaves quietly.</p>
            <p>This is the working day where you build the schedule yourself, update it honestly, and keep the record that protects the profit when time becomes a fight.</p>
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
            <h2>Four things you own by the end of the day.</h2>
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
          <ul>
            {artifacts.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
            ))}
          </ul>
        </section>

        <section id="agenda" className="di-schedule">
          <header className="di-section-head">
            <p className="di-section-label">Agenda TBA — draft slots</p>
            <h2>Nine beats. Times still draft.</h2>
          </header>
          <div className="di-schedule-grid cpm-agenda-grid">
            {agenda.map((slot) => (
              <article key={slot.number}>
                <span>Slot {slot.number}</span>
                <time>Time TBA</time>
                <h3>{slot.title}</h3>
                <p>{slot.body}</p>
              </article>
            ))}
          </div>
          <p className="di-schedule-note">Beat order is locked. Session times are draft until the date is confirmed.</p>
        </section>

        <section id="checkout" className="di-enroll">
          <header>
            <p className="di-section-label">Tuition <span className="cpm-draft">Draft</span></p>
            <h2>Draft pricing. Not yet open.</h2>
            <p>Pricing below is a draft and may change before enrollment opens. No checkout is live yet.</p>
          </header>

          <div className="di-price-grid cpm-price-grid">
            <article className="cpm-price-draft">
              <div className="di-price-topline">
                <span>Individual seat</span>
                <b className="cpm-draft">Draft</b>
              </div>
              <div className="di-price">
                <del>$1,497</del>
                <strong>$997</strong>
              </div>
              <p>One named attendee · early rate vs list, both draft</p>
              <a className="di-button di-button-primary cpm-button-pending" href="#checkout" aria-disabled="true">
                Checkout opens when Marshall greens price
              </a>
              <small>No payment is being collected on this page.</small>
            </article>
          </div>

          <aside className="di-terms-callout" aria-label="Draft terms">
            <div><span>Date</span><strong>TBA</strong></div>
            <div><span>Recording</span><strong>Attendees only</strong></div>
            <div><span>Refunds</span><strong>TBD</strong></div>
            <p>Educational and professional training. Not legal advice.</p>
          </aside>

          <p className="di-capacity">Seats limited. Enrollment opens once the date and price are confirmed.</p>
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
        <div><strong>ALP</strong><span>CPM Schedule Intensive</span></div>
        <nav>
          <Link to="/cancellation-policy">Cancellation policy</Link>
          <a href="https://app.alpcontractorcircle.com/login">Member sign in</a>
          <a href="/">Contractor Circle</a>
        </nav>
        <p>Educational and professional training. Not legal advice. No guarantee of entitlement or recovery.</p>
      </footer>

      <a className="di-mobile-cta" href="#checkout">
        <span>Draft $997</span>
        <strong>See tuition</strong>
      </a>
    </div>
  );
}
