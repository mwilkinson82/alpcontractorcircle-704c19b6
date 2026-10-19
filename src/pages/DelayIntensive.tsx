import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  trackIntensiveEvent,
  type IntensiveAudience,
} from "@/lib/intensive-attribution";
import oliverTestimonial from "@/assets/oliver-fernandez-testimonial.mp4.asset.json";
import "./DelayIntensive.css";


const gates = [
  {
    number: "01",
    title: "Preserve the right.",
    body: "Find the clauses, deadlines, recipients, releases and notice traps before they erase a recovery you should have had.",
    output: "Contract & Notice Matrix",
  },
  {
    number: "02",
    title: "Prove the delay.",
    body: "Connect the event to the critical path, select a supportable method and expose the assumptions the other side will attack.",
    output: "Delay Method Selection Worksheet",
  },
  {
    number: "03",
    title: "Price the damage.",
    body: "Calculate the recoverable cost, identify the backup each category requires and know where a formula stops being defensible.",
    output: "Damages Calculation Workbooks",
  },
  {
    number: "04",
    title: "Build the claim.",
    body: "Assemble entitlement, causation, responsibility, damages and exhibits into a package built to survive scrutiny.",
    output: "Claim Assembly Index",
  },
];

const schedule = [
  {
    day: "Friday",
    date: "October 16",
    time: "1:00–5:00 PM ET",
    title: "Preserve",
    body: "Entitlement, notice, reservation of rights and the record that must exist before the dispute hardens.",
  },
  {
    day: "Saturday",
    date: "October 17",
    time: "9:00 AM–5:00 PM ET",
    title: "Prove + Price",
    body: "CPM causation, forensic methods, concurrency, mitigation and damages calculations. Includes a one-hour working break.",
  },
  {
    day: "Sunday",
    date: "October 18",
    time: "10:00 AM–1:00 PM ET",
    title: "Build",
    body: "Claim assembly lab, case architecture, red-team review and the path from first notice to submission.",
  },
];

const deliverables = [
  "Claims Recovery Playbook",
  "Contract and notice checklist",
  "Delay-event log and chronology template",
  "Notice and reservation-of-rights templates",
  "CPM schedule review checklist",
  "Delay-method selection matrix",
  "Critical-path analysis worksheets",
  "Damages-category matrix",
  "Editable calculation workbooks",
  "Claim narrative outline and exhibit index",
  "Opposing-party rebuttal checklist",
  "60-day access to the recordings",
  "One 90-minute implementation clinic",
];

const stories = [
  {
    number: "02",
    name: "Elijah Fuentes",
    role: "Project Engineer, McKenzie Construction",
    quote:
      "This weekend taught me the importance of communication and keeping track of the causes of the delays on site… Moving forward I plan on continuing to take pictures and being more detailed on my daily reports.",
  },
  {
    number: "03",
    name: "Jesus Sanchez",
    role: "Superintendent, McKenzie Construction",
    quote:
      "Your class was engaging from start to finish, and your level of knowledge is incredible. You completely opened my mind to taking detailed notes with critical information I never would have thought to include, which will fundamentally change how I approach my work on future jobs.",
  },
  {
    number: "04",
    name: "Simon Lopez",
    role: "Site Superintendent, McKenzie Construction",
    quote:
      "The course taught me to have a greater level of day-to-day awareness on a project, allowing me to recognize the situations and events that could potentially lead to a claim. More importantly, it helped me understand when a claim should be identified, documented, and introduced, rather than waiting until the impact has already occurred.",
  },
  {
    number: "05",
    name: "Michael Eargle",
    role: "M.E. Contracting",
    quote:
      "I really can't put into words how much this intensive helped me. Every point Marshall touched on feels like he's talking directly to me. Things that I've been dealing with and fighting with agencies on, and not really knowing if I am operating correctly, he laid out a perfect framework for how to operate in the public contracting space. It's changed how I'm doing things in the day-to-day of my business immediately.",
  },
  {
    number: "06",
    name: "Sean McDevitt",
    role: "Traditional Air Conditioning",
    quote:
      "The intensive exceeded all expectations and completely changed how I view our construction projects. I used to look at every job as a team effort between the contractor, CM, design team, and owner. But the reality is that we are not on a team at all, and we must protect ourselves at every turn. Marshall taught us what to look for in the contract, exactly what to say, and when to say it so that we can advocate for ourselves.",
  },
];

const faq = [
  {
    q: "Is this legal advice?",
    a: "No. This is advanced professional education. Contract language, governing law and project-specific facts must be reviewed by qualified counsel and the appropriate technical professionals.",
  },
  {
    q: "Do I need Primavera P6?",
    a: "No. Marshall will demonstrate schedule work in P6, and you will receive schedule exports, PDFs and Excel representations. The intensive teaches what to model, why it matters and how to defend the analysis—not software certification.",
  },
  {
    q: "Can I bring a live claim?",
    a: "Yes—after purchase, you may submit one live claim candidate from the confirmation page. Marshall will review the verified-purchaser submissions and choose which claim or claims, if any, will create the strongest group learning. Submission does not guarantee selection. Selected material may be anonymized or redacted and is discussed for group education, not as legal advice or an individual engagement.",
  },
  {
    q: "What does the company pass include?",
    a: "Two named attendees from the same company. It is designed for an owner or executive to attend with a project manager, scheduler or commercial lead.",
  },
];

export const INTENSIVE_SEO = {
  title: "Damage & Delay Intensive | ALP Contractor Circle — Oct 16–18 2026",
  description:
    "A live 3-day intensive for construction owners on delay, claims, and money — preserve entitlement, prove delay, quantify damages, assemble a defensible claim. October 16–18, 2026, live via Zoom.",
  canonical: "https://alpcontractorcircle.com/delay-intensive",
  image: "https://alpcontractorcircle.com/og-delay-intensive.png",
};

export default function DelayIntensive() {
  const location = useLocation();
  const isMember = location.pathname.endsWith("/member");
  const audience: IntensiveAudience = isMember ? "contractor_circle" : "public";

  useEffect(() => {
    void trackIntensiveEvent("landing_view", audience);
  }, [audience]);


  return (
    <div className="di-page">
      <Helmet>
        <title>{INTENSIVE_SEO.title}</title>
        <meta name="description" content={INTENSIVE_SEO.description} />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={INTENSIVE_SEO.canonical} />
        <meta property="og:title" content={INTENSIVE_SEO.title} />
        <meta property="og:description" content={INTENSIVE_SEO.description} />
        <meta property="og:image" content={INTENSIVE_SEO.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={INTENSIVE_SEO.title} />
        <meta name="twitter:description" content={INTENSIVE_SEO.description} />
        <meta name="twitter:image" content={INTENSIVE_SEO.image} />
      </Helmet>
      <header className="di-nav">
        <a className="di-mark" href="/" aria-label="ALP Contractor Circle home">
          <span>ALP</span>
          <small>Professional Intensive</small>
        </a>
      </header>

      <div className="di-member-bar" role="status">
        <span>This intensive isn't currently running. Join Contractor Circle, or check back for the next cohort.</span>
        <a href="/">Join Contractor Circle</a>
      </div>

      <main>
        <section className="di-hero">
          <div className="di-hero-copy">
            <p className="di-kicker">October 16–18, 2026 · Live via Zoom · 10 companies</p>
            <h1>
              Preserve the right.<br />
              Prove the delay.<br />
              Price the damage.<br />
              <em>Build the claim.</em>
            </h1>
            <p className="di-hero-lede">
              A live, advanced working intensive for contractors, project executives, project managers and schedulers who need to develop a defensible extension-of-time and delay-damages claim—not merely understand the vocabulary.
            </p>
            <div className="di-hero-actions">
              <a href="#curriculum" className="di-text-link">See the working sequence ↓</a>
            </div>
          </div>
          <aside className="di-brief" aria-label="Intensive event brief">
            <span className="di-brief-label">ALP Construction Delay & Damages Intensive</span>
            <div className="di-brief-rule" />
            <dl>
              <div><dt>Format</dt><dd>15 live hours</dd></div>
              <div><dt>Dates</dt><dd>Fri–Sun, Oct 16–18</dd></div>
              <div><dt>Room</dt><dd>10 companies maximum</dd></div>
              <div><dt>Result</dt><dd>A working claim architecture</dd></div>
            </dl>
            <p>Not a webinar. Not a certification. A professional working room built around the decision path from first notice to assembled claim.</p>
          </aside>
        </section>


        <section className="di-problem">
          <p className="di-section-label">The commercial reality</p>
          <h2>The delay does not become a claim because everyone knows it happened.</h2>
          <div className="di-problem-grid">
            <p>Rights disappear through missed notice. Time disappears inside a schedule nobody preserved. Costs get reduced because the backup does not connect the number to the event.</p>
            <p>The contractor ends up arguing fairness. The owner, lawyer or expert on the other side asks for the clause, the critical path, the contemporaneous record and the calculation.</p>
          </div>
          <blockquote>“A defensible claim is not written at the end. It is preserved, proved and priced while the project is still moving.”</blockquote>
        </section>

        <section id="curriculum" className="di-gates">
          <header className="di-section-head">
            <p className="di-section-label">The four gates</p>
            <h2>Paint-by-number for the process. Never canned for the result.</h2>
            <p>Every contract, jurisdiction, schedule and factual record is different. The playbook shows you how to determine what applies, what evidence is required and what must happen next.</p>
          </header>
          <div className="di-gate-list">
            {gates.map((gate) => (
              <article key={gate.number}>
                <span>{gate.number}</span>
                <div>
                  <h3>{gate.title}</h3>
                  <p>{gate.body}</p>
                </div>
                <strong>{gate.output}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="di-authority">
          <figure className="di-authority-visual">
            <img src="/assets/delay-intensive/marshall-conference.jpg" alt="Marshall Wilkinson teaching contractors from a conference stage" loading="lazy" />
            <figcaption>Marshall Wilkinson · Contractor operator, advisor and instructor</figcaption>
          </figure>
          <div className="di-authority-content">
            <div>
              <p className="di-section-label">Led by Marshall Wilkinson</p>
              <h2>Built from the table where the money, schedule and record have to survive.</h2>
            </div>
            <div className="di-authority-copy">
              <p>Marshall brings direct experience navigating a $30 million delay claim against the City of New York, alongside years spent inside contractor operations, commercial risk, CPM controls and claim development.</p>
              <p>This is not a lawyer reading clauses or a scheduler teaching software buttons. It is the integrated commercial sequence: entitlement, documentation, time causation, cost recovery and claim assembly.</p>
            </div>
          </div>
        </section>

        <section className="di-live-claim">
          <div className="di-live-claim-head">
            <p className="di-section-label">Available after purchase</p>
            <h2>Your claim can enter the working room. Marshall decides which one gets dissected.</h2>
            <p>Every paid attendee may submit one live claim candidate. The point is not to turn the weekend into private consulting. It is to choose the strongest real-world record for a disciplined, educational dissection the whole room can learn from.</p>
          </div>
          <ol>
            <li><span>01</span><strong>Enroll</strong><p>Complete checkout and use the purchaser-only form on the confirmation page.</p></li>
            <li><span>02</span><strong>Submit the outline</strong><p>Describe the event, stage, amount or time at issue, and the records that exist. No confidential files are uploaded publicly.</p></li>
            <li><span>03</span><strong>Marshall selects</strong><p>ALP verifies the purchase. Marshall alone chooses which claim or claims, if any, are dissected live and what must be redacted.</p></li>
          </ol>
          <p className="di-live-claim-terms"><strong>Important:</strong> submission does not guarantee selection or individual review. A selected dissection is group education—not legal advice, expert certification or a project-specific consulting engagement.</p>
        </section>

        <section className="di-schedule">
          <header className="di-section-head">
            <p className="di-section-label">The live room</p>
            <h2>One weekend. The complete claim-development sequence.</h2>
          </header>
          <div className="di-schedule-grid">
            {schedule.map((session) => (
              <article key={session.day}>
                <span>{session.day}</span>
                <strong>{session.date}</strong>
                <time>{session.time}</time>
                <h3>{session.title}</h3>
                <p>{session.body}</p>
              </article>
            ))}
          </div>
          <p className="di-schedule-note">This weekend is clear of Contractor Circle programming. Friday’s ALP Hardcore Power Hour concludes four hours before the intensive begins.</p>
        </section>

        <section className="di-deliverables">
          <div className="di-deliverables-intro">
            <p className="di-section-label">You leave with the working system</p>
            <h2>Not one giant PDF.</h2>
            <p>Instruction belongs in the playbook. Notices and narratives belong in editable Word files. Calculations belong in Excel. Schedule analysis belongs in schedule files, exports and exhibits.</p>
            <figure className="di-playbook-visual">
              <img src="/assets/delay-intensive/claims-playbook.jpg" alt="Claims Recovery Playbook with notice, delay-analysis, damages and claim-index tools" loading="lazy" />
              <figcaption>The system is delivered in the file type where the work actually belongs.</figcaption>
            </figure>
          </div>
          <ul>
            {deliverables.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
            ))}
          </ul>
        </section>


        <section id="stories" className="di-stories">
          <header className="di-section-head">
            <p className="di-section-label">From the field</p>
            <h2>What attendees have to say.</h2>
            <p>Sept 4–6 McKenzie Construction attendees — notes from the room, not marketing copy.</p>
          </header>
          <div className="di-stories-grid">
            <figure className="di-story-video">
              <span>01</span>
              <video
                controls
                playsInline
                preload="metadata"
                poster="/assets/delay-intensive/oliver-fernandez-poster.jpg"
                src={oliverTestimonial.url}
              />
              <figcaption>Oliver Fernandez — McKenzie Construction</figcaption>
            </figure>
            {stories.map((story) => (
              <figure key={story.name} className="di-story">
                <span>{story.number}</span>
                <blockquote>{story.quote}</blockquote>
                <figcaption>{story.name}<em>{story.role}</em></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="di-fit">

          <div>
            <p className="di-section-label">This is for you if</p>
            <ul>
              <li>You are carrying delay without a disciplined claim-development path.</li>
              <li>Your team has notices, schedules and cost backup—but they live in separate worlds.</li>
              <li>You need to know what an owner, counsel or expert will attack before submission.</li>
              <li>You want a reusable company playbook, not dependence on one person’s memory.</li>
            </ul>
          </div>
          <div>
            <p className="di-section-label">This is not for you if</p>
            <ul>
              <li>You want project-specific legal advice inside a group training.</li>
              <li>You want Marshall to build or certify your live claim as part of tuition.</li>
              <li>You are looking for Primavera certification or entry-level CPM instruction.</li>
              <li>You want a passive weekend of slides without working through the process.</li>
            </ul>
          </div>
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
          <p className="di-section-label">The claim is already being built.</p>
          <h2>The question is whether your company is building it deliberately.</h2>
          <a href="/" className="di-button di-button-light">Join Contractor Circle</a>
        </section>
      </main>

      <footer className="di-footer">
        <div><strong>ALP</strong><span>Construction Delay & Damages Intensive</span></div>
        <nav>
          <Link to="/delay-intensive/terms">Intensive terms</Link>
          <a href="https://app.alpcontractorcircle.com/login">Member sign in</a>
          <a href="/">Contractor Circle</a>
        </nav>
        <p>Educational and professional training. Not legal advice. No guarantee of entitlement or recovery.</p>
      </footer>
    </div>
  );
}
