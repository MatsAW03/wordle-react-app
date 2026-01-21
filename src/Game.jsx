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
  const [message, setMessage] = useState("");
  const [isMessageFading, setIsMessageFading] = useState(false);
  const fadeTimeOutRef = useRef(null);
  const clearTimeoutRef = useRef(null);

  const showMessage = (text) => {
    if (fadeTimeOutRef.current) {
      clearTimeout(fadeTimeOutRef.current);
    }
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
    }

    setMessage(text);
    setIsMessageFading(false);

    fadeTimeOutRef.current = setTimeout(() => {
      setIsMessageFading(true);
    }, 1000);

    clearTimeoutRef.current = setTimeout(() => {
      setMessage("");
      setIsMessageFading(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (fadeTimeOutRef.current) clearTimeout(fadeTimeOutRef.current);
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleTyping = (event) => {
      if (isGameOver) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (event.key === "Enter") {
        if (currentGuess.length !== 5) {
          return;
        }

        if (!validWordsRef.current.has(currentGuess)) {
          showMessage("Hmm… that word isn't recognized 😅");
          return;
        }

        const guessIndex = guesses.findIndex((val) => val == null);
        if (guessIndex === -1) {
          return;
        }

        const newGuesses = [...guesses];
        newGuesses[guessIndex] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");

        const isCorrect = currentGuess === solution;
        if (isCorrect) {
          setIsGameOver(true);
          showMessage("You won! 🎉")
          return;
        }

        const isLastGuess = guessIndex === MAX_GUESSES - 1;
        if (isLastGuess) {
          setIsGameOver(true);
          showMessage(`Out of guesses! 😔 The word was ${solution}`);
          return;
        }

        return;
      }

      if (event.key === "Backspace") {
        setCurrentGuess((guess) => guess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= 5) {
        return;
      }

      if (!/^[a-zA-Z]$/.test(event.key)) {
        return;
      }

      setCurrentGuess((guess) => guess + event.key.toLowerCase());
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
      <div className={`message ${isMessageFading ? "fade-out" : ""}`}>
        {message}
      </div>
    </div>
  );
}

export default Game;
