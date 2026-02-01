import React from "react";
import "./Keyboard.css";

const LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "←"],
];

function Keyboard({ usedKeys = {} }) {
  const keyClass = (key) => {
    const status = usedKeys[key.toLowerCase()];
    return `key ${status ?? ""}`.trim();
  };

  return (
    <div className="keyboard">
      {LAYOUT.map((row, rowIndex) => (
        <div className="keyRow" key={rowIndex}>
          {row.map((key) => {
            const specialClass = key === "←" ? "backspace" : "";

            return (
              <button
                className={`${keyClass(key)} ${specialClass}`.trim()}
                key={key}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
