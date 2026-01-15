import "./Game.css";
import React, { useEffect, useState, useRef } from "react";
import Row from "./Row";
import { WORD_LENGTH, MAX_GUESSES } from "./constants";

function Game() {
  const validWordsRef = useRef(new Set());
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(null));

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch("/wordlist.json");
        const words = await response.json();

        const randomWord = words[Math.floor(Math.random() * words.length)];

        validWordsRef.current = new Set(words);
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
