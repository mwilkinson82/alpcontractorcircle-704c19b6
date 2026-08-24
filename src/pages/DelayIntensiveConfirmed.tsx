import { Link } from "react-router-dom";
import "./DelayIntensive.css";

export default function DelayIntensiveConfirmed() {
  return (
    <main className="di-confirmed">
      <Link to="/" className="di-mark"><span>ALP</span><small>Professional Intensive</small></Link>
      <section className="di-confirmed-hero">
        <p className="di-section-label">Payment received.</p>
        <h1>Your private attendee pass is being prepared.</h1>
        <p>Stripe will email your payment receipt. ALP will email your personal e-ticket and attendee-portal link to the address used at checkout. The portal is where you complete onboarding, submit a live claim candidate, and receive the timed class materials.</p>
        <dl>
          <div><dt>Dates</dt><dd>September 4–6, 2026</dd></div>
          <div><dt>Materials</dt><dd>Release September 3 at noon ET</dd></div>
          <div><dt>Next step</dt><dd>Open the ALP onboarding email</dd></div>
        </dl>
        <p className="di-confirmed-help">If the email does not arrive within five minutes, check spam or email <a href="mailto:marshall@marshallwilkinson.com">marshall@marshallwilkinson.com</a>.</p>
      </section>
    </main>
  );
}
