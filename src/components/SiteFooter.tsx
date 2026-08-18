import { Link } from "react-router-dom";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container-edit py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-display text-base">ALP Contractor Circle</div>
          <p className="text-xs text-muted-foreground mt-1">
            Build the company behind the projects.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <Link to="/estimating" className="hover:text-foreground">Estimating</Link>
          <Link to="/q2" className="hover:text-foreground">Q1/Q2</Link>
          <Link to="/silos" className="hover:text-foreground">Three Silos</Link>
          <Link to="/cancellation-policy" className="hover:text-foreground">Cancellation Policy</Link>
          <a href="https://app.alpcontractorcircle.com/login" className="hover:text-foreground">Sign in</a>
          <a href="https://altitudelogicpressure.com" className="hover:text-foreground">ALP</a>
          <a href="https://alphandbook.com" className="hover:text-foreground">ALP Handbook</a>
          <a href="https://alpos.alpcontractorcircle.com" className="hover:text-foreground">AOS</a>
          <a href="https://overwatch.alpcontractorcircle.com/about" className="hover:text-foreground">OverWatch</a>
          <a href="https://marshallwilkinson.com" className="hover:text-foreground">Marshall Wilkinson</a>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ALP
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
