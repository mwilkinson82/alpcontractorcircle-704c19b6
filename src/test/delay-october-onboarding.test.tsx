import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import DelayIntensiveOnboarding from "@/pages/DelayIntensiveOnboarding";
import { buildPreviewPortalState, loadPortal } from "@/lib/intensive-portal";
import { octoberDelaySessions } from "../../supabase/functions/_shared/delay-confirmation-cohort";

vi.mock("@/lib/intensive-portal", async (original) => ({
  ...await original<typeof import("@/lib/intensive-portal")>(), loadPortal: vi.fn(),
}));

it("opens an October checkout with pending resources and correct calendar dates", async () => {
  const state = buildPreviewPortalState("purchaser");
  state.cohort = { id: "delay-2026-10", dates: "October 16-18, 2026", sessions: octoberDelaySessions.map(s => ({ ...s, room_url: null, room_status: "pending" })) };
  state.materials = { released: false, release_at: null, files: [], zoom_url: null };
  vi.mocked(loadPortal).mockResolvedValue(state);
  window.localStorage.setItem("alp.delay-intensive.access", "unrelated-previous-pass");
  window.history.replaceState({}, "", "/delay-intensive/onboarding?session_id=cs_live_synthetic");
  const { container } = render(<MemoryRouter><DelayIntensiveOnboarding /></MemoryRouter>);
  expect(await screen.findByRole("heading", { name: /October 16-18, 2026/ })).toBeInTheDocument();
  expect(loadPortal).toHaveBeenCalledWith(undefined, "cs_live_synthetic");
  expect(container.textContent).not.toMatch(/September|Invalid Date/);
  expect(screen.getByText("Release details pending")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Open live room" })).not.toBeInTheDocument();
  const calendar = screen.getAllByRole("link", { name: "Add to Google Calendar" });
  expect(calendar).toHaveLength(3);
  for (const [i, link] of calendar.entries()) {
    const url = new URL(link.getAttribute("href")!);
    expect(url.searchParams.get("dates")).toBe(`${octoberDelaySessions[i].start}/${octoberDelaySessions[i].end}`);
    expect(url.searchParams.get("details")).toContain("pending confirmation");
  }
});
