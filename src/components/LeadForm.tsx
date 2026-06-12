import { useState } from "react";
import { captureLead, type LeadSource } from "@/lib/leads";

interface Props {
  source: LeadSource;
  cta: string;
  thanksTitle: string;
  thanksBody?: string;
}

export const LeadForm = ({ source, cta, thanksTitle, thanksBody }: Props) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await captureLead({ first_name: firstName, email, source });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <div className="border border-border bg-card p-6 md:p-8 animate-fade-up">
        <p className="eyebrow mb-2">Confirmed</p>
        <h3 className="font-display text-2xl md:text-3xl tracking-tight">{thanksTitle}</h3>
        {thanksBody && <p className="mt-3 text-muted-foreground">{thanksBody}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow block mb-1">First name</span>
          <input
            type="text"
            required
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="field"
            placeholder="Marshall"
          />
        </label>
        <label className="block">
          <span className="eyebrow block mb-1">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="you@company.com"
          />
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full sm:w-auto disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : cta}
      </button>
      <p className="text-xs text-muted-foreground">
        No spam. Unsubscribe anytime. We respect existing suppressions.
      </p>
    </form>
  );
};

export default LeadForm;
