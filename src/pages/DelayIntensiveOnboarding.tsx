import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClaimAttachment,
  PortalState,
  buildPreviewPortalState,
  loadPortal,
  saveOnboarding,
  submitPortalClaim,
  uploadClaimFile,
} from "@/lib/intensive-portal";
import { enrollmentCanSubmitClaim, passKindFromPreviewFlag } from "@/lib/intensive-pass";
import "./DelayIntensiveOnboarding.css";

const ACCESS_KEY = "alp.delay-intensive.access";

const agenda = [
  ["Friday · September 4", "1:00–5:00 p.m. ET", "Preserve", "Entitlement, notice, reservation of rights and the record."],
  ["Saturday · September 5", "9:00 a.m.–5:00 p.m. ET", "Prove + Price", "CPM causation, concurrency, mitigation and damages."],
  ["Sunday · September 6", "10:00 a.m.–1:00 p.m. ET", "Build", "Claim assembly, red-team review and submission architecture."],
];

export default function DelayIntensiveOnboarding() {
  const [portal, setPortal] = useState<PortalState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [onboardingBusy, setOnboardingBusy] = useState(false);
  const [claimBusy, setClaimBusy] = useState(false);
  const [claimComplete, setClaimComplete] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");

  useEffect(() => {
    let cancelled = false;
    const search = new URLSearchParams(window.location.search);
    const previewKind = import.meta.env.DEV ? passKindFromPreviewFlag(search.get("preview")) : null;
    if (previewKind) {
      setPortal(buildPreviewPortalState(previewKind));
      setLoading(false);
      return () => { cancelled = true; };
    }
    const fromUrl = search.get("access") || undefined;
    const sessionId = search.get("session_id") || undefined;
    const stored = window.localStorage.getItem(ACCESS_KEY) || undefined;
    // A fresh Stripe return must identify the purchase being opened. Reusing a
    // cached attendee token here can otherwise show a previous purchaser's
    // portal on a shared browser.
    const access = fromUrl || (sessionId ? undefined : stored);

    async function connect() {
      if (!access && !sessionId) {
        setError("Open the personal attendee link in your ALP onboarding email or return here from Stripe checkout.");
        setLoading(false);
        return;
      }
      let lastError = "Your purchase could not be confirmed.";
      for (let attempt = 0; attempt < (sessionId && !access ? 6 : 1); attempt += 1) {
        try {
          const state = await loadPortal(access, sessionId);
          if (cancelled) return;
          window.localStorage.setItem(ACCESS_KEY, state.access);
          window.history.replaceState({}, "", "/delay-intensive/onboarding");
          setPortal(state);
          setLoading(false);
          return;
        } catch (connectError) {
          lastError = connectError instanceof Error ? connectError.message : lastError;
          if (attempt < 5) await new Promise((resolve) => window.setTimeout(resolve, 1500));
        }
      }
      if (!cancelled) {
        setError(lastError);
        setLoading(false);
      }
    }
    void connect();
    return () => { cancelled = true; };
  }, []);

  const releaseLabel = useMemo(() => {
    if (!portal) return "September 3 at noon ET";
    return new Date(portal.materials.release_at).toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  }, [portal]);

  async function refresh(access = portal?.access) {
    if (!access) return;
    const state = await loadPortal(access);
    setPortal(state);
  }

  async function handleOnboarding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!portal) return;
    setOnboardingBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const attendeeNames = Array.from({ length: portal.attendee.seats }, (_, index) =>
      String(form.get(`attendee_${index}`) || ""),
    );
    try {
      await saveOnboarding(portal.access, {
        attendee_names: attendeeNames,
        company_name: String(form.get("company_name") || ""),
        phone: String(form.get("phone") || ""),
        preparation_notes: String(form.get("preparation_notes") || ""),
      });
      await refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Onboarding could not be saved.");
    } finally {
      setOnboardingBusy(false);
    }
  }

  async function handleClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!portal) return;
    setClaimBusy(true);
    setError("");
    setUploadProgress("");
    const form = new FormData(event.currentTarget);
    try {
      const attachments: ClaimAttachment[] = [];
      for (let index = 0; index < files.length; index += 1) {
        setUploadProgress(`Uploading ${index + 1} of ${files.length}: ${files[index].name}`);
        attachments.push(await uploadClaimFile(portal.access, files[index]));
      }
      setUploadProgress("Sending the claim outline to Marshall…");
      await submitPortalClaim(portal.access, {
        project_name: String(form.get("project_name") || ""),
        claim_stage: String(form.get("claim_stage") || ""),
        amount_at_issue: String(form.get("amount_at_issue") || ""),
        claim_summary: String(form.get("claim_summary") || ""),
        records_available: String(form.get("records_available") || ""),
        redaction_notes: String(form.get("redaction_notes") || ""),
        discussion_permission: form.get("discussion_permission") === "on",
        attachments,
      });
      setClaimComplete(true);
      await refresh();
    } catch (claimError) {
      setError(claimError instanceof Error ? claimError.message : "The claim could not be submitted.");
    } finally {
      setClaimBusy(false);
      setUploadProgress("");
    }
  }

  if (loading) return <PortalShell><div className="dip-state"><span className="dip-spinner" />Confirming your enrollment with Stripe…</div></PortalShell>;
  if (!portal) return <PortalShell><div className="dip-state dip-state-error"><h1>We could not open your pass.</h1><p>{error}</p><a href="mailto:marshall@marshallwilkinson.com">Contact ALP</a></div></PortalShell>;

  const onboarded = Boolean(portal.attendee.onboarding_completed_at);
  const canSubmitClaim = enrollmentCanSubmitClaim(portal);
  const claimSubmitted = Boolean(portal.claim || claimComplete);
  const passLabel = canSubmitClaim
    ? (portal.attendee.enrollment_type === "company" ? "Company · 2 seats" : "Individual · 1 seat")
    : "Attendee";
  const nameLabel = canSubmitClaim ? "Purchaser" : "Attendee";

  return (
    <PortalShell>
      <section className="dip-ticket">
        <div className="dip-ticket-top"><span>Official e-ticket</span><strong>{portal.attendee.ticket_number}</strong></div>
        <div className="dip-ticket-main">
          <div><p>ALP Professional Intensive</p><h1>Delay &amp; Damages</h1><h2>September 4–6, 2026 · Live online</h2></div>
          <div className="dip-ticket-status"><span>Payment</span><strong>Confirmed</strong></div>
        </div>
        <dl>
          <div><dt>Pass</dt><dd>{passLabel}</dd></div>
          <div><dt>{nameLabel}</dt><dd>{portal.attendee.name || portal.attendee.email}</dd></div>
          <div><dt>Materials</dt><dd>{portal.materials.released ? "Released" : `Unlock ${releaseLabel}`}</dd></div>
        </dl>
      </section>

      <section className={`dip-progress${canSubmitClaim ? "" : " dip-progress-two"}`} aria-label="Attendee readiness">
        <div className={onboarded ? "complete" : "active"}><span>01</span><strong>Onboarding</strong><small>{onboarded ? "Complete" : "Required"}</small></div>
        {canSubmitClaim ? <div className={claimSubmitted ? "complete" : ""}><span>02</span><strong>Live claim</strong><small>{claimSubmitted ? "Submitted" : "Optional"}</small></div> : null}
        <div className={portal.materials.released ? "complete" : ""}><span>03</span><strong>Materials</strong><small>{portal.materials.released ? "Available" : "Timed release"}</small></div>
      </section>

      <section className="dip-grid">
        <article className="dip-panel dip-onboarding">
          <header><p>Step 01 · Required</p><h2>{onboarded ? "Your attendee details are set." : "Tell us who is coming."}</h2></header>
          <form onSubmit={handleOnboarding}>
            {Array.from({ length: portal.attendee.seats }, (_, index) => (
              <label key={index}><span>Attendee {index + 1} full name</span><input name={`attendee_${index}`} defaultValue={portal.attendee.attendee_names[index] || (index === 0 ? portal.attendee.name || "" : "")} required maxLength={120} /></label>
            ))}
            <label><span>Company</span><input name="company_name" defaultValue={portal.attendee.company_name || ""} required maxLength={160} /></label>
            <label><span>Mobile phone <em>Optional</em></span><input name="phone" type="tel" defaultValue={portal.attendee.phone || ""} maxLength={50} /></label>
            <label><span>What do you need to leave able to do? <em>Optional</em></span><textarea name="preparation_notes" rows={4} maxLength={1500} defaultValue={portal.attendee.preparation_notes || ""} placeholder="Give Marshall the commercial result you need from the weekend." /></label>
            <button type="submit" disabled={onboardingBusy}>{onboardingBusy ? "Saving…" : onboarded ? "Update attendee details" : "Complete onboarding"}</button>
          </form>
        </article>

        <article className="dip-panel dip-agenda">
          <header><p>The working agenda</p><h2>Three days. One claim-development sequence.</h2></header>
          <ol>{agenda.map(([date, time, title, detail], index) => <li key={date}><span>0{index + 1}</span><div><strong>{date}</strong><time>{time}</time><h3>{title}</h3><p>{detail}</p></div></li>)}</ol>
        </article>
      </section>

      <section className={`dip-materials ${portal.materials.released ? "released" : "locked"}`}>
        <div><p>Step 03 · Controlled release</p><h2>{portal.materials.released ? "Your working files are ready." : "Your materials are protected until the room opens."}</h2><p>{portal.materials.released ? "Use these files during the live working sessions. Download links are private and last 30 minutes; if one expires, refresh this page for a new link. Your personal attendee portal remains active." : `The playbook, templates, workbooks, and class files unlock ${releaseLabel}. We will email you when they are available.`}</p></div>
        <div className="dip-material-list">
          {!portal.materials.released ? <div className="dip-lock"><span>Locked</span><strong>Claims Recovery Playbook</strong><small>+ editable notices, CPM worksheets, damages workbooks and claim index</small></div> : null}
          {portal.materials.zoom_url
            ? <a href={portal.materials.zoom_url} target="_blank" rel="noreferrer"><span>Attendance</span><strong>Open live room</strong></a>
            : <div className="dip-lock"><span>Attendance</span><strong>The live-room link will appear here one hour before the session.</strong><small>Return to this personal attendee portal to enter the room.</small></div>}
          {portal.materials.files.map((file) => <a href={file.url} key={file.id} target="_blank" rel="noreferrer"><span>Private file</span><strong>{file.title}</strong><small>{file.description}</small></a>)}
          {portal.materials.released && !portal.materials.zoom_url && portal.materials.files.length === 0 ? <p className="dip-release-pending">The release window is open. ALP is finishing the room package; your email reminder will arrive as soon as the files are posted.</p> : null}
        </div>
      </section>

      {canSubmitClaim ? (
      <section className="dip-claim">
        <div className="dip-claim-intro"><p>Step 02 · Optional</p><h2>Put one live claim in front of Marshall.</h2><p>You may submit one active claim candidate after purchase. Marshall chooses which claim or claims, if any, create the strongest group dissection. Selection is not guaranteed.</p><div><strong>Private intake</strong><span>Files are stored privately and are not visible to other attendees. Upload only records you have authority to share. Selected material may be anonymized or redacted.</span></div></div>
        {claimSubmitted ? <div className="dip-claim-received"><span>Submission received</span><h3>{portal.claim?.project_name || "Marshall has your claim outline."}</h3><p>ALP will contact you if Marshall needs clarification, additional records, or redaction before the weekend.</p></div> : (
          <form onSubmit={handleClaim} className={!onboarded ? "is-disabled" : ""}>
            {!onboarded ? <p className="dip-form-gate">Complete attendee onboarding above before submitting a claim.</p> : null}
            <label><span>Project</span><input name="project_name" required minLength={2} maxLength={200} disabled={!onboarded} /></label>
            <label><span>Current stage</span><select name="claim_stage" defaultValue="active-delay" disabled={!onboarded}><option value="active-delay">Delay is active</option><option value="notice-preparation">Preparing notice</option><option value="claim-development">Building the claim</option><option value="submitted">Claim submitted</option><option value="disputed">Claim disputed</option><option value="other">Other</option></select></label>
            <label><span>Amount or time at issue <em>Optional</em></span><input name="amount_at_issue" placeholder="$850,000 and 74 calendar days" maxLength={80} disabled={!onboarded} /></label>
            <label><span>What happened?</span><textarea name="claim_summary" rows={6} required minLength={40} maxLength={3000} placeholder="Describe the event, responsibility, schedule effect, and present commercial position." disabled={!onboarded} /></label>
            <label><span>What records exist?</span><textarea name="records_available" rows={4} required minLength={10} maxLength={1500} placeholder="Contract, notices, schedule files, updates, daily reports, cost detail, correspondence, photos…" disabled={!onboarded} /></label>
            <label><span>Redaction or sensitivity notes <em>Optional</em></span><textarea name="redaction_notes" rows={3} maxLength={1000} disabled={!onboarded} /></label>
            <label className="dip-upload"><span>Supporting files <em>Optional · up to 5 files · 25 MB each</em></span><input type="file" multiple accept=".pdf,.docx,.xlsx,.csv,.txt,.zip,.xer,.mpp" disabled={!onboarded || claimBusy} onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 5))} /><small>{files.length ? files.map((file) => file.name).join(" · ") : "PDF, Word, Excel, CSV, text, ZIP, XER, or MPP"}</small></label>
            <label className="dip-consent"><input name="discussion_permission" type="checkbox" required disabled={!onboarded} /><span>I have authority to submit these materials and give Marshall permission to consider an anonymized or redacted version for group education. I understand this is not legal advice, expert certification, or a consulting engagement.</span></label>
            {uploadProgress ? <p className="dip-upload-progress">{uploadProgress}</p> : null}
            <button type="submit" disabled={!onboarded || claimBusy}>{claimBusy ? "Securely submitting…" : "Submit for Marshall's review"}</button>
          </form>
        )}
      </section>
      ) : null}
      {error ? <div className="dip-toast" role="alert">{error}<button onClick={() => setError("")}>Dismiss</button></div> : null}
    </PortalShell>
  );
}

function PortalShell({ children }: { children: React.ReactNode }) {
  return <main className="dip-page"><nav><Link to="/" className="dip-mark"><span>ALP</span><small>Professional Intensive</small></Link><a href="mailto:marshall@marshallwilkinson.com">Attendee help</a></nav><div className="dip-shell">{children}</div><footer><span>ALP · Delay &amp; Damages Intensive</span><Link to="/delay-intensive/terms">Enrollment terms</Link></footer></main>;
}
