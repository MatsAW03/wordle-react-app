import "./Game.css";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
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

  const showMessage = useCallback((text) => {
    if (fadeTimeOutRef.current) clearTimeout(fadeTimeOutRef.current);
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);

    setMessage(text);
    setIsMessageFading(false);

    fadeTimeOutRef.current = setTimeout(() => {
      setIsMessageFading(true);
    }, 1000);

    clearTimeoutRef.current = setTimeout(() => {
      setMessage("");
      setIsMessageFading(false);
    }, 2000);
  }, []);

  function setRandomSolution() {
    const list = wordListRef.current;
    if (!Array.isArray(list) || list.length === 0) return false;
    setSolution(getRandomWord(list));
    return true;
  }

  const submitGuess = useCallback(
    (guess) => {
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

      setGuesses((prevGuesses) => {
        const guessIndex = prevGuesses.findIndex((val) => val == null);
        if (guessIndex === -1) return prevGuesses;

        const newGuesses = [...prevGuesses];
        newGuesses[guessIndex] = guess;

        const isCorrect = guess === solution;
        const isLastGuess = guessIndex === MAX_GUESSES - 1;

        if (isCorrect) {
          setIsGameOver(true);
          showMessage("You won! 🎉");
        } else if (isLastGuess) {
          setIsGameOver(true);
          showMessage(
            `Out of guesses! 😔 The word was ${solution.toUpperCase()}`,
          );
        }

        return newGuesses;
      });

      setCurrentGuess("");
    },
    [solution, showMessage],
  );

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
  }, [currentGuess, isGameOver, submitGuess]);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const cached = localStorage.getItem("wordlist_v1");
        let words;

        if (cached) {
          words = JSON.parse(cached);
        } else {
          const response = await fetch("/wordlist.json");
          if (!response.ok)
            throw new Error(`Failed to fetch wordlist: ${response.status}`);
          words = await response.json();
          localStorage.setItem("wordlist_v1", JSON.stringify(words));
        }

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
