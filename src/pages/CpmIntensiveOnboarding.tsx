import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CPM_ACCESS_KEY, CPM_PORTAL_PATH, P6_DOWNLOAD_URL, cpmCredentials, loadCpmPortal, type CpmCredentials, type CpmPortalState } from "@/lib/cpm-intensive-portal";
import "./CpmIntensiveOnboarding.css";
import { CpmAttendeeTicket } from "@/components/CpmAttendeeTicket";
import { CpmClassSessions } from "@/components/CpmClassSessions";

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
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const activeAccess = useRef<string | null>(null);
  activeAccess.current = portal?.access || null;
  // Local visual fixture only; the production bundle has no preview access path.
  const [localPreview] = useState(() => import.meta.env.DEV && new URLSearchParams(window.location.search).get("preview") === "1");

  useEffect(() => {
    let cancelled = false;
    window.history.replaceState({}, "", CPM_PORTAL_PATH);
    if (import.meta.env.DEV && localPreview) {
      setPortal({ access: "local-preview", attendee: { name: "Sample attendee", email: "attendee@example.com", ticket_number: "CPM-PREVIEW" }, schedule: { dates_label: "September 25–26, 2026", timezone: "America/New_York", hours: "10 a.m.–5 p.m. each day", meet_url: null, sessions: [
        { id: "day-1", title: "Day 1 · Build and update the CPM", starts_at: "2026-09-25T10:00:00-04:00", ends_at: "2026-09-25T17:00:00-04:00", release_at: "2026-09-25T13:00:00Z", ended: false, meet_url: null },
        { id: "day-2", title: "Day 2 · Analyze and prove delay", starts_at: "2026-09-26T10:00:00-04:00", ends_at: "2026-09-26T17:00:00-04:00", release_at: "2026-09-26T13:00:00Z", ended: false, meet_url: null }
      ] }, materials: { released: false, release_at: "2026-09-24T14:00:00Z", files: [] } });
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

  const refreshLive = useCallback(async () => {
    const access = activeAccess.current;
    if (!access || localPreview) return;
    setRefreshing(true); setRefreshError("");
    try {
      const next = await loadCpmPortal({ access });
      if (activeAccess.current === access) setPortal(next);
    } catch {
      if (activeAccess.current === access) {
        setRefreshError("Could not refresh live access. Please try again.");
        // An unsuccessful recheck must not retain previously returned meeting links.
        setPortal(previous => previous ? { ...previous, schedule: { ...previous.schedule, meet_url: null, sessions: previous.schedule.sessions?.map(session => ({ ...session, meet_url: null })) } } : null);
      }
    } finally { setRefreshing(false); }
  }, [localPreview]);

  useEffect(() => {
    if (!portal?.access || localPreview) return;
    const pending = portal.schedule.sessions?.filter(session => !session.ended) || [];
    if (!pending.length) return;
    // Recheck at the release boundary, once a minute thereafter, and on tab focus.
    const boundaries = pending.flatMap(session => [Date.parse(session.release_at), Date.parse(session.ends_at)]).filter(time => time > Date.now());
    const delay = Math.max(500, Math.min(60_000, ...boundaries.map(time => time - Date.now() + 100)));
    const timer = window.setTimeout(refreshLive, delay);
    const onVisible = () => { if (document.visibilityState === "visible") void refreshLive(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, [portal, localPreview, refreshLive]);

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
        {import.meta.env.DEV && localPreview && <p className="cpm-hub-preview">Local design preview · Sample attendee · No purchase verified</p>}
        <section className="cpm-hub-welcome"><div><p className="cpm-hub-label">ALP CPM Schedule Intensive (2-Day)</p><h1>Your CPM classroom.</h1><p>Build the baseline. Keep the updates connected. Put the schedule to work.</p></div><div className="cpm-hub-pass"><span className="cpm-hub-label">{localPreview ? "Sample pass" : "Enrollment confirmed"}</span><strong>{portal.attendee.name || "Registered attendee"}</strong><span>{portal.attendee.email}</span><small>{portal.attendee.ticket_number}</small></div></section>
        <CpmAttendeeTicket portal={portal} sample={localPreview} />
        <section className="cpm-hub-panel" aria-labelledby="cpm-practice-heading"><h2 id="cpm-practice-heading">Practice files (sample XER)</h2><p>Download the zip, unzip it, and import the XER files into your own P6 (File &gt; Import). We’ll open these together during the intensive, and the session is recorded for your future reference.</p><a href="https://drive.google.com/file/d/1TsaFIH9ivi1VjqkYGdEevvX7bFpgx2rD/view" target="_blank" rel="noopener noreferrer" className="cpm-hub-button">Download practice files</a></section>
        <section className="cpm-hub-software" aria-labelledby="cpm-p6-heading"><div><p className="cpm-hub-label">01 · Get ready to build</p><h2 id="cpm-p6-heading">Primavera P6 Professional.</h2><p>The classroom tool is <strong>Primavera P6 Professional</strong> desktop only. Not Primavera Cloud, not Oracle Academy, not OverWatch.</p><p><strong>Already have company P6 Professional?</strong> Open P6 and confirm you can add activities and schedule.</p><p><strong>Don’t have it?</strong> Create a free Oracle account, go to Software Delivery Cloud, search “Primavera P6 Professional”, choose the Primavera P6 Professional Project Management media, and install <strong>P6 Pro Standalone (SQLite)</strong> on Windows.</p><p>Have P6 launching by <strong>Thursday</strong>, before Friday’s class.</p><p><strong>On a Mac?</strong> There is no Mac installer. Line up a Windows PC, a Windows VM, or a loaner by <strong>Thursday noon ET</strong> — or email <a href="mailto:marshall@marshallwilkinson.com">marshall@marshallwilkinson.com</a>.</p><a href={P6_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="cpm-hub-button">Get P6 from Oracle ↗</a><p className="cpm-hub-fine">Oracle account creation and terms acceptance happen directly with Oracle.</p></div><div className="cpm-hub-prep"><h3>Have it running before Day 1.</h3><ol><li>Create or sign in to a free Oracle account on Software Delivery Cloud.</li><li>Search Primavera P6 Professional and download the Professional Project Management Applications media — not Cloud, not Academy, not docs-only.</li><li>Install P6 Pro Standalone (SQLite) on Windows and save your P6 password.</li><li>Mac users: Windows PC, VM, or loaner by Thursday noon ET — or email marshall@marshallwilkinson.com.</li><li>Open P6 and confirm you can add activities and schedule. Done before Friday.</li></ol><a href="https://docs.oracle.com/cd/G18296_01/English/Installing/p6_pro_install_config_standalone/703.htm" target="_blank" rel="noopener noreferrer">Oracle installation guidance ↗</a></div></section>
        <div className="cpm-hub-grid">
          <CpmClassSessions schedule={portal.schedule} refreshing={refreshing} error={refreshError} refresh={refreshLive} />
          <section className="cpm-hub-panel" aria-labelledby="cpm-downloads-heading"><p className="cpm-hub-label">03 · Class materials</p><h2 id="cpm-downloads-heading">Downloads.</h2><p>Your workbooks and leave-with packs will live here.</p>{portal.materials.files.length ? <ul className="cpm-hub-files">{portal.materials.files.map(file => <li key={file.id}><a href={file.url} target="_blank" rel="noopener noreferrer"><strong>{file.title}</strong><span aria-hidden="true">↗</span></a>{file.description && <p>{file.description}</p>}</li>)}</ul> : <p className="cpm-hub-placeholder">{portal.materials.released ? "The shelf is ready. Class packs will appear here as they’re added." : releaseLabel ? `Materials unlock ${releaseLabel}.` : "Materials release timing is TBD. Class packs will appear here once released."}</p>}<button className="cpm-hub-text-link" onClick={() => { setCredentials({ access: portal.access }); setAttempt(n => n + 1); }}>Refresh materials</button></section>
        </div>
        <section className="cpm-hub-personal"><div><h2>Keep your personal pass.</h2><p>Save your link for the live days and downloads. It is private and tied to your attendee identity. Please don’t share it.</p></div><div className="cpm-hub-actions"><button className="cpm-hub-button cpm-hub-outline" onClick={copyPass} disabled={localPreview}>{copied ? "Personal link copied" : "Copy my personal link"}</button><button className="cpm-hub-text-link" onClick={closePass}>Close my pass</button><span className="cpm-hub-fine" role="status">{copied ? "Keep it somewhere private." : ""}</span></div>{copyError && <div className="cpm-hub-copy"><label htmlFor="personal-cpm-link">Copy and save this link privately:</label><input id="personal-cpm-link" ref={personalLink} readOnly value={`${window.location.origin}${CPM_PORTAL_PATH}?access=${portal.access}`} onFocus={() => personalLink.current?.select()} /></div>}</section>
      </>}
    </main><footer className="cpm-hub-footer"><span>ALP · CPM Schedule Intensive</span><a href="mailto:marshall@marshallwilkinson.com">Need help? Contact ALP</a></footer>
  </div>;
}
