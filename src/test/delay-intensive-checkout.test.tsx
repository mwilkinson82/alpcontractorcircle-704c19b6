import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, vi } from "vitest";
import DelayIntensive from "@/pages/DelayIntensive";

const STANDARD_WINDOW = new Date("2026-10-03T14:00:00Z").getTime();

const EARLY_CHECKOUT = [
  "https://buy.stripe.com/6oU4gA8FX1eC67K6vgeQM1f",
  "https://buy.stripe.com/4gMeVef4lbTgbs48DoeQM1g",
  "https://buy.stripe.com/fZu9AU8FX9L853Gg5QeQM1i",
  "https://buy.stripe.com/9B63cw7BT3mK8fS1aWeQM1h",
];

const STANDARD = {
  public: {
    individual: "https://buy.stripe.com/5kQdRaf4lbTg2Vy9HseQM1j",
    company: "https://buy.stripe.com/4gM28s5tL7D0gMog5QeQM1k",
  },
  member: {
    individual: "https://buy.stripe.com/cNieVe7BT1eC2Vy7zkeQM1l",
    company: "https://buy.stripe.com/8x2cN609r1eC9jW1aWeQM1m",
  },
} as const;

function renderPage(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <DelayIntensive />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function seatCheckout(name: string) {
  const link = screen.getByRole("link", { name });
  const card = link.closest("article");
  if (!card) throw new Error(`${name} is not inside a pricing card`);
  return { link, card };
}

describe("Delay Intensive standard checkout links", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderDuringStandardTuition(path: string) {
    vi.spyOn(Date, "now").mockReturnValue(STANDARD_WINDOW);
    return renderPage(path);
  }

  it("opens the public $3,500 and $5,000 standard links", () => {
    renderDuringStandardTuition("/delay-intensive");

    const individual = seatCheckout("Reserve my seat");
    const company = seatCheckout("Reserve the company pass");

    expect(individual.card).toHaveTextContent("$3,500");
    expect(individual.link).toHaveAttribute("href", expect.stringContaining(STANDARD.public.individual));
    expect(company.card).toHaveTextContent("$5,000");
    expect(company.link).toHaveAttribute("href", expect.stringContaining(STANDARD.public.company));

    for (const reserve of screen.getAllByRole("link", { name: "Reserve your seat" })) {
      expect(reserve).toHaveAttribute("href", "#enroll");
    }

    const html = document.body.innerHTML;
    for (const url of EARLY_CHECKOUT) expect(html).not.toContain(url);
    expect(html).not.toContain(STANDARD.member.individual);
    expect(html).not.toContain(STANDARD.member.company);
  });

  it("opens the member $2,800 and $4,000 standard links", () => {
    renderDuringStandardTuition("/delay-intensive/member");

    const individual = seatCheckout("Reserve my seat");
    const company = seatCheckout("Reserve the company pass");

    expect(individual.card).toHaveTextContent("$2,800");
    expect(individual.link).toHaveAttribute("href", expect.stringContaining(STANDARD.member.individual));
    expect(company.card).toHaveTextContent("$4,000");
    expect(company.link).toHaveAttribute("href", expect.stringContaining(STANDARD.member.company));

    for (const reserve of screen.getAllByRole("link", { name: "Reserve your seat" })) {
      expect(reserve).toHaveAttribute("href", "#enroll");
    }

    const html = document.body.innerHTML;
    for (const url of EARLY_CHECKOUT) expect(html).not.toContain(url);
    expect(html).not.toContain(STANDARD.public.individual);
    expect(html).not.toContain(STANDARD.public.company);
  });
});
