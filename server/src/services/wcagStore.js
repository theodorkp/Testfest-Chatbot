import fs from 'node:fs';
import path from 'node:path';

const STOP_WORDS = new Set([
  'og', 'i', 'på', 'for', 'med', 'av', 'til', 'en', 'et', 'den', 'det', 'de', 'som',
  'er', 'kan', 'skal', 'om', 'å', 'hvordan', 'hva', 'hvor', 'når', 'the', 'a', 'an',
]);

const tokenize = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

export class WcagStore {
  constructor(dataPath) {
    const resolvedPath = path.resolve(dataPath);
    const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
    this.items = JSON.parse(fileContent);

    if (!Array.isArray(this.items)) {
      throw new Error('wcag.json must be an array');
    }

    this.documents = this.items.map((item) => {
      const text = `${item.id} ${item.title} ${item.level} ${(item.tags || []).join(' ')} ${item.text}`;
      const tokens = tokenize(text);
      const termFreq = tokens.reduce((acc, token) => {
        acc[token] = (acc[token] || 0) + 1;
        return acc;
      }, {});

      return { item, tokens, termFreq };
    });

    this.idf = this.buildIdf();
  }

  buildIdf() {
    const docFrequency = {};

    this.documents.forEach((doc) => {
      new Set(doc.tokens).forEach((token) => {
        docFrequency[token] = (docFrequency[token] || 0) + 1;
      });
    });

    const documentCount = this.documents.length;
    const idf = {};

    Object.entries(docFrequency).forEach(([token, count]) => {
      idf[token] = Math.log((documentCount + 1) / (count + 1)) + 1;
    });

    return idf;
  }

  search(query, maxResults = 4) {
    const queryTokens = tokenize(query);

    if (!queryTokens.length) {
      return [];
    }

    const queryTermFreq = queryTokens.reduce((acc, token) => {
      acc[token] = (acc[token] || 0) + 1;
      return acc;
    }, {});

    const scored = this.documents
      .map((doc) => {
        let score = 0;

        Object.entries(queryTermFreq).forEach(([token, qtf]) => {
          const docTf = doc.termFreq[token] || 0;
          if (!docTf) return;

          const tokenIdf = this.idf[token] || 0;
          score += qtf * docTf * tokenIdf;
        });

        return { ...doc.item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    return scored;
  }
}
