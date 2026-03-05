import './Row.css';
import { WORD_LENGTH } from './constants/game';
import { evaluateGuess } from './utils/evaluateGuess';
import type { LetterStatus } from './types/game';

type RowProps = {
  guess: string;
  isFinal: boolean;
  solution: string;
};

function Row({ guess, isFinal, solution }: RowProps) {
  const evaluated = isFinal ? evaluateGuess(guess, solution) : null;

  return (
    <div className="row">
      {Array(WORD_LENGTH)
        .fill(null)
        .map((_, i) => {
          const char = guess[i] ?? '';
          const status: LetterStatus | '' = isFinal
            ? (evaluated?.[i]?.status ?? '')
            : '';
          const className = `tile ${status}`.trim();

          return (
            <div key={i} className={className}>
              {char}
            </div>
          );
        })}
    </div>
  );
}

export default Row;
