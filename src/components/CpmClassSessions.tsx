import type { CpmPortalState } from "@/lib/cpm-intensive-portal";
import { downloadFile, googleCalendarUrl, sessionIcs } from "@/lib/cpm-intensive-ticket";

export function CpmClassSessions({ schedule, refreshing, error, refresh }: { schedule: CpmPortalState["schedule"]; refreshing: boolean; error: string; refresh: () => void }) {
  const format = (date: string) => new Intl.DateTimeFormat("en-US", { timeZone: schedule.timezone || "UTC", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(date));
  return <section className="cpm-hub-panel" aria-labelledby="cpm-meet-heading">
    <p className="cpm-hub-label">02 · Live classroom</p><h2 id="cpm-meet-heading">Google Meet.</h2>
    <p className="cpm-hub-session">{schedule.dates_label || "Friday & Saturday"}<br />{schedule.hours}{schedule.timezone ? ` · ${schedule.timezone.replace(/_/g, " ")}` : " · Timezone to be confirmed"}</p>
    <p className="cpm-hub-fine">Save each day to your calendar now. Return to this portal for the Meet link one hour before that session starts. Calendar entries contain this portal’s address; meeting links appear here.</p>
    <div className="cpm-class-sessions">{schedule.sessions?.length ? schedule.sessions.map(session => <article className="cpm-class-session" key={session.id}>
      <h3>{session.title}</h3><p>{format(session.starts_at)}</p>
      <div className="cpm-calendar-actions"><a className="cpm-hub-text-link" href={googleCalendarUrl(session)} target="_blank" rel="noopener noreferrer" aria-label={`Add ${session.title} to Google Calendar`}>Google Calendar ↗</a><button className="cpm-hub-text-link" onClick={() => downloadFile(sessionIcs(session), "text/calendar;charset=utf-8", `ALP-CPM-${session.id}.ics`)} aria-label={`Download ${session.title} for Microsoft Outlook or Apple Calendar`}>Outlook / Apple (.ics) ↓</button></div>
      {session.ended ? <p className="cpm-session-status">This live session has ended.</p> : session.meet_url ? <a className="cpm-hub-button" href={session.meet_url} target="_blank" rel="noopener noreferrer" aria-label={`Join ${session.title} on Google Meet`}>Join Google Meet ↗</a> : <p className="cpm-session-status">Meet link unlocks {format(session.release_at)}. Keep your link private.</p>}
    </article>) : <p className="cpm-hub-placeholder">Calendar saves will be available as soon as the session timezone is confirmed. Meet links unlock one hour before each day begins.</p>}</div>
    <button className="cpm-hub-text-link" onClick={refresh} disabled={refreshing}>{refreshing ? "Checking access…" : "Refresh live access"}</button>
    {error && <p role="alert" className="cpm-hub-fine">{error}</p>}
    <p className="cpm-hub-fine">Both live days will be recorded. An open portal checks for your link automatically. Import each calendar file once to avoid duplicate entries.</p>
  </section>;
}
