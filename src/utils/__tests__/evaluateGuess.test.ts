import { describe, expect, it } from 'vitest';
import { evaluateGuess } from '../evaluateGuess';

describe('evaluateGuess', () => {
  it('marks all letters correct for an exact match', () => {
    expect(evaluateGuess('apple', 'apple')).toEqual([
      { letter: 'a', status: 'correct' },
      { letter: 'p', status: 'correct' },
      { letter: 'p', status: 'correct' },
      { letter: 'l', status: 'correct' },
      { letter: 'e', status: 'correct' },
    ]);
  });

  it('marks letters as misplaced when they exist in different positions', () => {
    expect(evaluateGuess('plead', 'apple')).toEqual([
      { letter: 'p', status: 'misplaced' },
      { letter: 'l', status: 'misplaced' },
      { letter: 'e', status: 'misplaced' },
      { letter: 'a', status: 'misplaced' },
      { letter: 'd', status: 'incorrect' },
    ]);
  });

  it('marks all letters incorrect when the guess shares no letters with the solution', () => {
    expect(evaluateGuess('brick', 'phone')).toEqual([
      { letter: 'b', status: 'incorrect' },
      { letter: 'r', status: 'incorrect' },
      { letter: 'i', status: 'incorrect' },
      { letter: 'c', status: 'incorrect' },
      { letter: 'k', status: 'incorrect' },
    ]);
  });

  it('handles duplicate letters when the guess contains too many of a letter', () => {
    expect(evaluateGuess('allee', 'apple')).toEqual([
      { letter: 'a', status: 'correct' },
      { letter: 'l', status: 'misplaced' },
      { letter: 'l', status: 'incorrect' },
      { letter: 'e', status: 'incorrect' },
      { letter: 'e', status: 'correct' },
    ]);
  });

  it('handles duplicate letters when the solution contains repeated letters', () => {
    expect(evaluateGuess('spare', 'sassy')).toEqual([
      { letter: 's', status: 'correct' },
      { letter: 'p', status: 'incorrect' },
      { letter: 'a', status: 'misplaced' },
      { letter: 'r', status: 'incorrect' },
      { letter: 'e', status: 'incorrect' },
    ]);
  });

  it('gives correct matches priority before assigning misplaced for repeated letters', () => {
    expect(evaluateGuess('belle', 'level')).toEqual([
      { letter: 'b', status: 'incorrect' },
      { letter: 'e', status: 'correct' },
      { letter: 'l', status: 'misplaced' },
      { letter: 'l', status: 'misplaced' },
      { letter: 'e', status: 'misplaced' },
    ]);
  });
});
