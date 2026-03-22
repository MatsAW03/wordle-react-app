import './Game.css';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Row from './Row';
import Keyboard from './Keyboard';
import { WORD_LENGTH, MAX_GUESSES } from './constants/game';
import { buildUsedKeys } from './utils/buildUsedKeys';
import { getStoredGameStats, saveStoredGameStats } from './utils/gameStats';
import { validateGuess } from './api/validateGuess';
import { getRandomWord } from './api/getRandomWord';

type GameProps = {
  isHelpOpen: boolean;
};

type GameStatus = 'playing' | 'won' | 'lost';

function Game({ isHelpOpen }: GameProps) {
  const [solution, setSolution] = useState<string>('');
  const [guesses, setGuesses] = useState<Array<string | null>>(
    Array(MAX_GUESSES).fill(null),
  );

  const initialStats = getStoredGameStats();
  const [streak, setStreak] = useState<number>(initialStats.currentStreak);
  const [bestStreak, setBestStreak] = useState<number>(initialStats.bestStreak);

  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isSubmittingGuess, setIsSubmittingGuess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isMessageFading, setIsMessageFading] = useState<boolean>(false);

  const fadeTimeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGameOver = gameStatus !== 'playing';

  const usedKeys = useMemo(() => {
    return buildUsedKeys(guesses, solution);
  }, [guesses, solution]);

  const showMessage = useCallback((text: string) => {
    if (fadeTimeOutRef.current) clearTimeout(fadeTimeOutRef.current);
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);

    setMessage(text);
    setIsMessageFading(false);

    fadeTimeOutRef.current = setTimeout(() => {
      setIsMessageFading(true);
    }, 1000);

    clearTimeoutRef.current = setTimeout(() => {
      setMessage('');
      setIsMessageFading(false);
    }, 2000);
  }, []);

  const setRandomSolution = useCallback(async () => {
    const randomWord = await getRandomWord();
    setSolution(randomWord);
  }, []);

  const handleWin = useCallback(() => {
    const nextStreak = streak + 1;
    const nextBestStreak = Math.max(bestStreak, nextStreak);

    setStreak(nextStreak);
    setBestStreak(nextBestStreak);
    setGameStatus('won');

    try {
      const stats = getStoredGameStats();

      saveStoredGameStats({
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        wins: stats.wins + 1,
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
      });
    } catch (e) {
      console.error(e);
      showMessage('An error occurred when saving game stats');
    }

    if (nextBestStreak > bestStreak) {
      showMessage('You won! 🎉 New best streak!');
    } else {
      showMessage('You won! 🎉');
    }
  }, [streak, bestStreak, showMessage]);

  const submitGuess = useCallback(
    async (guess: string) => {
      if (isSubmittingGuess) return;

      if (guess.length !== WORD_LENGTH) {
        if (guess.length > 0) {
          showMessage(`Word must be of length ${WORD_LENGTH}`);
        }
        return;
      }

      setIsSubmittingGuess(true);

      try {
        const validationResult = await validateGuess(guess);

        if (!validationResult.valid) {
          if (validationResult.reason === 'format') {
            showMessage(`Word must be of length ${WORD_LENGTH}`);
          } else {
            showMessage('Word not recognized');
          }
          return;
        }

        const guessIndex = guesses.findIndex((val) => val == null);
        if (guessIndex === -1) return;

        const newGuesses = [...guesses];
        newGuesses[guessIndex] = guess;
        setGuesses(newGuesses);

        const isCorrect = guess === solution;
        const isLastGuess = guessIndex === MAX_GUESSES - 1;

        if (isCorrect) {
          handleWin();
        } else if (isLastGuess) {
          setGameStatus('lost');
          setStreak(0);

          try {
            const stats = getStoredGameStats();

            saveStoredGameStats({
              ...stats,
              gamesPlayed: stats.gamesPlayed + 1,
              losses: stats.losses + 1,
              currentStreak: 0,
            });
          } catch (e) {
            console.error(e);
            showMessage('An error occurred when saving game stats');
          }

          showMessage(
            `Out of guesses! 😔 The word was ${solution.toUpperCase()}`,
          );
        }

        setCurrentGuess('');
      } catch (e) {
        console.error(e);
        showMessage('Word validation service unavailable. Try again');
      } finally {
        setIsSubmittingGuess(false);
      }
    },
    [guesses, solution, showMessage, isSubmittingGuess, handleWin],
  );

  const handleInput = useCallback(
    (key: string) => {
      if (isHelpOpen || isGameOver || !solution || isSubmittingGuess) return;

      if (key === 'Enter') {
        submitGuess(currentGuess);
        return;
      }

      if (key === 'Backspace') {
        setCurrentGuess((g) => g.slice(0, -1));
        return;
      }

      if (/^[A-Z]$/.test(key)) {
        setCurrentGuess((g) =>
          g.length >= WORD_LENGTH ? g : g + key.toLowerCase(),
        );
      }
    },
    [
      isHelpOpen,
      isGameOver,
      isSubmittingGuess,
      submitGuess,
      currentGuess,
      solution,
    ],
  );

  async function restartGame() {
    setGuesses(Array(MAX_GUESSES).fill(null));
    setCurrentGuess('');

    if (fadeTimeOutRef.current) clearTimeout(fadeTimeOutRef.current);
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    fadeTimeOutRef.current = null;
    clearTimeoutRef.current = null;

    setMessage('');
    setIsMessageFading(false);

    try {
      await setRandomSolution();
      setGameStatus('playing');
    } catch (e) {
      console.error(e);
      showMessage('Could not load a new word. Try again.');
    }
  }

  useEffect(() => {
    return () => {
      if (fadeTimeOutRef.current) clearTimeout(fadeTimeOutRef.current);
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleTyping = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        handleInput('Enter');
        return;
      }

      if (event.key === 'Backspace') {
        handleInput('Backspace');
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        handleInput(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleTyping);

    return () => window.removeEventListener('keydown', handleTyping);
  }, [handleInput]);

  useEffect(() => {
    const init = async () => {
      try {
        await setRandomSolution();
      } catch (e) {
        console.error(e);
        showMessage('Could not load a word. Try again.');
      }
    };

    init();
  }, [setRandomSolution, showMessage]);

  const activeRowIndex = guesses.findIndex((val) => val == null);

  const restartButtonLabel =
    gameStatus === 'won'
      ? 'Continue'
      : gameStatus === 'lost'
        ? 'Play Again'
        : 'Restart';

  return (
    <div className="game-board">
      <button
        id="restart-btn"
        type="button"
        disabled={isSubmittingGuess}
        onClick={(e) => {
          restartGame();
          e.currentTarget.blur();
        }}
      >
        {restartButtonLabel}
      </button>

      {guesses.map((guess, i) => {
        const isCurrentGuess = i === activeRowIndex;
        return (
          <Row
            key={i}
            guess={isCurrentGuess ? currentGuess : (guess ?? '')}
            isFinal={!isCurrentGuess && guess != null}
            solution={solution}
          />
        );
      })}
      <div className="scoreboard">
        <span>Streak: {streak}</span>
        <span>Best Streak: {bestStreak}</span>
      </div>
      <div className={`message ${isMessageFading ? 'fade-out' : ''}`}>
        {message}
      </div>
      <Keyboard usedKeys={usedKeys} onKeyPress={handleInput} />
    </div>
  );
}

export default Game;
