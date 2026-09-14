import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CPM_ACCESS_KEY, CPM_PORTAL_PATH, P6_DOWNLOAD_URL, cpmCredentials, loadCpmPortal, type CpmCredentials, type CpmPortalState } from "@/lib/cpm-intensive-portal";
import "./CpmIntensiveOnboarding.css";

function savedAccess() { try { return localStorage.getItem(CPM_ACCESS_KEY); } catch { return null; } }

export default function CpmIntensiveOnboarding() {
  const [credentials, setCredentials] = useState<CpmCredentials | null>(() => cpmCredentials(window.location.search, savedAccess()));
  const [portal, setPortal] = useState<CpmPortalState | null>(null);
  const [busy, setBusy] = useState(Boolean(credentials));
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const personalLink = useRef<HTMLInputElement>(null);
  // Local visual fixture only; the production bundle has no preview access path.
  const [localPreview] = useState(() => import.meta.env.DEV && new URLSearchParams(window.location.search).get("preview") === "1");

  useEffect(() => {
    let cancelled = false;
    window.history.replaceState({}, "", CPM_PORTAL_PATH);
    if (localPreview) {
      setPortal({ access: "local-preview", attendee: { name: "Sample attendee", email: "attendee@example.com", ticket_number: "CPM-PREVIEW" }, schedule: { dates_label: null, timezone: null, hours: "10 a.m.–5 p.m. each day", meet_url: null }, materials: { released: false, release_at: null, files: [] } });
      setBusy(false);
      return;
    }
    if (!credentials) { setBusy(false); return; }
    try { localStorage.removeItem(CPM_ACCESS_KEY); } catch { /* Do not retain a different attendee on failed verification. */ }
    setBusy(true); setError(""); setPortal(null);
    loadCpmPortal(credentials).then(state => {
      if (cancelled) return;
      try { localStorage.setItem(CPM_ACCESS_KEY, state.access); } catch { /* A personal link remains available when storage is blocked. */ }
      setPortal(state);
    }).catch(reason => {
      if (!cancelled) setError(reason instanceof Error ? reason.message : "Please try again.");
    }).finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [credentials, attempt, localPreview]);

  function closePass() {
    try { localStorage.removeItem(CPM_ACCESS_KEY); } catch { /* Storage can be unavailable. */ }
    setPortal(null); setCredentials(null); setError(""); setCopied(false);
  }
  async function copyPass() {
    if (!portal || localPreview) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${CPM_PORTAL_PATH}?access=${portal.access}`);
      setCopied(true); setCopyError(false);
    } catch { setCopyError(true); }
  }
  const releaseLabel = portal?.materials.release_at ? new Date(portal.materials.release_at).toLocaleString("en-US", { timeZone: portal.schedule.timezone || "UTC", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }) : null;

  return <div className="cpm-hub">
    <Helmet><title>CPM Intensive · Attendee portal | ALP</title><meta name="robots" content="noindex, nofollow" /><meta name="referrer" content="no-referrer" /></Helmet>
    <header className="cpm-hub-nav"><a href="/cpm-intensive" aria-label="CPM Intensive landing page"><strong>ALP</strong><span>CPM Intensive</span></a><span className="cpm-hub-label">Personal attendee portal</span></header>
    <main>
      {busy ? <section className="cpm-hub-state" role="status"><p className="cpm-hub-label">Your personal pass</p><h1>Confirming your enrollment.</h1><p>We’re checking your completed purchase. This won’t start a payment.</p></section>
      : !portal ? <section className="cpm-hub-state"><p className="cpm-hub-label">Attendee access</p><h1>{error ? "We couldn’t open your pass." : "Your classroom starts here."}</h1><p role={error ? "alert" : undefined}>{error || "Return here from your completed CPM Intensive checkout, or open your saved personal attendee link."}</p><div className="cpm-hub-actions">{credentials && <button className="cpm-hub-button" onClick={() => setAttempt(n => n + 1)}>Try again</button>}<a className="cpm-hub-button cpm-hub-outline" href="/cpm-intensive">View the intensive</a><a className="cpm-hub-text-link" href="mailto:marshall@marshallwilkinson.com">Contact ALP</a></div></section>
      : <>
        {localPreview && <p className="cpm-hub-preview">Local design preview · Sample attendee · No purchase verified</p>}
        <section className="cpm-hub-welcome"><div><p className="cpm-hub-label">ALP CPM Schedule Intensive (2-Day)</p><h1>Your CPM classroom.</h1><p>Build the baseline. Keep the updates connected. Put the schedule to work.</p></div><div className="cpm-hub-pass"><span className="cpm-hub-label">{localPreview ? "Sample pass" : "Enrollment confirmed"}</span><strong>{portal.attendee.name || "Registered attendee"}</strong><span>{portal.attendee.email}</span><small>{portal.attendee.ticket_number}</small></div></section>
        <section className="cpm-hub-software" aria-labelledby="cpm-p6-heading"><div><p className="cpm-hub-label">01 · Get ready to build</p><h2 id="cpm-p6-heading">Primavera P6 Professional.</h2><p>Use your company license if you already have P6 Professional. Otherwise, start Oracle’s <strong>30-day free trial</strong> for the classroom exercises.</p><a href={P6_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="cpm-hub-button">Get P6 from Oracle ↗</a><p className="cpm-hub-fine">Oracle account and trial acceptance happen directly with Oracle.</p></div><div className="cpm-hub-prep"><h3>Have it running before Day 1.</h3><ol><li>Sign in to Oracle Software Delivery Cloud.</li><li>Find Primavera P6 Professional and follow Oracle’s download and installation instructions.</li><li>Use a Windows machine that can run P6 Professional. You’ll build your own schedule as you learn.</li></ol><a href="https://docs.oracle.com/cd/G18296_01/English/Installing/p6_pro_install_config_standalone/703.htm" target="_blank" rel="noopener noreferrer">Oracle installation guidance ↗</a></div></section>
        <div className="cpm-hub-grid">
          <section className="cpm-hub-panel" aria-labelledby="cpm-meet-heading"><p className="cpm-hub-label">02 · Live classroom</p><h2 id="cpm-meet-heading">Google Meet.</h2><p className="cpm-hub-session">{portal.schedule.dates_label || "Friday & Saturday"}<br />{portal.schedule.hours}{portal.schedule.timezone ? ` · ${portal.schedule.timezone}` : " · Timezone to be confirmed"}</p><ul className="cpm-hub-days"><li><strong>Day 1</strong><span>Build and update the CPM in P6.</span></li><li><strong>Day 2</strong><span>Analyze delay and prove the time.</span></li></ul>{portal.schedule.meet_url ? <a className="cpm-hub-button" href={portal.schedule.meet_url} target="_blank" rel="noopener noreferrer">Join Google Meet ↗</a> : <p className="cpm-hub-placeholder">Meet link drops when dates lock.</p>}<p className="cpm-hub-fine">Both live days will be recorded.</p></section>
          <section className="cpm-hub-panel" aria-labelledby="cpm-downloads-heading"><p className="cpm-hub-label">03 · Class materials</p><h2 id="cpm-downloads-heading">Downloads.</h2><p>Your workbooks and leave-with packs will live here.</p>{portal.materials.files.length ? <ul className="cpm-hub-files">{portal.materials.files.map(file => <li key={file.id}><a href={file.url} target="_blank" rel="noopener noreferrer"><strong>{file.title}</strong><span aria-hidden="true">↗</span></a>{file.description && <p>{file.description}</p>}</li>)}</ul> : <p className="cpm-hub-placeholder">{portal.materials.released ? "The shelf is ready. Class packs will appear here as they’re added." : releaseLabel ? `Materials unlock ${releaseLabel}.` : "Materials release timing is TBD. Class packs will appear here once released."}</p>}<button className="cpm-hub-text-link" onClick={() => { setCredentials({ access: portal.access }); setAttempt(n => n + 1); }}>Refresh materials</button></section>
        </div>
        <section className="cpm-hub-personal"><div><h2>Keep your personal pass.</h2><p>Save your link for the live days and downloads. It is private and tied to your attendee identity. Please don’t share it.</p></div><div className="cpm-hub-actions"><button className="cpm-hub-button cpm-hub-outline" onClick={copyPass} disabled={localPreview}>{copied ? "Personal link copied" : "Copy my personal link"}</button><button className="cpm-hub-text-link" onClick={closePass}>Close my pass</button><span className="cpm-hub-fine" role="status">{copied ? "Keep it somewhere private." : ""}</span></div>{copyError && <div className="cpm-hub-copy"><label htmlFor="personal-cpm-link">Copy and save this link privately:</label><input id="personal-cpm-link" ref={personalLink} readOnly value={`${window.location.origin}${CPM_PORTAL_PATH}?access=${portal.access}`} onFocus={() => personalLink.current?.select()} /></div>}</section>
      </>}
    </main><footer className="cpm-hub-footer"><span>ALP · CPM Schedule Intensive</span><a href="mailto:marshall@marshallwilkinson.com">Need help? Contact ALP</a></footer>
  </div>;
}
