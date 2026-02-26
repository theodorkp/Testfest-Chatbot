import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
import { WcagStore } from './services/wcagStore.js';
import { GeminiClient } from './services/geminiClient.js';
import { buildPrompt } from './services/promptBuilder.js';
import { validateMessage } from './utils/validation.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wcagDataPath = path.resolve(__dirname, '../../data/wcag.json');

const wcagStore = new WcagStore(wcagDataPath);
const geminiClient = new GeminiClient({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
});

const conversations = new Map();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '200kb' }));
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  const { message, conversationId } = req.body ?? {};
  const validationError = validateMessage(message);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const safeConversationId = conversationId || randomUUID();
  const context = wcagStore.search(message, 5);

  const snippet = message.trim().slice(0, 120);
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[chat] conversation=${safeConversationId}, snippet="${snippet}"`);
  }

  const history = conversations.get(safeConversationId) || [];
  history.push({ role: 'user', message: snippet, ts: Date.now() });
  conversations.set(safeConversationId, history.slice(-20));

  const { systemInstruction, userPrompt } = buildPrompt({ message, context });

  try {
    const reply = await geminiClient.generate({ systemInstruction, userPrompt });
    return res.json({
      reply,
      sources: context.map(({ id, title }) => ({ id, title })),
      conversationId: safeConversationId,
    });
  } catch (error) {
    return res.status(502).json({
      error: 'AI-tjenesten er midlertidig utilgjengelig. Prøv igjen om litt.',
      conversationId: safeConversationId,
      sources: context.map(({ id, title }) => ({ id, title })),
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
