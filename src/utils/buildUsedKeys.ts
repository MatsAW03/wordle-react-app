import { UsedKeys, LetterStatus } from '../types/game';
import { evaluateGuess } from './evaluateGuess';

export function buildUsedKeys(
  guesses: Array<string | null>,
  solution: string,
): UsedKeys {
  const priority: Record<LetterStatus, number> = {
    incorrect: 0,
    misplaced: 1,
    correct: 2,
  };
  const used: UsedKeys = {};

  for (const guess of guesses) {
    if (!guess) continue;

    const evaluated = evaluateGuess(guess, solution);

    for (const { letter, status } of evaluated) {
      const k = letter.toLowerCase();
      const prev = used[k];

      if (!prev || priority[status] > priority[prev]) {
        used[k] = status;
      }
    }
  }
  return used;
}
