import { Link } from "react-router-dom";
import { SITE } from "@/content/site";

export const SiteNav = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container-edit flex h-16 items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg leading-none tracking-tight">ALP</span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Contractor Circle
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <a
            href={SITE.portalUrl}
            className="hidden text-muted-foreground hover:text-foreground transition-colors sm:inline"
          >
            {SITE.portalLabel}
          </a>
          <a href={SITE.ctaJoinUrl} className="btn-primary text-xs px-4 py-2.5">
            {SITE.ctaJoinLabel}
          </a>
        </nav>
      </div>
    </header>
  );
};

export default SiteNav;
