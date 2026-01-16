import "./Game.css";
import React, { useEffect, useState, useRef } from "react";
import Row from "./Row";
import { WORD_LENGTH, MAX_GUESSES } from "./constants";

function Game() {
  const validWordsRef = useRef(new Set());
  const [solution, setSolution] = useState("hello");
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const handleTyping = (event) => {
      if (isGameOver) {
        return;
      }

      if (event.key === "Enter") {
        if (currentGuess.length !== 5) {
          return;
        }
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");

        const isCorrect = currentGuess === solution;
        if (isCorrect) {
          setIsGameOver(true);
        }
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= 5) {
        return;
      }

      setCurrentGuess(currentGuess + event.key);
    };

    window.addEventListener("keydown", handleTyping);

    return () => window.removeEventListener("keydown", handleTyping);
  }, [currentGuess, isGameOver, solution, guesses]);

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
        const isCurrentGuess = i === guesses.findIndex((val) => val == null);
        return (
          <Row
            key={i}
            guess={isCurrentGuess ? currentGuess : (guess ?? "")}
            isFinal={!isCurrentGuess && guess != null}
            solution={solution}
          />
        );
      })}
    </div>
  );
}

export default Game;
