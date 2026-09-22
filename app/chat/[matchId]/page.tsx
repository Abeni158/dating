"use client";

import { FormEvent, useEffect, useState } from "react";

type Message = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export default function ConversationPage({ params }: { params: { matchId: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("global-date-token");
    fetch(`/api/chat/${params.matchId}/messages`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error ?? "Unable to load conversation.");
        setMessages(data.messages ?? []);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load conversation."))
      .finally(() => setLoading(false));
  }, [params.matchId]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;

    setSending(true);
    setError("");
    const token = localStorage.getItem("global-date-token");

    try {
      const response = await fetch(`/api/chat/${params.matchId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ body })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Unable to send message.");
      setMessages((current) => [...current, data.message]);
      setBody("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-header">
          <div>
            <h2>Conversation</h2>
            <p>Messages are only available to members of this match.</p>
          </div>
          <a href="/chat" className="secondary-button">Back to chat</a>
        </div>
      </section>

      <section className="panel-card chat-panel">
        {loading ? <p>Loading messages...</p> : null}
        {!loading && messages.length === 0 ? <p className="empty-state">Start the conversation with a thoughtful hello.</p> : null}
        <div className="message-list" aria-live="polite">
          {messages.map((message) => (
            <article className="message-bubble" key={message.id}>
              <p>{message.body}</p>
              <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time>
            </article>
          ))}
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <form className="message-form" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="message">Message</label>
          <input id="message" value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} placeholder="Write a message..." />
          <button className="primary-button" type="submit" disabled={sending || !body.trim()}>{sending ? "Sending..." : "Send"}</button>
        </form>
      </section>
    </div>
  );
}
