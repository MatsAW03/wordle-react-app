import React from 'react';
import { IoIosClose } from 'react-icons/io';
import './HelpModal.css';

function HelpModal({ closeHelp }) {
  return (
    <div
      className="helpBackdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeHelp();
      }}
    >
      <div className="helpModal">
        <button
          type="button"
          className="close-btn"
          onClick={closeHelp}
          aria-label="Close help"
        >
          <IoIosClose className="close-icon" />
        </button>

        <div className="helpBody">
          <p>
            Guess the random 5-letter word in 6 tries. Type a word and press{' '}
            <span className="action-example">Enter</span> to submit.
          </p>
          <p className="helpLead">After each guess, the tiles change color:</p>

          <div className="helpLegend">
            <div className="helpLegendRow">
              <div className="helpTile helpTile--green">A</div>
              <div className="helpLegendText">
                Correct letter, correct position
              </div>
            </div>

            <div className="helpLegendRow">
              <div className="helpTile helpTile--yellow">B</div>
              <div className="helpLegendText">
                Correct letter, wrong position
              </div>
            </div>

            <div className="helpLegendRow">
              <div className="helpTile helpTile--gray">C</div>
              <div className="helpLegendText">Letter not in the word</div>
            </div>

            <p>
              Each guess must be a valid word. Use{' '}
              <span className="action-example">Backspace</span>
            </p>
            <p>
              Press <span className="action-example">Play Again</span> to get a
              new random word.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
