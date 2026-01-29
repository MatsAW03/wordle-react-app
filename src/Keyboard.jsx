import React from "react";
import "./Keyboard.css";

function Keyboard() {
  return (
    <div className="keyboard">
      <div className="keyRow">
        <button className="key" id="keyQ">
          Q
        </button>
        <button className="key" id="keyW">
          W
        </button>
        <button className="key" id="keyE">
          E
        </button>
        <button className="key" id="keyR">
          R
        </button>
        <button className="key" id="keyT">
          T
        </button>
        <button className="key" id="keyY">
          Y
        </button>
        <button className="key" id="keyU">
          U
        </button>
        <button className="key" id="keyI">
          I
        </button>
        <button className="key" id="keyO">
          O
        </button>
        <button className="key" id="keyP">
          P
        </button>
      </div>
      <div className="keyRow">
        <button className="key" id="keyA">
          A
        </button>
        <button className="key" id="keyS">
          S
        </button>
        <button className="key" id="keyD">
          D
        </button>
        <button className="key" id="keyF">
          F
        </button>
        <button className="key" id="keyG">
          G
        </button>
        <button className="key" id="keyH">
          H
        </button>
        <button className="key" id="keyJ">
          J
        </button>
        <button className="key" id="keyK">
          K
        </button>
        <button className="key" id="keyL">
          L
        </button>
      </div>
      <div className="keyRow">
        <button className="key" id="keyZ">
          Z
        </button>
        <button className="key" id="keyX">
          X
        </button>
        <button className="key" id="keyC">
          C
        </button>
        <button className="key" id="keyV">
          V
        </button>
        <button className="key" id="keyB">
          B
        </button>
        <button className="key" id="keyN">
          N
        </button>
        <button className="key" id="keyM">
          M
        </button>
        <button className="key" id="backspace">
          &larr;
        </button>
      </div>
    </div>
  );
}

export default Keyboard;
