import "./Row.css";
import React from "react";
import { WORD_LENGTH } from "./constants";

function Row({ guess, isFinal, solution }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = "tile";

    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " misplaced";
      } else {
        className += " incorrect";
      }
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
