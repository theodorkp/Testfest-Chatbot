# Testfest-Chatbot (WCAG RAG MVP)

Et førsteutkast av en fullstack web-chatbot som svarer på spørsmål om universell utforming (WCAG) ved hjelp av lokal kunnskapsbase + Gemini API.

## Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **LLM:** Google Gemini API (`@google/generative-ai`)
- **RAG-kunnskapsbase:** Lokal JSON (`/data/wcag.json`) med enkel TF-IDF-lignende tekstsøk

## Monorepo-struktur
```txt
/client      # React app
/server      # Express API
/data        # wcag.json (kunnskapsbase)
```

## Krav
- Node.js 18+
- npm 9+

## Oppsett
1. Installer avhengigheter i hele monorepoet:
   ```bash
   npm install
   ```
2. Opprett `.env` i prosjektroten eller i `server/`.

### .env eksempel
```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=din_api_nokkel
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=development
```

> Ikke legg API-nøkler i kildekode. Appen leser nøkler via miljøvariabler.

## Kjøring
### Utvikling (server + client samtidig)
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Bygg frontend
```bash
npm run build
```

### Start backend i produksjonsmodus
```bash
npm run start
```

### Kjør tester
```bash
npm test
```

## API
### `GET /api/health`
Svar:
```json
{ "ok": true }
```

### `POST /api/chat`
Body:
```json
{ "message": "Hvordan forbedre kontrast?", "conversationId": "optional" }
```

Svar:
```json
{
  "reply": "...",
  "sources": [{ "id": "1.4.3", "title": "Kontrast (minimum)" }],
  "conversationId": "uuid"
}
```

## Hvordan RAG fungerer i dette oppsettet
1. Brukermeldingen sendes til `POST /api/chat`.
2. `wcagStore` leser `data/wcag.json` og scorer WCAG-elementer med enkel tokenisering + IDF-basert relevans.
3. Topp treff (typisk 3–5) sendes som **kontekst** inn i prompten til Gemini.
4. `promptBuilder` instruerer modellen til å:
   - svare på norsk,
   - bruke fast struktur,
   - basere seg på konteksten,
   - være tydelig ved manglende dekning.
5. Svaret returneres til klienten sammen med `sources` (id + title).

## Ekte WCAG-data
Bytt ut `data/wcag.json` med deres faktiske data i format:
```json
[
  {
    "id": "1.1.1",
    "title": "...",
    "text": "...",
    "level": "A|AA|AAA",
    "tags": ["..."]
  }
]
```

Tips:
- Hold `text` informativt og konkret.
- Bruk relevante `tags` for bedre retrieval.
- Øk datamengden gradvis og valider kvaliteten på svarene.
