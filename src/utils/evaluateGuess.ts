import { LetterStatus } from '../types/game';

export function evaluateGuess(guess: string, solution: string) {
  const statuses: LetterStatus[] = Array(guess.length).fill('incorrect');
  const remaining: Record<string, number> = {};

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      statuses[i] = 'correct';
    } else {
      const c = solution[i];
      remaining[c] = (remaining[c] || 0) + 1;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (statuses[i] === 'correct') continue;

    const c = guess[i];
    if ((remaining[c] || 0) > 0) {
      statuses[i] = 'misplaced';
      remaining[c]--;
    }
  }

  return guess.split('').map((letter, i) => ({
    letter,
    status: statuses[i],
  }));
}
