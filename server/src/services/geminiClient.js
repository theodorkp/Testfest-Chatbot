import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
  constructor({ apiKey, model = 'gemini-1.5-flash' }) {
    this.enabled = Boolean(apiKey);
    this.modelName = model;

    if (this.enabled) {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: this.modelName });
    }
  }

  async generate({ systemInstruction, userPrompt }) {
    if (!this.enabled) {
      return 'Gemini API-nøkkel mangler. Legg inn GEMINI_API_KEY i .env for å få AI-svar.';
    }

    try {
      const result = await this.model.generateContent({
        systemInstruction,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      });

      return result.response.text();
    } catch (error) {
      console.error('Gemini request failed:', error.message);
      throw new Error('Kunne ikke hente svar fra Gemini akkurat nå.');
    }
  }
}
