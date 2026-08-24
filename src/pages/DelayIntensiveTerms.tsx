import { Link } from "react-router-dom";
import "./DelayIntensive.css";

export default function DelayIntensiveTerms() {
  return (
    <main className="di-terms">
      <Link to="/delay-intensive" className="di-mark"><span>ALP</span><small>Professional Intensive</small></Link>
      <article>
        <p className="di-section-label">Enrollment terms</p>
        <h1>ALP Construction Delay & Damages Intensive</h1>
        <p className="di-terms-date">Effective August 23, 2026</p>
        <h2>Program</h2>
        <p>The intensive is scheduled for September 4–6, 2026 and will be delivered live online. ALP may make reasonable adjustments to session order, instructors, examples or delivery mechanics without materially reducing the program.</p>
        <h2>Tuition and attendees</h2>
        <p>Individual tuition covers one named attendee. A company pass covers two named attendees from the same company. Access may not be resold, shared outside the purchasing company or used to distribute recordings or materials.</p>
        <h2>Refunds and transfers</h2>
        <p>Tuition is refundable through August 28, 2026. After that date, tuition is non-refundable. Before the intensive begins, a registration may be transferred to another attendee within the same company by written request. If ALP cancels the intensive and does not offer a reasonable replacement date, tuition paid will be refunded.</p>
        <h2>Recordings and materials</h2>
        <p>Registered attendees receive 60-day access to program recordings and a permanent internal-use license to the distributed playbook and templates. Materials may be adapted for the purchasing company’s internal operations. They may not be sold, published, sublicensed or distributed outside that company.</p>
        <h2>Educational purpose</h2>
        <p>The intensive provides educational and professional training. It is not legal advice, does not create an attorney-client relationship and does not guarantee entitlement, recovery or a particular project outcome. Contract language, governing law and project-specific facts must be reviewed by qualified counsel and appropriate technical professionals.</p>
        <h2>Project-specific work</h2>
        <p>Tuition includes group instruction and group questions. It does not include individual review, certification or preparation of an attendee’s contract notices, schedule analysis, damages calculation or claim. Project-specific services require a separate written engagement.</p>
        <h2>Technology and conduct</h2>
        <p>Attendees are responsible for a reliable internet connection and appropriate equipment. ALP may remove a participant who disrupts the program, violates confidentiality or shares access without permission.</p>
        <p className="di-terms-back"><Link to="/delay-intensive">← Return to the intensive</Link></p>
      </article>
    </main>
  );
}
