import { useState } from "react";
import type { CpmPortalState } from "@/lib/cpm-intensive-portal";
import { downloadTicket, ticketSvg } from "@/lib/cpm-intensive-ticket";

export function CpmAttendeeTicket({ portal, sample }: { portal: CpmPortalState; sample: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function download() {
    setBusy(true); setError("");
    try { await downloadTicket(portal, sample); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not download your ticket. Please try again."); }
    finally { setBusy(false); }
  }
  return <section className="cpm-ticket-section" aria-labelledby="cpm-ticket-heading">
    <div className="cpm-ticket-heading"><div><p className="cpm-hub-label">Your two-day e-ticket</p><h2 id="cpm-ticket-heading">You’re on the schedule.</h2></div><button className="cpm-hub-button cpm-hub-outline" disabled={busy} onClick={download}>{busy ? "Preparing ticket…" : "Download e-ticket ↓"}</button></div>
    <div className="cpm-ticket-art"><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(ticketSvg(portal, sample))}`} alt={`Personal e-ticket for ${portal.attendee.name || "registered attendee"}, ALP CPM Schedule Intensive (2-Day), ${portal.schedule.dates_label || "dates to be confirmed"}, ${portal.attendee.ticket_number}`} /></div>
    <p className="cpm-hub-fine">Save your ticket image to your phone. Your personal portal is your entry point for both live days; the ticket image does not grant access.</p>
    {error && <p role="alert">{error}</p>}
  </section>;
}
