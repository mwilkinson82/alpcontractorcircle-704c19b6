import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CpmIntensiveOnboarding from "@/pages/CpmIntensiveOnboarding";
import { CPM_ACCESS_KEY, cpmCredentials, loadCpmPortal, type CpmPortalState } from "@/lib/cpm-intensive-portal";
vi.mock("@/lib/cpm-intensive-portal", async original => ({ ...await original<typeof import('@/lib/cpm-intensive-portal')>(), loadCpmPortal:vi.fn() }));
const load=vi.mocked(loadCpmPortal);
const state:CpmPortalState={ access:"a".repeat(64), attendee:{name:"Verified attendee",email:"attendee@example.com",ticket_number:"CPM-EXAMPLE"}, schedule:{dates_label:null,timezone:null,hours:"10 a.m.–5 p.m. each day",meet_url:null}, materials:{released:false,release_at:null,files:[]} };
function open(search="") { window.history.replaceState({},"","/cpm-intensive/onboarding"+search); render(<HelmetProvider><CpmIntensiveOnboarding /></HelmetProvider>); }
beforeEach(()=>{ localStorage.clear();load.mockReset(); });
afterEach(cleanup);
describe("CPM personal attendee portal",()=>{
  it("shows no protected blocks without purchase credentials",()=>{ open(); expect(screen.getByText("Your classroom starts here.")).toBeInTheDocument();expect(screen.queryByRole("heading",{name:"Downloads."})).not.toBeInTheDocument();expect(load).not.toHaveBeenCalled(); });
  it("prioritizes a fresh Stripe return over a cached pass and removes credentials from the address",async()=>{
    localStorage.setItem(CPM_ACCESS_KEY,"old-pass");load.mockResolvedValue(state);open("?session_id=cs_live_example&access=old-url-pass");
    await screen.findByText("Verified attendee");expect(load).toHaveBeenCalledWith({session_id:"cs_live_example"});expect(window.location.search).toBe("");expect(localStorage.getItem(CPM_ACCESS_KEY)).toBe(state.access);
    expect(screen.getByRole("heading",{name:"Google Meet."})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Downloads."})).toBeInTheDocument();
    expect(screen.getByRole("link",{name:"Get P6 from Oracle ↗"})).toHaveAttribute("href","https://edelivery.oracle.com/");expect(screen.getByText("Calendar saves will be available as soon as the session timezone is confirmed. Meet links unlock one hour before each day begins.")).toBeInTheDocument();expect(screen.queryByText(/no refunds/i)).not.toBeInTheDocument();
  });
  it("shows a retry and never renders attendee content when purchase verification fails",async()=>{
    localStorage.setItem(CPM_ACCESS_KEY,"old-pass");load.mockRejectedValueOnce(new Error("Purchase verification unavailable"));open("?session_id=cs_live_new");
    await screen.findByRole("alert");expect(screen.queryByRole("heading",{name:"Downloads."})).not.toBeInTheDocument();expect(localStorage.getItem(CPM_ACCESS_KEY)).toBeNull();
    load.mockResolvedValueOnce(state);fireEvent.click(screen.getByRole("button",{name:"Try again"}));await screen.findByText("Verified attendee");expect(load).toHaveBeenCalledTimes(2);
  });
  it("accepts a personal link and closes access on this browser",async()=>{
    load.mockResolvedValue(state);open("?access=personal-token");await screen.findByText("Verified attendee");expect(load).toHaveBeenCalledWith({access:"personal-token"});
    fireEvent.click(screen.getByRole("button",{name:"Close my pass"}));await waitFor(()=>expect(screen.queryByText("Verified attendee")).not.toBeInTheDocument());expect(localStorage.getItem(CPM_ACCESS_KEY)).toBeNull();
  });
  it("renders released downloads and the live Meet from verified server state",async()=>{
    load.mockResolvedValue({...state,schedule:{...state.schedule,meet_url:null,sessions:[{id:"day-1",title:"Day 1",starts_at:"2026-09-25T14:00:00Z",ends_at:"2026-09-25T21:00:00Z",release_at:"2026-09-25T13:00:00Z",ended:false,meet_url:"https://meet.google.com/abc-defg-hij"}]},materials:{released:true,release_at:null,files:[{id:"pack",title:"Day 1 workbook",description:null,url:"https://example.com/signed-file"}]}});
    open("?access=personal-token");await screen.findByRole("link",{name:"Join Day 1 on Google Meet"});expect(screen.getByRole("link",{name:/Day 1 workbook/})).toHaveAttribute("href","https://example.com/signed-file");
  });
  it("never falls back to another attendee for an empty or invalid explicit return",()=>{expect(cpmCredentials("?session_id=","cached")).toEqual({session_id:""});expect(cpmCredentials("?access=","cached")).toEqual({access:""});});
});
