import "./Row.css";
import React from "react";
import { WORD_LENGTH } from "./constants";
import { evaluateGuess } from "./utils/evaluateGuess";

function Row({ guess, isFinal, solution }) {
  const tiles = [];

  const evaluated = isFinal ? evaluateGuess(guess, solution) : null;

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i] ?? "";
    let className = "tile";

    if (isFinal) {
      className += ` ${evaluated[i]?.status ?? ""}`;
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
