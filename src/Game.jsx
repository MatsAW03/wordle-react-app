import React, { useEffect, useState, useRef } from "react";

function Game() {
  const API_URL =
    "https://random-word-api.herokuapp.com/word?length=5&number=10000";

  const validWordsRef = useRef(null);
  const [solution, setSolution] = useState("");

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
    <div className="game-card">
      <p>{solution}</p>
    </div>
  );
}

export default Game;
