import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';

const app = express();

app.use(cors());
app.use(express.json());

const WORDLIST_PATH = path.join(process.cwd(), 'data', 'wordlist.json');
const words = JSON.parse(fs.readFileSync(WORDLIST_PATH, 'utf-8'));
const wordSet = new Set(words);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'wordle-api',
    time: new Date().toISOString(),
  });
});

app.get('/words/random', (_req, res) => {
  const word = words[Math.floor(Math.random() * words.length)];
  res.json({ word });
});

app.post('/words/validate', (req, res) => {
  const word = String(req.body?.word || '').toLowerCase();

  if (word.length !== 5) {
    return res.json({ valid: false, reason: 'length' });
  }

  if (!wordSet.has(word)) {
    return res.json({ valid: false, reason: 'not_found' });
  }

  return res.json({ valid: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
