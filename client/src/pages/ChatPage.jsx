import { useState } from 'react';
import { MessageList } from '../components/MessageList';
import { Composer } from '../components/Composer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hei! Jeg kan hjelpe deg med universell utforming og WCAG basert på kunnskapsbasen.',
    },
  ]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (text) => {
    setError('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Ukjent feil ved sending av melding.');
      }

      setConversationId(payload.conversationId);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: payload.reply, sources: payload.sources || [] },
      ]);
    } catch (err) {
      setError(err.message || 'Noe gikk galt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 md:py-10">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">WCAG Chatbot (MVP)</h1>
        <p className="text-sm text-slate-600">Få forklaringer og tiltak for universell utforming.</p>
      </header>

      <MessageList messages={messages} loading={loading} />
      {error && (
        <p className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <Composer onSend={handleSend} disabled={loading} />
    </main>
  );
}
