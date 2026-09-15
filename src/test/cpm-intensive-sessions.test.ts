import { describe, expect, it } from "vitest";
import { publicCpmSessions } from "../../supabase/functions/_shared/cpm-intensive-sessions";
import { googleCalendarUrl, sessionIcs, ticketSvg } from "@/lib/cpm-intensive-ticket";
import type { CpmPortalState } from "@/lib/cpm-intensive-portal";

const day1 = { id: "day-1", title: "Day 1 · Build and update the CPM", starts_at: "2026-09-25T14:00:00Z", ends_at: "2026-09-25T21:00:00Z", meet_url: "https://meet.google.com/abc-defg-hij", host_event_id: "private-host-id" };
const day2 = { ...day1, id: "day-2", starts_at: "2026-09-26T14:00:00Z", ends_at: "2026-09-26T21:00:00Z", meet_url: "https://meet.google.com/xyz-abcd-efg" };
describe("CPM per-day meeting release", () => {
  it("withholds URLs before the exact release and releases only the current day", () => {
    expect(publicCpmSessions([day1, day2], Date.parse("2026-09-25T12:59:59.999Z")).every(s => s.meet_url === null)).toBe(true);
    const sessions = publicCpmSessions([day1, day2], Date.parse("2026-09-25T13:00:00Z"));
    expect(sessions[0].meet_url).toBe(day1.meet_url); expect(sessions[1].meet_url).toBeNull();
    expect(JSON.stringify(sessions)).not.toContain("private-host-id");
  });
  it("hides a finished day's link and releases the next day independently", () => {
    const sessions = publicCpmSessions([day1, day2], Date.parse("2026-09-26T13:00:00Z"));
    expect(sessions[0]).toMatchObject({ ended: true, meet_url: null }); expect(sessions[1].meet_url).toBe(day2.meet_url);
  });
  it("fails closed on invalid timestamps and invalid Meet URLs", () => {
    expect(publicCpmSessions([{ ...day1, starts_at: "broken" }])).toEqual([]);
    expect(publicCpmSessions([{ ...day1, meet_url: "javascript:alert(1)" }], Date.parse("2026-09-25T14:00:00Z"))[0].meet_url).toBeNull();
  });
});
describe("CPM calendar saves and tickets", () => {
  const session = publicCpmSessions([day1], Date.parse("2026-09-25T14:00:00Z"))[0];
  it("exports the correct UTC time, a reminder and only the portal URL even after Meet unlock", () => {
    const ics = sessionIcs(session);
    expect(ics).toContain("DTSTART:20260925T140000Z\r\nDTEND:20260925T210000Z");
    expect(ics).toContain("TRIGGER:-PT1H"); expect(ics).not.toContain("meet.google.com"); expect(ics).not.toContain("?access=");
    expect(ics.split("\r\n").every(line => new TextEncoder().encode(line).length <= 75)).toBe(true);
    const url = new URL(googleCalendarUrl(session));
    expect(url.searchParams.get("dates")).toBe("20260925T140000Z/20260925T210000Z");
    expect(decodeURIComponent(url.href)).not.toContain("meet.google.com");
  });
  it("creates personalized artwork with escaped names and no credentials", () => {
    const state: CpmPortalState = { access: "secret-token", attendee: { name: '<script> & "name"', email: "private@example.com", ticket_number: "CPM-12345678" }, schedule: { dates_label: "September 25–26, 2026", timezone: null, hours: "10 a.m.–5 p.m.", meet_url: day1.meet_url }, materials: { released: false, release_at: null, files: [] } };
    const svg = ticketSvg(state);
    expect(svg).toContain("&lt;script&gt; &amp; &quot;name&quot;"); expect(svg).toContain("CPM-12345678");
    for (const secret of [state.access, state.attendee.email, "meet.google.com", "?access="]) expect(svg).not.toContain(secret);
  });
});
