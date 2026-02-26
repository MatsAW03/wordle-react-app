import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';

const app = express();

app.use(cors());
app.use(express.json());

const WORDLIST_PATH = path.join(process.cwd(), 'data', 'wordlist.json');
const words = JSON.parse(fs.readFileSync(WORDLIST_PATH, 'utf-8'));

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
