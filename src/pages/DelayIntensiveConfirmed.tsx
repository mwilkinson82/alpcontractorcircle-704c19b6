import { Link } from "react-router-dom";
import "./DelayIntensive.css";

export default function DelayIntensiveConfirmed() {
  return (
    <main className="di-confirmed">
      <Link to="/" className="di-mark"><span>ALP</span><small>Professional Intensive</small></Link>
      <div>
        <p className="di-section-label">Your seat is reserved.</p>
        <h1>You are in the room.</h1>
        <p>A confirmation receipt is on its way from Stripe. ALP will send the Zoom access, preparation instructions and attendee-material schedule to the email used at checkout.</p>
        <dl>
          <div><dt>Dates</dt><dd>September 4–6, 2026</dd></div>
          <div><dt>First session</dt><dd>Friday at 1:00 p.m. ET</dd></div>
          <div><dt>Bring</dt><dd>Your questions, one delay event and the record you actually have</dd></div>
        </dl>
        <p className="di-confirmed-help">Need to change an attendee name? Email <a href="mailto:marshall@marshallwilkinson.com">marshall@marshallwilkinson.com</a>.</p>
      </div>
    </main>
  );
}
