import "./Game.css";
import React, { useEffect, useState, useRef } from "react";
import Row from "./Row";
import { WORD_LENGTH, MAX_GUESSES } from "./constants";

function Game() {
  const API_URL =
    "https://random-word-api.herokuapp.com/word?length=5&number=10000";

  const validWordsRef = useRef(null);
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(null));

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(API_URL);
        const words = await response.json();

        const normalized = words.map((w) => w.toLowerCase());
        const randomWord =
          normalized[Math.floor(Math.random() * normalized.length)];

        validWordsRef.current = new Set(normalized);
        setSolution(randomWord);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWord();
  }, []);

  return (
    <div className="game-board">
      {guesses.map((guess, i) => {
        return <Row key={i} guess={guess ?? ""} />;
      })}
    </div>
  );
}

export default Game;
