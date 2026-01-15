import "./Row.css";
import React from "react";
import { WORD_LENGTH } from "./constants";

function Row({ guess }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    tiles.push(
      <div key={i} className="tile">
        {char}
      </div>
    );
  }

  return <div className="row">{tiles}</div>;
}

export default Row;
