export function MessageBubble({ role, text, sources }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
        {!isUser && sources?.length > 0 && (
          <div className="mt-3 border-t border-slate-200 pt-2 text-xs text-slate-600">
            <p className="font-semibold">Kilder:</p>
            <ul className="list-inside list-disc">
              {sources.map((source) => (
                <li key={`${source.id}-${source.title}`}>
                  {source.id} – {source.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
