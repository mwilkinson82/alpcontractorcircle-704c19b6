import { useEffect } from "react";
import { ArrowDownToLine, ArrowRight, Check } from "lucide-react";
import "./ContractorEntrepreneurAudit.css";

const DOWNLOAD_URL = "/downloads/contractor-entrepreneur-operating-audit.pdf";

const disciplines = [
  "Entrepreneurial leadership",
  "Marketing and sales",
  "Estimating",
  "Contract strategy",
  "Project operations",
  "Finance and accounting",
  "People and recruiting",
  "Systems and controls",
];

const ContractorEntrepreneurAudit = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Contractor Entrepreneur Operating Audit | ALP Contractor Circle";

    const description =
      "Score the eight disciplines behind a profitable contracting company and identify the operating constraint to attack next.";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = meta?.content;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== undefined) meta.content = previousDescription;
    };
  }, []);

  return (
    <main className="audit-page">
      <header className="audit-nav">
        <a href="/" aria-label="ALP Contractor Circle home">
          <img
            src="/assets/brand/contractor-circle-horizontal.svg"
            alt="ALP Contractor Circle"
            className="audit-logo"
          />
        </a>
        <a className="audit-nav-link" href="/">
          Learn about Contractor Circle <ArrowRight size={15} />
        </a>
      </header>

      <section className="audit-hero">
        <div className="audit-hero-copy">
          <p className="audit-eyebrow">Free contractor operating audit</p>
          <h1>Score the company.<br />Not your confidence.</h1>
          <p className="audit-lede">
            Eight disciplines. One commercial operating system. Find the weakest function
            limiting your revenue, margin, cash, or capacity.
          </p>
          <div className="audit-actions">
            <a className="audit-primary" href={DOWNLOAD_URL} download>
              Download the free audit <ArrowDownToLine size={18} />
            </a>
            <span>Two pages · Built for contractor owners</span>
          </div>
        </div>

        <a className="audit-document" href={DOWNLOAD_URL} download aria-label="Download the Contractor Entrepreneur Operating Audit">
          <div className="audit-document-frame">
            <img
              src="/assets/resources/contractor-entrepreneur-operating-audit-preview.png"
              alt="Preview of the Contractor Entrepreneur Operating Audit"
            />
          </div>
          <span>Contractor Entrepreneur Operating Audit</span>
        </a>
      </section>

      <section className="audit-thesis">
        <p className="audit-section-number">01 / THE PREMISE</p>
        <div>
          <h2>You do not own a collection of projects.</h2>
          <p>
            You own a company that must win work, price risk, negotiate terms, build,
            bill, collect, recruit, and improve—at the same time. A breakdown in any one
            discipline can cap the entire business.
          </p>
        </div>
      </section>

      <section className="audit-disciplines">
        <div className="audit-disciplines-heading">
          <p className="audit-section-number">02 / THE EIGHT DISCIPLINES</p>
          <h2>One company.<br />Eight operating disciplines.</h2>
        </div>
        <ol>
          {disciplines.map((discipline, index) => (
            <li key={discipline}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{discipline}</strong>
              <Check size={17} />
            </li>
          ))}
        </ol>
      </section>

      <section className="audit-method">
        <p className="audit-section-number">03 / THE MOVE</p>
        <div className="audit-method-grid">
          <div>
            <strong>Score it honestly.</strong>
            <p>Rate each discipline against observable company behavior—not intention.</p>
          </div>
          <div>
            <strong>Find the constraint.</strong>
            <p>Your lowest score is where growth is most likely being taxed.</p>
          </div>
          <div>
            <strong>Make one 30-day move.</strong>
            <p>Assign one owner, one result, and one deadline. Then inspect the evidence.</p>
          </div>
        </div>
      </section>

      <section className="audit-final-cta">
        <div>
          <p className="audit-eyebrow">Stop managing around the weakness</p>
          <h2>Put the operating problem on paper.</h2>
        </div>
        <a className="audit-primary audit-primary-light" href={DOWNLOAD_URL} download>
          Download the audit <ArrowDownToLine size={18} />
        </a>
      </section>

      <footer className="audit-footer">
        <img src="/assets/brand/contractor-circle-horizontal.svg" alt="ALP Contractor Circle" />
        <div className="audit-footer-links">
          <a href="/">Learn more about Contractor Circle</a>
          <a href="https://marshallinbio.com" target="_blank" rel="noreferrer">
            Choose how to work with Marshall <ArrowRight size={14} />
          </a>
        </div>
      </footer>
    </main>
  );
};

export default ContractorEntrepreneurAudit;
