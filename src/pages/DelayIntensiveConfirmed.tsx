import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { submitIntensiveClaim } from "@/lib/intensive-claims";
import "./DelayIntensive.css";

export default function DelayIntensiveConfirmed() {
  const [status, setStatus] = useState<"idle" | "submitting" | "complete">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      await submitIntensiveClaim({
        purchaser_email: String(form.get("purchaser_email") ?? ""),
        submitter_name: String(form.get("submitter_name") ?? ""),
        company_name: String(form.get("company_name") ?? ""),
        project_name: String(form.get("project_name") ?? ""),
        claim_stage: String(form.get("claim_stage") ?? "other") as "other",
        amount_at_issue: String(form.get("amount_at_issue") ?? ""),
        claim_summary: String(form.get("claim_summary") ?? ""),
        records_available: String(form.get("records_available") ?? ""),
        redaction_notes: String(form.get("redaction_notes") ?? ""),
        discussion_permission: form.get("discussion_permission") === "on",
        website: String(form.get("website") ?? ""),
      });
      setStatus("complete");
      event.currentTarget.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We couldn't save that submission.");
      setStatus("idle");
    }
  };

  return (
    <main className="di-confirmed">
      <Link to="/" className="di-mark"><span>ALP</span><small>Professional Intensive</small></Link>
      <section className="di-confirmed-hero">
        <p className="di-section-label">Your seat is reserved.</p>
        <h1>You are in the room.</h1>
        <p>A confirmation receipt is on its way from Stripe. ALP will send the Zoom access, preparation instructions and attendee-material schedule to the email used at checkout.</p>
        <dl>
          <div><dt>Dates</dt><dd>September 4–6, 2026</dd></div>
          <div><dt>First session</dt><dd>Friday at 1:00 p.m. ET</dd></div>
          <div><dt>Bring</dt><dd>Your questions, one delay event and the record you actually have</dd></div>
        </dl>
        <p className="di-confirmed-help">Need to change an attendee name? Email <a href="mailto:marshall@marshallwilkinson.com">marshall@marshallwilkinson.com</a>.</p>
      </section>

      <section className="di-claim-submit" id="submit-a-claim">
        <div className="di-claim-submit-intro">
          <p className="di-section-label">Purchaser-only submission</p>
          <h2>Put your live claim in the room.</h2>
          <p>After enrollment, you may submit one active delay or claim for Marshall to consider. He will choose which claim or claims, if any, are most useful to dissect with the cohort.</p>
          <div className="di-claim-submit-note">
            <strong>Selection is not guaranteed.</strong>
            <p>Use the exact email from Stripe checkout. ALP verifies the purchase before Marshall reviews the submission. Do not upload confidential project files here; selected submitters will receive a secure document request.</p>
          </div>
        </div>

        {status === "complete" ? (
          <div className="di-claim-success" role="status">
            <span>Submission received</span>
            <h3>Marshall has the outline.</h3>
            <p>ALP will verify the enrollment and contact you only if more information or a secure document transfer is needed. Submission does not guarantee live selection.</p>
          </div>
        ) : (
          <form className="di-claim-form" onSubmit={handleSubmit}>
            <div className="di-form-grid">
              <label>
                <span>Name</span>
                <input name="submitter_name" autoComplete="name" required maxLength={120} />
              </label>
              <label>
                <span>Company</span>
                <input name="company_name" autoComplete="organization" required maxLength={160} />
              </label>
              <label className="di-form-wide">
                <span>Email used at Stripe checkout</span>
                <input name="purchaser_email" type="email" autoComplete="email" required maxLength={254} />
              </label>
              <label>
                <span>Project</span>
                <input name="project_name" required maxLength={200} />
              </label>
              <label>
                <span>Current stage</span>
                <select name="claim_stage" defaultValue="active-delay" required>
                  <option value="active-delay">Delay is active</option>
                  <option value="notice-preparation">Preparing notice</option>
                  <option value="claim-development">Building the claim</option>
                  <option value="submitted">Claim submitted</option>
                  <option value="disputed">Claim disputed</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="di-form-wide">
                <span>Approximate amount or time at issue <em>Optional</em></span>
                <input name="amount_at_issue" placeholder="Example: $850,000 and 74 calendar days" maxLength={80} />
              </label>
              <label className="di-form-wide">
                <span>What happened?</span>
                <textarea name="claim_summary" rows={7} required minLength={40} maxLength={3000} placeholder="Give Marshall the event, responsibility, schedule effect, and present commercial position." />
              </label>
              <label className="di-form-wide">
                <span>What records exist?</span>
                <textarea name="records_available" rows={4} required minLength={10} maxLength={1500} placeholder="Contract, notices, baseline and updates, daily reports, cost code detail, correspondence, photos..." />
              </label>
              <label className="di-form-wide">
                <span>Redaction or sensitivity notes <em>Optional</em></span>
                <textarea name="redaction_notes" rows={3} maxLength={1000} placeholder="Identify names, values, or project facts that would need to be anonymized." />
              </label>
              <label className="di-honeypot" aria-hidden="true">
                <span>Website</span>
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className="di-consent">
              <input name="discussion_permission" type="checkbox" required />
              <span>I have authority to submit this outline and give Marshall permission to consider an anonymized or redacted version for group educational discussion. I understand that submission does not guarantee selection and does not create a legal, expert, or consulting engagement.</span>
            </label>
            {error && <p className="di-form-error" role="alert">{error}</p>}
            <button className="di-button di-button-primary" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting…" : "Submit for Marshall's review"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
