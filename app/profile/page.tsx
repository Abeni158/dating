"use client";

import { useEffect, useState } from "react";

type UserProfile = {
  id: string;
  email?: string;
  firstName?: string | null;
  displayName?: string | null;
  country?: string | null;
  city?: string | null;
  bio?: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("global-date-token");

    fetch("/api/profile", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Profile unavailable");
        }
        const data = await response.json();
        setProfile(data?.user ?? null);
      })
      .catch(() => {
        setProfile({
          id: "demo-user",
          firstName: "Ari",
          displayName: "Ari",
          country: "France",
          city: "Paris",
          bio: "Looking for a thoughtful connection and meaningful travel plans."
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-header">
          <h2>Profile</h2>
          <span className="badge">{loading ? "Loading" : "Profile complete"}</span>
        </div>
        {profile ? (
          <div className="list-grid">
            <div className="list-item">
              <div>
                <strong>{profile.displayName ?? profile.firstName ?? "Member"}</strong>
                <span>{profile.city ?? "Unknown city"}{profile.country ? `, ${profile.country}` : ""}</span>
              </div>
              <span className="badge">Ready</span>
            </div>
            <div className="list-item">
              <div>
                <strong>Bio</strong>
                <span>{profile.bio ?? "Add a short intro to help people connect."}</span>
              </div>
              <span className="badge">Updated</span>
            </div>
            <div className="list-item">
              <div>
                <strong>Privacy</strong>
                <span>Location safety and international opt-in</span>
              </div>
              <span className="badge">Enabled</span>
            </div>
          </div>
        ) : (
          <p>No profile yet.</p>
        )}
      </section>
    </div>
  );
}
