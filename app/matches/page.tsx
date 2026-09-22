export default function MatchesPage() {
  const matches = [
    { name: "Nadia", city: "Cairo", status: "New match" },
    { name: "Alex", city: "Berlin", status: "Top compatibility" },
    { name: "Leila", city: "Amman", status: "Mutual interests" }
  ];

  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-header">
          <h2>Matches</h2>
          <span className="badge">3 active</span>
        </div>
      </section>

      <section className="list-grid">
        {matches.map((match) => (
          <article key={match.name} className="list-item">
            <div>
              <strong>{match.name}</strong>
              <span>{match.city}</span>
            </div>
            <span className="badge">{match.status}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
