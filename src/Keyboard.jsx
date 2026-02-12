import React from "react";
import "./Keyboard.css";
import { IoSend } from "react-icons/io5";
import { FaBackspace } from "react-icons/fa";

const LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Enter"],
  ["Z", "X", "C", "V", "B", "N", "M", "Backspace"],
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
            const specialClass =
              key === "Enter"
                ? "enter"
                : key === "Backspace"
                  ? "backspace"
                  : "";

            return (
              <button
                type="button"
                aria-label={
                  key === "Backspace"
                    ? "Backspace"
                    : key === "Enter"
                      ? "Enter"
                      : undefined
                }
                className={`${keyClass(key)} ${specialClass}`.trim()}
                key={key}
              >
                {key === "Enter" ? (
                  <IoSend />
                ) : key === "Backspace" ? (
                  <FaBackspace />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
