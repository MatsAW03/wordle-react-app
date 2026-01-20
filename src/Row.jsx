import "./Row.css";
import React from "react";
import { WORD_LENGTH } from "./constants";

function Row({ guess, isFinal, solution }) {
  const tiles = [];

  let statuses = Array(WORD_LENGTH).fill("incorrect");

  if (isFinal) {
    const solutionChars = solution.split("");
    const guessChars = guess.split("");
    const remaining = {};

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessChars[i] === solutionChars[i]) {
        statuses[i] = "correct";
      } else {
        const c = solutionChars[i];
        remaining[c] = (remaining[c] || 0) + 1;
      }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (statuses[i] === "correct") {
        continue;
      }
      const c = guessChars[i];
      if (remaining[c] > 0) {
        statuses[i] = "misplaced";
        remaining[c]--;
      }
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = `tile ${isFinal ? statuses[i] : ""}`.trim();

    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>,
    );
  }

  return <div className="row">{tiles}</div>;
}

export default Row;
