"use client";

import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("France");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          country,
          city,
          displayName: firstName || "New member",
          profileVisible: true,
          openToInternational: true
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Signup failed");
      }

      if (data?.token) {
        localStorage.setItem("global-date-token", data.token);
      }

      window.location.href = "/discover";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <h1>Create your account</h1>
        <p>Start your profile and set your dating preferences.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Ari"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              placeholder="Paris"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="country">Country</label>
            <select id="country" value={country} onChange={(event) => setCountry(event.target.value)}>
              <option>France</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Kenya</option>
              <option>United Arab Emirates</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading ? "Creating account..." : "Join Global Date"}
          </button>
        </form>
      </section>
    </div>
  );
}
