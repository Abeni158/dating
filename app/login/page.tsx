export default function LoginPage() {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <h1>Welcome back</h1>
        <p>Log in to continue discovering and connecting.</p>

        <form className="auth-form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="form-actions">
            <a href="/signup">Create account</a>
            <button type="submit" className="primary-button full-width">Log in</button>
          </div>
        </form>
      </section>
    </div>
  );
}
