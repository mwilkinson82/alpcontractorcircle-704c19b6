import { SITE } from "@/content/site";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const Pillars = [
  {
    label: "Live calls & bootcamps",
    body: "Weekly working sessions on the actual problems in your company this week. Not generic webinars.",
  },
  {
    label: "Ask Marshall",
    body: "Direct guidance from Marshall Wilkinson on bids, hires, owners, banks, and the calls you don't want to make.",
  },
  {
    label: "Replay library",
    body: "Every session, indexed and searchable. Pull the call you need the night before you need it.",
  },
  {
    label: "Templates & handbook",
    body: "The actual documents — estimating, ops, finance, hiring — already in use across the Circle.",
  },
  {
    label: "AOS access",
    body: "Augmented operating system. Unlimited workspaces and seats included with membership.",
  },
  {
    label: "Community & tools",
    body: "Operators-only room. No tire-kickers, no gurus, no recruiters.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="border-b border-border">
        <div className="container-edit pt-20 md:pt-32 pb-20 md:pb-28">
          <p className="eyebrow mb-8 animate-fade-up">ALP Contractor Circle · Est. by Marshall Wilkinson</p>
          <h1 className="display-xl text-[44px] sm:text-[64px] md:text-[88px] lg:text-[104px] max-w-[14ch] animate-fade-up">
            Build the company<br />behind the projects.
          </h1>
          <div className="mt-10 md:mt-14 grid gap-10 md:grid-cols-[1.1fr,1fr] items-end">
            <p className="lede text-xl md:text-2xl text-ink-soft max-w-[42ch] animate-fade-up">
              The project is not the business. The company is. The Circle is the operating environment for serious construction owners who are done running everything through themselves.
            </p>
            <div className="flex flex-wrap items-center gap-3 animate-fade-up">
              <a href={SITE.ctaJoinUrl} className="btn-primary">
                {SITE.ctaJoinLabel}
                <span aria-hidden>→</span>
              </a>
              <a href={SITE.portalUrl} className="btn-ghost">
                {SITE.portalLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO STRIP */}
      <section className="border-b border-border bg-paper-deep">
        <div className="container-edit py-16 md:py-20 grid gap-10 md:grid-cols-3">
          {[
            "Growth does not fix disorder.",
            "If everything flows back to the owner, the owner is still the operating system.",
            "Not motivation. Command.",
          ].map((line) => (
            <p key={line} className="font-display text-2xl md:text-[28px] leading-snug tracking-tight max-w-[24ch]">
              {line}
            </p>
          ))}
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className="border-b border-border">
        <div className="container-edit py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[280px,1fr]">
            <div>
              <p className="eyebrow mb-3">What it is</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight">A standing operating environment, not a course.</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-ink-soft max-w-[60ch]">
              <p>
                Most contractors don't need another framework PDF. They need a place where the operating
                doctrine is already running, the calls are already on the calendar, the documents are
                already written, and the room is already full of operators at the same altitude.
              </p>
              <p className="text-foreground">
                That is the Circle. One membership. Everything inside is field-tested, not theoretical.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b border-border">
        <div className="container-edit py-20 md:py-28">
          <p className="eyebrow mb-10">Included in membership</p>
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {Pillars.map((p, i) => (
              <div key={p.label} className="border-t border-border pt-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-display text-sm text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl tracking-tight">{p.label}</h3>
                </div>
                <p className="text-ink-soft leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF / PRODUCT PREVIEW PLACEHOLDER */}
      <section className="border-b border-border bg-paper-deep">
        <div className="container-edit py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-[1fr,1.2fr] items-center">
            <div>
              <p className="eyebrow mb-3">Inside the workspace</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-5">
                AOS, included.
              </h2>
              <p className="text-ink-soft leading-relaxed max-w-[44ch]">
                Every member gets full AOS access — unlimited workspaces, unlimited seats. Run your
                projects, your office, your subs, and your operating cadence inside the same system the
                Circle is built on.
              </p>
            </div>
            <div className="relative aspect-[4/3] w-full border border-border bg-background overflow-hidden">
              {/* Placeholder for product screenshot — swap with real asset */}
              <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">
                <div className="text-center">
                  <div className="eyebrow mb-2">AOS workspace</div>
                  <div className="font-display text-2xl tracking-tight text-foreground/70">Product preview</div>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="border-b border-border">
        <div className="container-edit py-20 md:py-28 grid gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">Who it's for</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight max-w-[18ch]">
              Owners who are tired of being the operating system.
            </h2>
          </div>
          <div className="space-y-4 text-lg text-ink-soft leading-relaxed max-w-[52ch]">
            <p className="text-foreground">You belong here if —</p>
            <ul className="space-y-3">
              {[
                "You run a construction business doing real volume, not a side hustle.",
                "Decisions, money, problems, and people all still flow through you.",
                "You've read the books, taken the courses, and you're done with theory.",
                "You want a room of operators, not an audience of beginners.",
              ].map((l) => (
                <li key={l} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-px w-4 bg-foreground/60 flex-none" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CLOSER */}
      <section>
        <div className="container-edit py-24 md:py-36 text-center">
          <p className="eyebrow mb-8">Join the Circle</p>
          <h2 className="display-xl text-4xl md:text-6xl lg:text-7xl max-w-[18ch] mx-auto">
            Not theory. Field-tested operating doctrine.
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <a href={SITE.ctaJoinUrl} className="btn-primary">
              {SITE.ctaJoinLabel}
              <span aria-hidden>→</span>
            </a>
            <a href={SITE.portalUrl} className="btn-ghost">
              {SITE.portalLabel}
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Membership includes AOS · live calls · bootcamps · replay library · templates · community.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Index;
