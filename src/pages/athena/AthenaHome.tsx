import { Link } from "react-router-dom";
import { AthenaLayout, List, R } from "./AthenaLayout";

const AthenaHome = () => (
  <AthenaLayout title="Athena by ALP — Project controls for subcontractors" description="Athena by ALP — project controls for subcontractors. Athena drafts; you send.">
    <h1>Athena by ALP — project controls for subcontractors.</h1>
    <hr className="athena-accent" />
    <p>I built Athena for the office: owners, PMs, contracts, estimating and accounting. It reads your contract, tracks your notice windows and open items, and drafts what you need to send. Athena drafts; you send.</p>
    <Link to="/athena/support" className="athena-button">Get support</Link>

    <h2>What Athena does</h2>
    <List items={[
      "**Set up a job from the subcontract.** Paste the contract and Athena pulls key terms — retainage, notice windows, liquidated damages — cited by section. What it can't find, it marks unknown instead of guessing.",
      "**Asks one question at a time.** Walks the open setup items and saves each answer.",
      "**Logs delays against your contract.** Opens notice and claim items with due dates from your notice terms, owned by the job's PM.",
      "**Client-safe reports.** Status, open items and dates for the GC — no SOV dollars, margin or forecasts.",
      "**Closes items with evidence.** Nothing closes on \"we're good\" — each item needs proof.",
      "**Drafts notices, never sends them.** Every draft carries a \"Sign as\" line for you to review and send.",
    ]} />

    <h2>Who it's for</h2>
    <p><R>{"I've spent my career on the contractor side of [optional: $5B+ in construction volume] disputes and schedules. Athena is the office discipline I'd want every subcontractor running: know your contract, protect your notice rights, and keep the paper trail."}</R></p>

    <h2>Privacy &amp; trust</h2>
    <p>Your data lives in a secure Supabase database, scoped to your workspace and the people you add. Athena has no access to outside systems and sends nothing on your behalf.</p>
  </AthenaLayout>
);

export default AthenaHome;
