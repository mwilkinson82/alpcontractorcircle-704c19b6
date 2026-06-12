import { Link } from "react-router-dom";
import { LEAD_MAGNETS, type LeadMagnetKey } from "@/content/site";
import LeadForm from "@/components/LeadForm";

interface Props { magnet: LeadMagnetKey }

const LeadMagnet = ({ magnet }: Props) => {
  const m = LEAD_MAGNETS[magnet];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container-edit h-14 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-base leading-none">ALP</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Contractor Circle
            </span>
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Home</Link>
        </div>
      </header>

      <main className="container-narrow pt-10 md:pt-16 pb-20">
        <p className="eyebrow mb-4">{m.eyebrow}</p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05]">
          {m.title}
        </h1>
        <p className="lede text-lg md:text-xl text-ink-soft mt-5 max-w-[36ch]">
          {m.subtitle}
        </p>

        <div className="mt-8 md:mt-10 border border-border bg-card p-5 md:p-7">
          <LeadForm
            source={m.slug}
            cta={m.cta}
            thanksTitle={m.thanks}
            thanksBody="If you don't see it in a few minutes, check spam or promotions."
          />
        </div>

        <div className="mt-12">
          <p className="eyebrow mb-4">What you'll get</p>
          <ul className="space-y-3 text-ink-soft">
            {m.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <span aria-hidden className="mt-2 h-px w-4 bg-foreground/60 flex-none" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            This is one piece of what's inside the Contractor Circle — the operating environment
            for serious construction owners.
          </p>
          <Link to="/" className="btn-ghost mt-4">See the Circle</Link>
        </div>
      </main>
    </div>
  );
};

export default LeadMagnet;
