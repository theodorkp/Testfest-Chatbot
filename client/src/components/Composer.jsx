import { useState } from 'react';

export function Composer({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue('');
  };

  return (
    <form className="mt-3 flex gap-2" onSubmit={handleSubmit}>
      <label htmlFor="chat-input" className="sr-only">
        Skriv melding
      </label>
      <input
        id="chat-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        maxLength={2000}
        placeholder="Spør om WCAG og universell utforming…"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        Send
      </button>
    </form>
  );
}
