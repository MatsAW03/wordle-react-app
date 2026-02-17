export function evaluateGuess(guess, solution) {
  const statuses = Array(guess.length).fill('incorrect');
  const remaining = {};

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      statuses[i] = 'correct';
    } else {
      const c = solution[i];
      remaining[c] = (remaining[c] || 0) + 1;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (statuses[i] === 'correct') {
      continue;
    }
    const c = guess[i];
    if (remaining[c] > 0) {
      statuses[i] = 'misplaced';
      remaining[c]--;
    }
  }
  return guess.split('').map((letter, i) => ({
    letter,
    status: statuses[i],
  }));
}
