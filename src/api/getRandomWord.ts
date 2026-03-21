import { API_BASE } from '../constants/api';

type RandomWordResponse = {
  word: string;
};

export async function getRandomWord(): Promise<string> {
  const res = await fetch(`${API_BASE}/words/random`);

  if (!res.ok) {
    throw new Error(`Failed to fetch random word: ${res.status}`);
  }

  const data = (await res.json()) as RandomWordResponse;
  return data.word;
}
