import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-box">
        <h2 className="cta-title">
          Get things done on campus — faster.
        </h2>

        <p className="cta-subtitle">
          Request, accept, and deliver essentials within your campus
          community — simple, quick, reliable.
        </p>

        <div className="cta-actions">
          <Link to="/register" className="cta-primary">
            Join CampusAssist
          </Link>

          <Link to="/login" className="cta-secondary">
            Learn how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
