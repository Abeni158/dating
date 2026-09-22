"use client";

import { useEffect, useState } from "react";

type Match = {
  id: string;
  userAId?: string;
  userBId?: string;
  status?: string;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("global-date-token");

    fetch("/api/matches", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Matches unavailable");
        }
        const data = await response.json();
        if (Array.isArray(data?.matches)) {
          setMatches(data.matches);
        }
      })
      .catch(() => {
        setMatches([
          { id: "1", userAId: "Nadia", userBId: "you", status: "New match" },
          { id: "2", userAId: "Alex", userBId: "you", status: "Top compatibility" },
          { id: "3", userAId: "Leila", userBId: "you", status: "Mutual interests" }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-header">
          <h2>Matches</h2>
          <span className="badge">{loading ? "Loading" : `${matches.length} active`}</span>
        </div>
      </section>

      <section className="list-grid">
        {matches.map((match) => (
          <article key={match.id} className="list-item">
            <div>
              <strong>{match.userAId ?? "Profile"}</strong>
              <span>{match.status ?? "Active"}</span>
            </div>
            <span className="badge">{match.status ?? "Matched"}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
