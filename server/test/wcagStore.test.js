import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WcagStore } from '../src/services/wcagStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../../data/wcag.json');

const store = new WcagStore(dataPath);

test('finder relevante treff for alt-tekst', () => {
  const results = store.search('Hvordan får jeg bedre alt-tekst for bilder?', 3);
  assert.ok(results.length > 0);
  assert.equal(results[0].id, '1.1.1');
});

test('returnerer tom liste for tomt søk', () => {
  const results = store.search(' ', 3);
  assert.deepEqual(results, []);
});
