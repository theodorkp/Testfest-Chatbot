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