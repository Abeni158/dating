"use client";

import { useEffect, useState } from "react";

type Match = {
  id: string;
  userAId?: string;
  userBId?: string;
  status?: string;
};

export default function ChatPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("global-date-token");
    fetch("/api/matches", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error ?? "Unable to load matches.");
        setMatches(data.matches ?? []);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load matches."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-header">
          <h2>Chat</h2>
          <span className="badge">Matched conversations</span>
        </div>
        <p>Choose a match to start a private conversation.</p>
      </section>

      {error ? <section className="panel-card"><p className="form-error">{error}</p></section> : null}
      <section className="list-grid">
        {loading ? <article className="list-item"><strong>Loading conversations...</strong></article> : null}
        {!loading && matches.length === 0 ? <article className="list-item"><div><strong>No conversations yet</strong><span>Mutual matches will appear here.</span></div></article> : null}
        {matches.map((match) => (
          <a className="list-item" href={`/chat/${match.id}`} key={match.id}>
            <div><strong>Match conversation</strong><span>{match.status ?? "Active"}</span></div>
            <span className="badge">Open</span>
          </a>
        ))}
      </section>
    </div>
  );
}
