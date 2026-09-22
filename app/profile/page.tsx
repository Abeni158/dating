"use client";

import { FormEvent, useEffect, useState } from "react";

type ProfileData = {
  firstName: string;
  displayName: string;
  city: string;
  country: string;
  bio: string;
  occupation: string;
  relationshipGoal: string;
  openToInternational: boolean;
};

const emptyProfile: ProfileData = {
  firstName: "", displayName: "", city: "", country: "", bio: "", occupation: "", relationshipGoal: "", openToInternational: false
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("global-date-token");
    fetch("/api/profile", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(async (response) => {
        if (!response.ok) throw new Error("Please log in to edit your profile.");
        const data = await response.json();
        const user = data.user;
        const detail = user.profile ?? {};
        setProfile({
          firstName: user.firstName ?? "", displayName: user.displayName ?? "", city: user.city ?? "", country: user.country ?? "",
          bio: user.bio ?? "", occupation: detail.occupation ?? "", relationshipGoal: detail.relationshipGoal ?? "", openToInternational: Boolean(user.openToInternational)
        });
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Unable to load profile."))
      .finally(() => setLoading(false));
  }, []);

  function update(field: keyof ProfileData, value: string | boolean) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setStatus("");
    const token = localStorage.getItem("global-date-token");
    try {
      const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(profile) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to save profile.");
      setStatus("Profile saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save profile.");
    } finally { setSaving(false); }
  }

  if (loading) return <div className="page-stack"><section className="panel-card"><p>Loading profile...</p></section></div>;

  return <div className="page-stack"><section className="panel-card"><h2>Edit profile</h2><p>Only the information you choose to share is used for discovery.</p>
    <form className="auth-form" onSubmit={save}>
      {(["firstName", "displayName", "city", "country", "occupation", "relationshipGoal"] as const).map((field) => <div className="field" key={field}><label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</label><input id={field} value={profile[field]} onChange={(event) => update(field, event.target.value)} /></div>)}
      <div className="field"><label htmlFor="bio">Bio</label><textarea id="bio" value={profile.bio} maxLength={500} onChange={(event) => update("bio", event.target.value)} /></div>
      <label className="checkbox-row"><input type="checkbox" checked={profile.openToInternational} onChange={(event) => update("openToInternational", event.target.checked)} /> Open to international dating</label>
      {status ? <p className="form-error">{status}</p> : null}
      <button className="primary-button full-width" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
    </form>
  </section></div>;
}
