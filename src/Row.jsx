import "./Row.css";
import React from "react";
import { WORD_LENGTH } from "./constants";
import { evaluateGuess } from "./utils/evaluateGuess";

function Row({ guess, isFinal, solution }) {
  const tiles = [];

  const statuses = isFinal
    ? evaluateGuess(guess, solution)
    : Array(WORD_LENGTH).fill("");

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i] ?? "";
    let className = "tile";

    if (isFinal) {
      className += ` ${statuses[i]}`;
    }

    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>,
    );
  }

  return <div className="row">{tiles}</div>;
}

export default Row;
