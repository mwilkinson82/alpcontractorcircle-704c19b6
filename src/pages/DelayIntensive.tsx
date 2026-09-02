import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  buildAttributedCheckoutUrl,
  funnelSessionId,
  trackIntensiveEvent,
  visitorId,
  type IntensiveAudience,
} from "@/lib/intensive-attribution";
import "./DelayIntensive.css";

const INDIVIDUAL_CHECKOUT = "https://book.stripe.com/00waEY7BTcXk3ZCaLweQM1b";
const COMPANY_CHECKOUT = "https://book.stripe.com/6oUaEY5tLbTg1Ru7zkeQM1c";
const LOCK_IN_DEADLINE = new Date("2026-08-31T03:59:59Z").getTime();
const ENROLLMENT_CLOSE = new Date("2026-09-03T16:00:00Z").getTime();

type Enrollment = "individual" | "company";

const publicPricing = {
  individual: { early: 2500, standard: 3500, earlyCode: "LOCKIN2500" },
  company: { early: 3500, standard: 5000, earlyCode: "LOCKIN3500" },
};

const memberPricing = {
  individual: {
    early: 2000,
    standard: 2800,
    earlyCode: "CIRCLE2000",
    standardCode: "CIRCLEMEMBERIND",
  },
  company: {
    early: 2800,
    standard: 4000,
    earlyCode: "CIRCLE2800",
    standardCode: "CIRCLEMEMBERCO",
  },
};

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
    date: "September 4",
    time: "1:00–5:00 p.m. ET",
    title: "Preserve",
    body: "Entitlement, notice, reservation of rights and the record that must exist before the dispute hardens.",
  },
  {
    day: "Saturday",
    date: "September 5",
    time: "9:00 a.m.–5:00 p.m. ET",
    title: "Prove + Price",
    body: "CPM causation, forensic methods, concurrency, mitigation and damages calculations. Includes a one-hour working break.",
  },
  {
    day: "Sunday",
    date: "September 6",
    time: "10:00 a.m.–1:00 p.m. ET",
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
  {
    q: "What are the transfer and refund terms?",
    a: "Tuition is refundable through August 28, 2026. After that date, it is non-refundable but may be transferred to another attendee in the same company before the intensive begins.",
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const remaining = (now: number) => {
  const distance = Math.max(0, LOCK_IN_DEADLINE - now);
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
};

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

export default function DelayIntensive() {
  const location = useLocation();
  const isMember = location.pathname.endsWith("/member");
  const audience: IntensiveAudience = isMember ? "contractor_circle" : "public";
  const [now, setNow] = useState(Date.now());
  // The inaugural cohort is sold out. No seats remain and checkout is closed.
  const SOLD_OUT = true;
  const isEarly = false;
  const enrollmentOpen = !SOLD_OUT && now < ENROLLMENT_CLOSE;
  const clock = remaining(now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    void trackIntensiveEvent("landing_view", audience);
  }, [audience]);

  useEffect(() => {
    const title = "Construction Delay & Damages Intensive | ALP";
    const description =
      "A live, advanced working intensive for contractors who need to preserve entitlement, prove delay, quantify damages and assemble a defensible claim.";
    const canonical = `https://alpcontractorcircle.com${isMember ? "/delay-intensive/member" : "/delay-intensive"}`;
    document.title = title;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:image"]', "property", "og:image", "https://alpcontractorcircle.com/og-delay-intensive.png");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", "https://alpcontractorcircle.com/og-delay-intensive.png");
    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
  }, [isMember]);

  const pricing = isMember ? memberPricing : publicPricing;
  const currentRateLabel = `${money(pricing.individual.early)} individual / ${money(pricing.company.early)} company`;
  const standardRateLabel = `${money(pricing.individual.standard)} individual / ${money(pricing.company.standard)} company`;

  const checkoutUrl = useMemo(
    () => (type: Enrollment) => {
      const base = type === "individual" ? INDIVIDUAL_CHECKOUT : COMPANY_CHECKOUT;
      if (!enrollmentOpen) return "#enrollment-closed";
      const plan = pricing[type];
      const code = (isEarly ? plan.earlyCode : "standardCode" in plan ? plan.standardCode : undefined) as string | undefined;
      return buildAttributedCheckoutUrl({
        base,
        promoCode: code,
        audience,
        ticketType: type,
        visitor: visitorId(),
        session: funnelSessionId(),
      });
    },
    [audience, enrollmentOpen, isEarly, pricing],
  );

  return (
    <div className="di-page">
      <header className="di-nav">
        <a className="di-mark" href="/" aria-label="ALP Contractor Circle home">
          <span>ALP</span>
          <small>Professional Intensive</small>
        </a>
        <a className="di-nav-cta" href="#enroll" aria-disabled="true">
          {enrollmentOpen ? "Reserve your seat" : "Sold out"}
        </a>
      </header>

      {isMember && (
        <div className="di-member-bar">
          <span>Contractor Circle member access</span>
          <strong>Your preferred pricing is active.</strong>
        </div>
      )}

      <main>
        <section className="di-hero">
          <div className="di-hero-copy">
            <p className="di-kicker">September 4–6, 2026 · Live via Zoom · 10 companies</p>
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
              <span className="di-button di-button-primary di-soldout" aria-disabled="true">Sold out</span>
              <a href="#curriculum" className="di-text-link">See the working sequence ↓</a>
            </div>
          </div>
          <aside className="di-brief" aria-label="Intensive event brief">
            <span className="di-brief-label">ALP Construction Delay & Damages Intensive</span>
            <div className="di-brief-rule" />
            <dl>
              <div><dt>Format</dt><dd>15 live hours</dd></div>
              <div><dt>Dates</dt><dd>Fri–Sun, Sept. 4–6</dd></div>
              <div><dt>Room</dt><dd>10 companies maximum</dd></div>
              <div><dt>Result</dt><dd>A working claim architecture</dd></div>
            </dl>
            <p>Not a webinar. Not a certification. A professional working room built around the decision path from first notice to assembled claim.</p>
          </aside>
        </section>

        <section className="di-deadline" aria-label="Pricing deadline">
          <div className="di-deadline-copy">
            <span>{isEarly ? "Current tuition expires" : "Standard tuition is now in effect"}</span>
            <strong>{isEarly ? "Sunday, August 30 at 11:59 p.m. ET" : "Enrollment closes September 3 at noon ET"}</strong>
            <p>{isEarly ? "Reserve now or pay the higher rate beginning August 31." : "The August 30 lock-in window has ended."}</p>
          </div>
          <div className="di-deadline-prices" aria-label="Current and standard tuition">
            <div className={isEarly ? "is-current" : ""}>
              <span>Through August 30</span>
              <b>{currentRateLabel}</b>
            </div>
            <div className={!isEarly ? "is-current" : ""}>
              <span>Beginning August 31</span>
              <b>{standardRateLabel}</b>
            </div>
          </div>
          {isEarly ? (
            <div className="di-clock" aria-label="Time remaining for lock-in pricing">
              {Object.entries(clock).map(([label, value]) => (
                <div key={label}><b>{String(value).padStart(2, "0")}</b><small>{label}</small></div>
              ))}
            </div>
          ) : (
            <p className="di-deadline-close">Enrollment closes September 3 at noon ET, or when the room is full.</p>
          )}
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

        <section id="enroll" className="di-enroll">
          <header>
            <p className="di-section-label">Inaugural live cohort</p>
            <h2>{enrollmentOpen ? "Choose your seat." : "Enrollment is closed."}</h2>
            <p>
              {isEarly
                ? `${isMember ? "Contractor Circle member tuition" : "Current tuition"} through August 30: ${currentRateLabel}. On August 31: ${standardRateLabel}.`
                : `${isMember ? "Contractor Circle member tuition" : "Standard tuition"}: ${standardRateLabel}.`}
            </p>
          </header>

          {enrollmentOpen ? (
            <>
              <figure className="di-pass-visual">
                <img src="/assets/delay-intensive/enrollment-passes.jpg" alt="Individual and company-pass credentials for the ALP Delay and Damages Intensive" loading="lazy" />
                <figcaption>Individual: one attendee · Company pass: two attendees from the same company</figcaption>
              </figure>
              <div className="di-price-grid">
                {(["individual", "company"] as Enrollment[]).map((type) => {
                  const plan = pricing[type];
                  const current = isEarly ? plan.early : plan.standard;
                  return (
                    <article key={type} className={type === "company" ? "di-price-featured" : ""}>
                      <div className="di-price-topline">
                        <span>{type === "individual" ? "Individual" : "Company pass"}</span>
                        {type === "company" && <b>Recommended</b>}
                      </div>
                      <div className="di-price">
                        {isEarly && <del>{money(plan.standard)}</del>}
                        <strong>{money(current)}</strong>
                      </div>
                      <p>{type === "individual" ? "One named participant" : "Two named participants from the same company"}</p>
                      <a
                        className="di-button di-button-primary"
                        href={checkoutUrl(type)}
                        onClick={() => void trackIntensiveEvent("checkout_started", audience, type)}
                      >Reserve {type === "individual" ? "my seat" : "the company pass"}</a>
                      <small>One-time tuition · Secure checkout through Stripe</small>
                    </article>
                  );
                })}
              </div>
              <aside className="di-terms-callout" aria-label="Key enrollment terms">
                <div><span>Refund cutoff</span><strong>August 28, 2026</strong></div>
                <div><span>After cutoff</span><strong>Non-refundable; transferable inside your company</strong></div>
                <div><span>Materials</span><strong>Internal company-use license</strong></div>
                <p>By enrolling, you agree to the <Link to="/delay-intensive/terms">complete Intensive Enrollment Terms</Link>, including the educational-purpose, live-claim and recording provisions.</p>
              </aside>
            </>
          ) : (
            <div id="enrollment-closed" className="di-closed">
              <p>The live room is no longer accepting online enrollment.</p>
              <a href="mailto:marshall@marshallwilkinson.com">Ask about the next cohort</a>
            </div>
          )}

          {!isMember && (
            <p className="di-member-note">Current Contractor Circle member? Your private enrollment link is inside the member room.</p>
          )}
          <p className="di-capacity">Limited to 10 companies. Enrollment closes September 3 at noon ET, or when all company positions are filled.</p>
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
          <a href="#enroll" className="di-button di-button-light">Reserve your seat</a>
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
      {enrollmentOpen && (
        <a className="di-mobile-cta" href="#enroll">
          <span>{isEarly ? `From ${money(pricing.individual.early)}` : `From ${money(pricing.individual.standard)}`}</span>
          <strong>Reserve your seat</strong>
        </a>
      )}
    </div>
  );
}
