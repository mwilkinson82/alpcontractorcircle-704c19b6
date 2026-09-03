import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DelayIntensiveOnboarding from "@/pages/DelayIntensiveOnboarding";

function renderPreview(preview: string) {
  window.history.replaceState({}, "", `/delay-intensive/onboarding?preview=${preview}`);
  return render(
    <MemoryRouter>
      <DelayIntensiveOnboarding />
    </MemoryRouter>,
  );
}

describe("Delay Intensive onboarding portal passes", () => {
  it("shows the claim form on preview=1 (purchaser)", () => {
    renderPreview("1");
    expect(screen.getByText("ALP-8F2A91C4")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /put one live claim in front of marshall/i })).toBeInTheDocument();
    expect(screen.getByText(/submit for marshall's review/i)).toBeInTheDocument();
    expect(screen.getByText("Live claim")).toBeInTheDocument();
    expect(screen.getByText("Purchaser")).toBeInTheDocument();
    expect(screen.getByText("The working agenda")).toBeInTheDocument();
  });

  it("hides every claim CTA on preview=named-seat", () => {
    renderPreview("named-seat");
    expect(screen.getByText("ALP-A1B2C3D4")).toBeInTheDocument();
    expect(screen.getByText("Jordan Superintendent")).toBeInTheDocument();
    expect(screen.getByText("The working agenda")).toBeInTheDocument();
    expect(screen.getByText(/your materials are protected/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /put one live claim in front of marshall/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/submit for marshall's review/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/submit live claim/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Live claim")).not.toBeInTheDocument();
    expect(screen.queryByText(/supporting files/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/you may submit one active claim/i)).not.toBeInTheDocument();
    const attendeeLabels = screen.getAllByText("Attendee");
    expect(attendeeLabels.length).toBeGreaterThan(0);
    expect(screen.queryByText("Purchaser")).not.toBeInTheDocument();
  });
});
