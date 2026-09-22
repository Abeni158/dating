export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="eyebrow">GLOBAL DATE</div>
        <h1>Dating designed for connection across borders.</h1>
        <p>
          A production-ready international dating platform concept with modular discovery,
          safety, subscriptions, AI guidance, and global matching architecture.
        </p>
        <div className="cta-row">
          <a href="#features" className="primary-button">Explore platform</a>
          <button type="button" className="secondary-button">View roadmap</button>
        </div>
      </section>

      <section id="features" className="grid three-up">
        <article className="feature-card">
          <h2>Discovery</h2>
          <p>Nearby, city, country, continent, and worldwide matching with privacy-safe filters.</p>
        </article>
        <article className="feature-card">
          <h2>AI Matchmaking</h2>
          <p>Compatibility explanations and recommendation logic without opaque or sensitive inference.</p>
        </article>
        <article className="feature-card">
          <h2>Trust & Safety</h2>
          <p>Verification, moderation, reporting, blocking, and risk assessment flows.</p>
        </article>
      </section>
    </main>
  );
}
