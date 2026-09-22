const featureHighlights = [
  {
    title: "Discovery",
    text: "Nearby, city, country, continent, and worldwide matching with privacy-safe filters."
  },
  {
    title: "AI Matchmaking",
    text: "Compatibility explanations and recommendation logic without sensitive or opaque profiling."
  },
  {
    title: "Trust & Safety",
    text: "Verification, moderation, reporting, blocking, and high-risk assessment workflows."
  }
];

const categoryCards = [
  "Nearby",
  "International",
  "Video Dating",
  "Professionals",
  "Verified Profiles",
  "Astrology"
];

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="eyebrow">GLOBAL DATE</div>
        <h1>Dating designed for connection across borders.</h1>
        <p>
          A production-ready international dating platform foundation built around discovery,
          safety, subscriptions, AI guidance, and global matching architecture.
        </p>
        <div className="cta-row">
          <a href="/discover" className="primary-button">Explore platform</a>
          <a href="/signup" className="secondary-button">Create account</a>
        </div>
      </section>

      <section className="info-panel">
        <div>
          <div className="stat-label">Daily discovery limit</div>
          <div className="stat-value">10 actions</div>
        </div>
        <div>
          <div className="stat-label">Open to international</div>
          <div className="stat-value">Opt-in privacy</div>
        </div>
        <div>
          <div className="stat-label">Verification</div>
          <div className="stat-value">Multi-step</div>
        </div>
      </section>

      <section id="features" className="grid three-up">
        {featureHighlights.map((feature) => (
          <article key={feature.title} className="feature-card">
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <section className="panel-card">
        <div className="section-header">
          <h2>Explore categories</h2>
        </div>
        <div className="chip-grid">
          {categoryCards.map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
