export default function SignupPage() {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <h1>Create your account</h1>
        <p>Start your profile and set your dating preferences.</p>

        <form className="auth-form">
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input id="firstName" type="text" placeholder="Ari" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="country">Country</label>
            <select id="country">
              <option>France</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Kenya</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Create a strong password" />
          </div>
          <button type="submit" className="primary-button full-width">Join Global Date</button>
        </form>
      </section>
    </div>
  );
}
