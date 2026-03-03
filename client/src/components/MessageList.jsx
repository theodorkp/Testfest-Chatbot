import { MessageBubble } from './MessageBubble';

export function MessageList({ messages, loading }) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3 md:p-4">
      {messages.map((message, index) => (
        <MessageBubble key={`${message.role}-${index}`} {...message} />
      ))}
      {loading && (
        <div className="text-sm text-slate-500" aria-live="polite">
          Bot skriver…
        </div>
      )}
    </div>
  );
}
