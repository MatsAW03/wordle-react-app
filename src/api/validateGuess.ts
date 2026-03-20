import { API_BASE } from '../constants/api';
import type { GuessValidationResult } from '../types/api';

export async function validateGuess(
  guess: string,
): Promise<GuessValidationResult> {
  const res = await fetch(`${API_BASE}/words/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: guess }),
  });

  if (!res.ok) {
    throw new Error(`Word validation failed: ${res.status}`);
  }

  return (await res.json()) as GuessValidationResult;
}
