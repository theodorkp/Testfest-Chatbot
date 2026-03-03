const joinCriteria = (context) =>
  context.map((item) => `- ${item.id} ${item.title}`).join('\n');

const joinActions = (context) =>
  context
    .slice(0, 4)
    .map((item) => `- Gå gjennom ${item.id} (${item.title}) og oppdater løsning i tråd med kravene.`)
    .join('\n');

export const buildFallbackReply = ({ message, context }) => {
  if (!context.length) {
    return `Kort svar:\nJeg er usikker fordi jeg ikke fant tydelig dekning i den lokale WCAG-kunnskapsbasen for spørsmålet ditt.\n\nForklaring:\nJeg fant ingen relevante WCAG-treff for: "${message}".\n\nForslag til tiltak:\n- Presiser spørsmålet med hva slags komponent eller side det gjelder.\n- Beskriv brukerreisen (f.eks. skjema, navigasjon, media).\n- Legg inn flere relevante WCAG-oppføringer i kunnskapsbasen.\n\nRelevante WCAG-kriterier:\n- Ingen direkte treff i kunnskapsbasen`;
  }

  return `Kort svar:\nGemini var midlertidig utilgjengelig, men jeg fant relevante WCAG-kriterier i kunnskapsbasen som kan brukes videre.\n\nForklaring:\nBasert på spørsmålet ditt ("${message}") matcher disse kriteriene best med tilgjengelig kontekst.\n\nForslag til tiltak:\n${joinActions(context)}\n\nRelevante WCAG-kriterier:\n${joinCriteria(context)}`;
};
