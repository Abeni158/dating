export default function ProfilePage() {
  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-header">
          <h2>Profile</h2>
          <span className="badge">Profile complete</span>
        </div>
        <div className="list-grid">
          <div className="list-item">
            <div>
              <strong>Basic info</strong>
              <span>Age, location, relationship goals</span>
            </div>
            <span className="badge">Ready</span>
          </div>
          <div className="list-item">
            <div>
              <strong>Photos</strong>
              <span>Primary gallery and AI quality checks</span>
            </div>
            <span className="badge">3 uploaded</span>
          </div>
          <div className="list-item">
            <div>
              <strong>Privacy</strong>
              <span>Location safety and international opt-in</span>
            </div>
            <span className="badge">Enabled</span>
          </div>
        </div>
      </section>
    </div>
  );
}
