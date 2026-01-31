import React from "react";
import "./Keyboard.css";

function Keyboard({ usedKeys = {} }) {
  const keyClass = (letter) => {
    const status = usedKeys[letter.toLowerCase()];
    return `key ${status ?? ""}`.trim();
  };

  return (
    <div className="keyboard">
      <div className="keyRow">
        <button className={keyClass("Q")} id="keyQ">
          Q
        </button>
        <button className={keyClass("W")} id="keyW">
          W
        </button>
        <button className={keyClass("E")} id="keyE">
          E
        </button>
        <button className={keyClass("R")} id="keyR">
          R
        </button>
        <button className={keyClass("T")} id="keyT">
          T
        </button>
        <button className={keyClass("Y")} id="keyY">
          Y
        </button>
        <button className={keyClass("U")} id="keyU">
          U
        </button>
        <button className={keyClass("I")} id="keyI">
          I
        </button>
        <button className={keyClass("O")} id="keyO">
          O
        </button>
        <button className={keyClass("P")} id="keyP">
          P
        </button>
      </div>

      <div className="keyRow">
        <button className={keyClass("A")} id="keyA">
          A
        </button>
        <button className={keyClass("S")} id="keyS">
          S
        </button>
        <button className={keyClass("D")} id="keyD">
          D
        </button>
        <button className={keyClass("F")} id="keyF">
          F
        </button>
        <button className={keyClass("G")} id="keyG">
          G
        </button>
        <button className={keyClass("H")} id="keyH">
          H
        </button>
        <button className={keyClass("J")} id="keyJ">
          J
        </button>
        <button className={keyClass("K")} id="keyK">
          K
        </button>
        <button className={keyClass("L")} id="keyL">
          L
        </button>
      </div>

      <div className="keyRow">
        <button className={keyClass("Z")} id="keyZ">
          Z
        </button>
        <button className={keyClass("X")} id="keyX">
          X
        </button>
        <button className={keyClass("C")} id="keyC">
          C
        </button>
        <button className={keyClass("V")} id="keyV">
          V
        </button>
        <button className={keyClass("B")} id="keyB">
          B
        </button>
        <button className={keyClass("N")} id="keyN">
          N
        </button>
        <button className={keyClass("M")} id="keyM">
          M
        </button>

        {/* backspace skal ikke farges */}
        <button className="key" id="backspace">
          &larr;
        </button>
      </div>
    </div>
  );
}

export default Keyboard;
