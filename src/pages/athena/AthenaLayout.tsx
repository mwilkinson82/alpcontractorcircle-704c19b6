import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./Athena.css";

const TOKEN = /(\*\*[^*]+\*\*|\[(?:NEEDS MARSHALL|optional):[^\]]*\]|\/athena\/(?:privacy|terms|support))/g;

/** Renders **bold**, visible [NEEDS MARSHALL: ...] placeholders and /athena/* links. */
export function R({ children }: { children: string }) {
  const parts = children.split(TOKEN);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("[")) return <span key={i} className="athena-placeholder">{p}</span>;
        if (p.startsWith("/athena/")) return <Link key={i} to={p} className="athena-link">{p}</Link>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

export function AthenaLayout({ title, description, legal, children }: { title: string; description: string; legal?: boolean; children: ReactNode }) {
  return (
    <div className="athena">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="athena-top">
        <Link to="/athena" className="athena-brand">Athena by ALP</Link>
      </header>
      <main className="athena-main">{children}</main>
      <footer className="athena-footer">
        {legal ? (
          <Link to="/athena" className="athena-link">← Back to Athena by ALP</Link>
        ) : (
          <p>
            Athena by ALP · <R>{"[NEEDS MARSHALL: legal entity name]"}</R> ·{" "}
            <Link to="/athena/privacy" className="athena-link">Privacy</Link> ·{" "}
            <Link to="/athena/terms" className="athena-link">Terms</Link> ·{" "}
            <Link to="/athena/support" className="athena-link">Support</Link>
          </p>
        )}
      </footer>
    </div>
  );
}

export function List({ items }: { items: string[] }) {
  return <ul className="athena-list">{items.map((t) => <li key={t}><R>{t}</R></li>)}</ul>;
}
