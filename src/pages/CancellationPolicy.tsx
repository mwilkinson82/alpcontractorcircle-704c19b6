import { useEffect } from "react";
import { Link } from "react-router-dom";

const HUB_PROFILE_URL = "https://app.alpcontractorcircle.com/login";

const CancellationPolicy = () => {
  useEffect(() => {
    document.title = "Cancellation Policy | ALP Contractor Circle";
  }, []);

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
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="container-narrow pt-10 md:pt-16 pb-20">
        <p className="eyebrow mb-4">Membership</p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05]">
          Cancellation Policy
        </h1>
        <p className="lede text-lg md:text-xl text-ink-soft mt-5 max-w-[46ch]">
          Contractor Circle is a month-to-month membership at $497/month. You
          can cancel any time — here is exactly how it works and what happens to
          your access.
        </p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="font-display text-xl md:text-2xl tracking-tight">
              How to cancel
            </h2>
            <p className="mt-3 text-ink-soft leading-relaxed">
              You can cancel at any time, directly from your account — no email
              or phone call required:
            </p>
            <ol className="mt-4 space-y-3 text-ink-soft">
              {[
                "Sign in to the Contractor Circle Hub.",
                "Open your Profile.",
                "Select cancel membership — your cancellation is processed securely through Stripe.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-border text-[11px] font-medium"
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <a
              href={HUB_PROFILE_URL}
              className="btn-ghost mt-6"
              target="_blank"
              rel="noreferrer"
            >
              Go to the Hub →
            </a>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="font-display text-xl md:text-2xl tracking-tight">
              Your access up to the cancellation date
            </h2>
            <p className="mt-3 text-ink-soft leading-relaxed">
              Until your cancellation takes effect, nothing changes. You keep
              full Contractor Circle access:
            </p>
            <ul className="mt-4 space-y-3 text-ink-soft">
              {[
                "All replays, templates, and tools available to you.",
                "The live calls.",
                "The Discord community.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 h-px w-4 flex-none bg-foreground/60"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="font-display text-xl md:text-2xl tracking-tight">
              What happens after you cancel
            </h2>
            <p className="mt-3 text-ink-soft leading-relaxed">
              After the cancellation date, your Contractor Circle membership
              ends and access to the replays, templates, tools, live calls, and
              Discord is turned off.
            </p>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="font-display text-xl md:text-2xl tracking-tight">
              If you use AOS or Overwatch
            </h2>
            <p className="mt-3 text-ink-soft leading-relaxed">
              Cancelling Contractor Circle does not remove you from AOS or
              Overwatch. You keep access to those applications — you simply no
              longer hold the Contractor Circle membership tier. Your account is
              downgraded to the free tier, and any further use is available
              through standard pricing from there.
            </p>
          </section>

          <section className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">
              Questions about your membership? Sign in to the{" "}
              <a
                href={HUB_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                Contractor Circle Hub
              </a>{" "}
              or reach out to the ALP team.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated July 2026.
            </p>
            <Link to="/" className="btn-ghost mt-6">
              Back to the Circle
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CancellationPolicy;
