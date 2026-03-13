import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json({ limit: '1kb' }));

const WORDLIST_PATH = path.join(__dirname, 'data', 'wordlist.json');
const words = JSON.parse(fs.readFileSync(WORDLIST_PATH, 'utf-8'));
const wordSet = new Set(words);

const healthLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const randomLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const validateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.get('/health', healthLimiter, (_req, res) => {
  res.json({
    status: 'ok',
    service: 'wordle-api',
    time: new Date().toISOString(),
  });
});

app.get('/words/random', randomLimiter, (_req, res) => {
  const word = words[Math.floor(Math.random() * words.length)];
  res.json({ word });
});

app.post('/words/validate', validateLimiter, (req, res) => {
  const word = String(req.body?.word || '').toLowerCase();

  if (!/^[a-z]{5}$/.test(word)) {
    return res.json({ valid: false, reason: 'format' });
  }

  if (!wordSet.has(word)) {
    return res.json({ valid: false, reason: 'not_found' });
  }

  return res.json({ valid: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
