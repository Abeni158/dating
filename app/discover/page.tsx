export default function DiscoverPage() {
  const profiles = [
    { name: "Mila", city: "Paris", status: "Open to international" },
    { name: "Ammar", city: "Dubai", status: "Verified" },
    { name: "Sofia", city: "Barcelona", status: "Travel lover" }
  ];

  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-header">
          <h2>Discover</h2>
          <span className="badge">10 actions left today</span>
        </div>
        <div className="chip-grid">
          <span className="chip">Nearby</span>
          <span className="chip">City</span>
          <span className="chip">Country</span>
          <span className="chip">Continent</span>
          <span className="chip">Worldwide</span>
        </div>
      </section>

      <section className="list-grid">
        {profiles.map((profile) => (
          <article key={profile.name} className="list-item">
            <div>
              <strong>{profile.name}</strong>
              <span>{profile.city}</span>
            </div>
            <span className="badge">{profile.status}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
