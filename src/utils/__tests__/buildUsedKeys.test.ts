import { describe, expect, it, vi, beforeEach } from 'vitest';
import { buildUsedKeys } from '../buildUsedKeys';
import { evaluateGuess } from '../evaluateGuess';

vi.mock('../evaluateGuess', () => ({
  evaluateGuess: vi.fn(),
}));

const mockedEvaluateGuess = vi.mocked(evaluateGuess);

describe('buildUsedKeys', () => {
  beforeEach(() => {
    mockedEvaluateGuess.mockReset();
  });

  it('returns an empty object for an empty guesses array', () => {
    expect(buildUsedKeys([], 'apple')).toEqual({});
    expect(mockedEvaluateGuess).not.toHaveBeenCalled();
  });

  it('skips null guesses', () => {
    mockedEvaluateGuess.mockReturnValue([
      { letter: 'a', status: 'correct' },
      { letter: 'p', status: 'misplaced' },
    ]);

    expect(buildUsedKeys([null, 'guess', null], 'apple')).toEqual({
      a: 'correct',
      p: 'misplaced',
    });

    expect(mockedEvaluateGuess).toHaveBeenCalledTimes(1);
    expect(mockedEvaluateGuess).toHaveBeenCalledWith('guess', 'apple');
  });

  it('builds used keys from a single evaluated guess', () => {
    mockedEvaluateGuess.mockReturnValue([
      { letter: 'a', status: 'incorrect' },
      { letter: 'b', status: 'misplaced' },
      { letter: 'c', status: 'correct' },
    ]);

    expect(buildUsedKeys(['abcde'], 'apple')).toEqual({
      a: 'incorrect',
      b: 'misplaced',
      c: 'correct',
    });
  });

  it('upgrades a letter from incorrect to misplaced', () => {
    mockedEvaluateGuess
      .mockReturnValueOnce([{ letter: 'a', status: 'incorrect' }])
      .mockReturnValueOnce([{ letter: 'a', status: 'misplaced' }]);

    expect(buildUsedKeys(['first', 'second'], 'apple')).toEqual({
      a: 'misplaced',
    });
  });

  it('upgrades a letter from misplaced to correct', () => {
    mockedEvaluateGuess
      .mockReturnValueOnce([{ letter: 'a', status: 'misplaced' }])
      .mockReturnValueOnce([{ letter: 'a', status: 'correct' }]);

    expect(buildUsedKeys(['first', 'second'], 'apple')).toEqual({
      a: 'correct',
    });
  });

  it('does not downgrade a letter after it becomes correct', () => {
    mockedEvaluateGuess
      .mockReturnValueOnce([{ letter: 'a', status: 'correct' }])
      .mockReturnValueOnce([
        { letter: 'a', status: 'incorrect' },
        { letter: 'a', status: 'misplaced' },
      ]);

    expect(buildUsedKeys(['first', 'second'], 'apple')).toEqual({
      a: 'correct',
    });
  });

  it('keeps the highest status for duplicate letters within the same evaluated guess', () => {
    mockedEvaluateGuess.mockReturnValue([
      { letter: 'a', status: 'incorrect' },
      { letter: 'a', status: 'misplaced' },
      { letter: 'a', status: 'correct' },
    ]);

    expect(buildUsedKeys(['guess'], 'apple')).toEqual({
      a: 'correct',
    });
  });
});
