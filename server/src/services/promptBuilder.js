const formatSource = (source) => `- [${source.id}] ${source.title} (nivå ${source.level})\n${source.text}`;

export const buildPrompt = ({ message, context }) => {
  const contextText = context.length
    ? context.map(formatSource).join('\n\n')
    : 'Ingen relevante WCAG-oppføringer ble funnet i kunnskapsbasen.';

  const systemInstruction = `Du er en norsk UU/WCAG-rådgiver for et chatbot-MVP.
Svar på norsk og bruk følgende struktur:
1. Kort svar (1-3 setninger)
2. Forklaring
3. Forslag til tiltak (punktliste)
4. Relevante WCAG-kriterier (liste med id + tittel)

Regler:
- Basér deg kun på konteksten når det er mulig.
- Hvis kontekst mangler/er utilstrekkelig, si tydelig at du er usikker.
- Ikke finn på WCAG-kriterier.
- Gi konkrete forbedringstiltak som kan gjennomføres i praksis.`;

  const userPrompt = `Brukerspørsmål: ${message}\n\nKontekst fra WCAG-databasen:\n${contextText}`;

  return { systemInstruction, userPrompt };
};
