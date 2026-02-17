import './Row.css';
import React from 'react';
import { WORD_LENGTH } from './constants';
import { evaluateGuess } from './utils/evaluateGuess';

function Row({ guess, isFinal, solution }) {
  const evaluated = isFinal ? evaluateGuess(guess, solution) : null;

  return (
    <div className="row">
      {Array(WORD_LENGTH)
        .fill(null)
        .map((_, i) => {
          const char = guess[i] ?? '';
          const status = isFinal ? (evaluated?.[i]?.status ?? '') : '';
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
