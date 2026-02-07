import "./Game.css";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Row from "./Row";
import Keyboard from "./Keyboard";
import { WORD_LENGTH, MAX_GUESSES } from "./constants";
import { buildUsedKeys } from "./utils/buildUsedKeys";
import { getRandomWord } from "./utils/getRandomWord";

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
  const wordListRef = useRef(null);
  const usedKeys = useMemo(() => {
    return buildUsedKeys(guesses, solution);
  }, [guesses, solution]);

  function showMessage(text) {
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
  }

  function setRandomSolution() {
    const list = wordListRef.current;
    if (!Array.isArray(list) || list.length === 0) return false;
    setSolution(getRandomWord(list));
    return true;
  }

  function submitGuess(guess) {
    if (guess.length !== WORD_LENGTH) {
      if (guess.length > 0) {
        showMessage(`Word must be of length ${WORD_LENGTH}`);
      }
      return;
    }

    if (!validWordsRef.current.has(guess)) {
      showMessage("Hmm… that word isn't recognized 😅");
      return;
    }

    const guessIndex = guesses.findIndex((val) => val == null);
    if (guessIndex === -1) {
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[guessIndex] = guess;
    setGuesses(newGuesses);
    setCurrentGuess("");

    const isCorrect = guess === solution;
    if (isCorrect) {
      setIsGameOver(true);
      showMessage("You won! 🎉");
      return;
    }

    const isLastGuess = guessIndex === MAX_GUESSES - 1;
    if (isLastGuess) {
      setIsGameOver(true);
      showMessage(`Out of guesses! 😔 The word was ${solution.toUpperCase()}`);
      return;
    }
  }

  function restartGame() {
    setGuesses(Array(MAX_GUESSES).fill(null));
    setCurrentGuess("");

    if (fadeTimeOutRef.current) clearTimeout(fadeTimeOutRef.current);
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    fadeTimeOutRef.current = null;
    clearTimeoutRef.current = null;

    setMessage("");
    setIsMessageFading(false);

    if (!setRandomSolution()) return;
    setIsGameOver(false);
  }

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
        event.preventDefault();
        submitGuess(currentGuess);
        return;
      }

      if (event.key === "Backspace") {
        setCurrentGuess((guess) => guess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= WORD_LENGTH) {
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

        wordListRef.current = words;
        validWordsRef.current = new Set(words);

        setRandomSolution();
      } catch (error) {
        console.error(error);
      }
    };

    fetchWord();
  }, []);

  const activeRowIndex = guesses.findIndex((val) => val == null);

  return (
    <div className="game-board">
      <button
        id="restart-btn"
        type="button"
        onClick={(e) => {
          restartGame();
          e.currentTarget.blur();
        }}
      >
        Play Again
      </button>
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === activeRowIndex;
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
      <Keyboard usedKeys={usedKeys} />
    </div>
  );
}

export default Game;
