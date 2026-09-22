export default function ChatPage() {
  const conversations = [
    { name: "Omar", preview: "Would love to plan a coffee date next week.", time: "2m ago" },
    { name: "Zuri", preview: "I’m in Paris for a few more days this month.", time: "16m ago" },
    { name: "Karin", preview: "Your travel photos are amazing — where was that?", time: "1h ago" }
  ];

  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-header">
          <h2>Chat</h2>
          <span className="badge">Online now</span>
        </div>
      </section>

      <section className="list-grid">
        {conversations.map((conversation) => (
          <article key={conversation.name} className="list-item">
            <div>
              <strong>{conversation.name}</strong>
              <span>{conversation.preview}</span>
            </div>
            <span>{conversation.time}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
