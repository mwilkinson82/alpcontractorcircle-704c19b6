import type { CpmPortalState, CpmSession } from "./cpm-intensive-portal";

export const CPM_PORTAL_URL = "https://alpcontractorcircle.com/cpm-intensive/onboarding";
const calendarNote = `Open your personal attendee portal one hour before this session to get the Google Meet link. Save your personal pass separately; this calendar entry does not grant access. ${CPM_PORTAL_URL}`;
const calendarTitle = (session: CpmSession) => `ALP CPM Schedule Intensive (2-Day) — ${session.title}`;
const utcStamp = (date: string) => new Date(date).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsEscape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");

// RFC 5545 folds at 75 UTF-8 octets, including the continuation space.
function fold(line: string) {
  const encoder = new TextEncoder();
  const lines: string[] = [];
  let current = "", bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) { lines.push(current); current = " "; bytes = 1; }
    current += character; bytes += size;
  }
  lines.push(current);
  return lines.join("\r\n");
}

export function sessionIcs(session: CpmSession, now = new Date()) {
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ALP//CPM Intensive//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:cpm-intensive-2026-${icsEscape(session.id)}@alpcontractorcircle.com`, `DTSTAMP:${utcStamp(now.toISOString())}`,
    `DTSTART:${utcStamp(session.starts_at)}`, `DTEND:${utcStamp(session.ends_at)}`, `SUMMARY:${icsEscape(calendarTitle(session))}`,
    `DESCRIPTION:${icsEscape(calendarNote)}`, `LOCATION:${CPM_PORTAL_URL}`, `URL:${CPM_PORTAL_URL}`, "STATUS:CONFIRMED", "TRANSP:OPAQUE",
    "BEGIN:VALARM", "ACTION:DISPLAY", "TRIGGER:-PT1H", "DESCRIPTION:Your CPM session starts in one hour. Open your personal attendee portal.", "END:VALARM", "END:VEVENT", "END:VCALENDAR", ""].map(fold).join("\r\n");
}

export function googleCalendarUrl(session: CpmSession) {
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: calendarTitle(session), dates: `${utcStamp(session.starts_at)}/${utcStamp(session.ends_at)}`, details: calendarNote, location: CPM_PORTAL_URL })}`;
}

export function downloadFile(content: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

const xml = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

export function ticketSvg(portal: CpmPortalState, sample = false) {
  const name = portal.attendee.name || "Registered attendee";
  const safeName = xml(name.length > 45 ? `${name.slice(0, 42)}…` : name);
  const timezone = portal.schedule.timezone ? portal.schedule.timezone.replace(/_/g, " ") : "Timezone to be confirmed";
  // No access token, purchaser email, QR credential, or conference link is embedded.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="640" viewBox="0 0 1200 640">
  <rect width="1200" height="640" rx="18" fill="#F7F2EA"/>
  <rect x="1" y="1" width="1198" height="638" rx="18" fill="none" stroke="#DCD5C8" stroke-width="2"/>
  <path d="M910 0V640" stroke="#D97757" stroke-width="2" stroke-dasharray="7 9"/>
  <circle cx="910" cy="0" r="23" fill="#1C1A17"/><circle cx="910" cy="640" r="23" fill="#1C1A17"/>
  <text x="56" y="82" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="45" fill="#1C1A17">ALP</text>
  <text x="179" y="73" font-family="monospace" font-size="15" letter-spacing="3" fill="#9B4A33">${sample ? "SAMPLE E-TICKET" : "PERSONAL E-TICKET"}</text>
  <text x="56" y="190" font-family="Georgia,serif" font-size="63" fill="#1C1A17">CPM Schedule</text>
  <text x="56" y="264" font-family="Georgia,serif" font-size="63" fill="#1C1A17">Intensive (2-Day)</text>
  <text x="56" y="312" font-family="Helvetica,Arial,sans-serif" font-size="20" fill="#6B655D">WITH MARSHALL WILKINSON · LIVE ONLINE</text>
  <path d="M56 350H853" stroke="#DCD5C8"/>
  <text x="56" y="391" font-family="monospace" font-size="13" letter-spacing="2" fill="#9B4A33">ATTENDEE</text>
  <text x="56" y="430" font-family="Helvetica,Arial,sans-serif" font-size="${name.length > 32 ? 25 : 32}" fill="#1C1A17">${safeName}</text>
  <text x="56" y="494" font-family="Helvetica,Arial,sans-serif" font-size="26" fill="#1C1A17">${xml(portal.schedule.dates_label || "Dates to be confirmed")}</text>
  <text x="56" y="530" font-family="Helvetica,Arial,sans-serif" font-size="19" fill="#6B655D">${xml(portal.schedule.hours)} · ${xml(timezone)}</text>
  <text x="56" y="595" font-family="monospace" font-size="13" fill="#6B655D">PERSONAL PASS · OPEN YOUR PORTAL FOR LIVE ACCESS</text>
  <text x="955" y="88" font-family="monospace" font-size="13" letter-spacing="2" fill="#9B4A33">ADMIT ONE</text>
  <text x="955" y="185" font-family="Georgia,serif" font-size="78" fill="#1C1A17">02</text>
  <text x="955" y="219" font-family="monospace" font-size="15" fill="#6B655D">LIVE DAYS</text>
  <path d="M955 295h45v24h45v24h45v24h54" fill="none" stroke="#D97757" stroke-width="5"/>
  <text x="955" y="447" font-family="monospace" font-size="12" letter-spacing="1" fill="#6B655D">TICKET NUMBER</text>
  <text x="955" y="479" font-family="monospace" font-size="16" fill="#1C1A17">${xml(portal.attendee.ticket_number)}</text>
  <text x="955" y="584" font-family="monospace" font-size="12" fill="#9B4A33">${sample ? "DESIGN PREVIEW" : "NON-TRANSFERABLE"}</text>
  </svg>`;
}

export async function downloadTicket(portal: CpmPortalState, sample = false) {
  const picture = new Image();
  picture.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ticketSvg(portal, sample))}`;
  await picture.decode();
  const canvas = document.createElement("canvas"); canvas.width = 1800; canvas.height = 960;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image download unavailable. Please try another browser.");
  context.drawImage(picture, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Image download unavailable. Please try again.");
  downloadFile(blob, "image/png", `ALP-CPM-${portal.attendee.ticket_number}.png`);
}
