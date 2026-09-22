"use client";

import { useEffect, useState } from "react";

type CandidateProfile = {
  id: string;
  displayName: string;
  country?: string | null;
  city?: string | null;
  bio?: string | null;
  openToInternational?: boolean | null;
};

const fallbackProfiles: CandidateProfile[] = [
  { id: "1", displayName: "Mila", country: "France", city: "Paris", bio: "Travel lover and design enthusiast.", openToInternational: true },
  { id: "2", displayName: "Ammar", country: "UAE", city: "Dubai", bio: "Engineer with a love for culture and meaningful conversations.", openToInternational: true },
  { id: "3", displayName: "Sofia", country: "Spain", city: "Barcelona", bio: "Creative, social, and always planning the next trip.", openToInternational: true }
];

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<CandidateProfile[]>(fallbackProfiles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("global-date-token");
    fetch("/api/discovery", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Discovery not available");
        }
        const data = await response.json();
        if (Array.isArray(data?.profiles) && data.profiles.length > 0) {
          setProfiles(data.profiles);
        }
      })
      .catch(() => {
        setProfiles(fallbackProfiles);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
        {loading ? (
          <article className="list-item"><div><strong>Loading matches...</strong></div></article>
        ) : (
          profiles.map((profile) => (
            <article key={profile.id} className="list-item">
              <div>
                <strong>{profile.displayName}</strong>
                <span>
                  {profile.city ?? "Unknown city"}
                  {profile.country ? `, ${profile.country}` : ""}
                </span>
              </div>
              <span className="badge">{profile.openToInternational ? "Open to international" : "Nearby"}</span>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
