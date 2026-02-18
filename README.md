# Wordle React Clone

A lightweight Wordle-style game built with React + Vite. It picks a random 5-letter solution from a local word list, validates guesses, renders tile feedback (correct / misplaced / incorrect), and colors a QWERTY keyboard based on what you’ve learned so far.

---

## Disclaimer

This is an unofficial Wordle-inspired clone made for educational purposes. It is not affiliated with, endorsed by, or connected to Wordle or The New York Times. “Wordle” is a trademark of its respective owner.

Play the official game [here](https://www.nytimes.com/games/wordle/index.html)

---

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [API](#api)
- [Environment Variables](#environment-variables)
- [Contribution Guide](#contribution-guide)
- [Support & Contact](#support--contact)

---

## Introduction

This project is a Wordle-inspired React app created to strengthen my core frontend skills, with a focus on React fundamentals:

- **Entry point:** `src/main.jsx` mounts `<App />` with React `StrictMode`.
- **App shell:** `src/App.jsx` renders the `Game`.
- **Game logic:** `src/Game.jsx` owns the state (guesses, current input, solution, game over).
- **Rendering rows:** `src/Row.jsx` renders the 6 rows of tiles and applies evaluated statuses.
- **Keyboard UI:** `src/Keyboard.jsx` displays the QWERTY layout and colors keys based on results.
- **Core helpers:** `src/utils/*` contains small pure utilities like guess evaluation and key coloring.

<details>
  <summary><strong>Project Structure (click to expand)</strong></summary>

```txt
wordle-react-clone/
├─ public/
│  └─ wordlist.json           # Local dictionary of valid 5-letter words
├─ src/
│  ├─ main.jsx                # React entry point (creates root)
│  ├─ App.jsx                 # App shell
│  ├─ Game.jsx                # Main game state + logic
│  ├─ Row.jsx                 # Renders a single row of tiles
│  ├─ Keyboard.jsx            # QWERTY keyboard UI (colored)
│  ├─ constants.jsx           # WORD_LENGTH, MAX_GUESSES
│  ├─ utils/
│  │  ├─ evaluateGuess.js     # Tile evaluation logic
│  │  ├─ buildUsedKeys.js     # Key coloring priority
│  │  └─ getRandomWord.js     # Picks a random word from list
│  └─ *.css                   # Component styles
├─ vite.config.js             # Vite + React plugin
└─ eslint.config.js           # ESLint flat config (React hooks + refresh)
```

</details>

---

## Key Features

- Random solution each round from `public/wordlist.json`
- Guess validation using a `Set` lookup (fast membership checking)
- Correct Wordle-style evaluation, including duplicate-letter handling (`evaluateGuess`)
- Keyboard coloring that respects priority (correct > misplaced > incorrect)
- Playable loop (type letters, Backspace, Enter)
- Fading feedback messages for invalid length / invalid word / win / loss
- Play Again button to restart and pick a new solution

---

## Installation Guide

### Prerequisites

- Node.js (LTS recommended)
- npm (or your preferred package manager)

### Install & run

```bash
npm install
npm run dev
```

Open the URL Vite prints in your terminal (usually a localhost address).

### Useful scripts

| Script                 | What it does                        |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start dev server (HMR)              |
| `npm run build`        | Build production bundle             |
| `npm run preview`      | Preview production build locally    |
| `npm run lint`         | Run ESLint                          |
| `npm run lint:fix`     | Run ESLint and auto-fix issues      |
| `npm run lint`         | Run ESLint                          |
| `npm run format`       | Format files with Prettier (writes) |
| `npm run format:check` | Check formatting with Prettier      |

---

## Usage

### Playing the game

- Type letters on your keyboard to fill the active row.
- Press <kbd>Enter</kbd> to submit a guess.
- Press <kbd>Backspace</kbd> to delete the last letter.

The game ends when you either:

- guess the word correctly, or
- use all guesses.

**Note:** The on-screen keyboard is currently visual only (it shows key status colors). Input is handled via real keyboard events.

### How tile evaluation works (high level)

- First pass: mark correct letters in the correct position.
- Track remaining unmatched letters in the solution.
- Second pass: mark misplaced if the guessed letter is still available in the remaining pool; otherwise incorrect.

<details>
  <summary><strong>Where the main logic lives (click to expand)</strong></summary>

- `src/Game.jsx`
  - Loads the word list from `public/wordlist.json`
  - Validates guess length + dictionary membership
  - Stores guesses and ends the game on win/loss
  - Handles restart and message fade timers

- `src/utils/evaluateGuess.js`
  - Produces an array of `{ letter, status }` per guess

- `src/utils/buildUsedKeys.js`
  - Computes keyboard coloring based on all submitted guesses

</details>

---

## API

This project has no backend API.

### Local static asset

The only “API-like” dependency is a local fetch to the word list:

- `GET /wordlist.json`
  - Served from the `public/` folder by Vite
  - Returns an array of valid solution/guess words (5 letters)

### Internal “API” (helpers)

These are pure utilities used by the React components:

- `evaluateGuess(guess, solution)` → returns tile objects with statuses
- `buildUsedKeys(guesses, solution)` → returns `{ [letter]: status }`
- `getRandomWord(wordList)` → picks a random word

---

## Environment Variables

No environment variables are required right now.

---

## Contribution Guide

This project is a personal learning exercise for frontend development and React, so I’m not accepting external contributions right now.

If you spot an issue or have suggestions, please refer to **Support & Contact** below.

---

## Support & Contact

If you find a bug, have feedback, or want to suggest improvements, you can:

- Open an issue in this repository (preferred, so I can track and learn from it)
- Or reach out directly to: mats.wintersto@hotmail.no

Please include:

- what you expected to happen
- what actually happened
- steps to reproduce (if relevant)
- screenshots or console errors (if helpful)
