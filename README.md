# Wordle React Clone

A Wordle-inspired game built with a **TypeScript + React (Vite)** frontend and a **Node.js/Express REST API** backend deployed on **Railway**.

The backend is the source of truth for:

- selecting a random solution word
- validating guesses against the word list

---

## Disclaimer

This is an unofficial Wordle-inspired clone made for learning purposes. It is not affiliated with, endorsed by, or connected to Wordle or The New York Times. “Wordle” is a trademark of its respective owner.

Play the official game [here](https://www.nytimes.com/games/wordle/index.html)

---

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [API](#api)
- [Environment Variables](#environment-variables)
- [Continuous Integration](#continuous-integration)
- [Contribution Guide](#contribution-guide)
- [Support & Contact](#support--contact)

---

## Introduction

This project started as a frontend-only Wordle clone and was expanded into a small full-stack app to practice:

- **TypeScript** (incremental migration)
- **REST API design** (request/response contracts)
- **Node.js / Express** backend development
- **Railway** deployment and environment-based configuration

<details>
  <summary><strong>Project Structure (click to expand)</strong></summary>

```txt
wordle-react-clone/
├─ public/
│  └─ favicon.png
├─ server/                      # Node.js/Express API (Railway)
│  ├─ data/wordlist.json         # Backend dictionary (source of truth)
│  ├─ index.js                   # Express app + REST endpoints
│  └─ package.json
├─ src/
│  ├─ main.tsx                   # React entry point
│  ├─ App.tsx                    # App shell
│  ├─ Game.tsx                   # Game state + API integration
│  ├─ Row.tsx                    # Tile row UI
│  ├─ Keyboard.tsx               # On-screen keyboard UI
│  ├─ Header.tsx                 # Header + theme toggle
│  ├─ HelpModal.tsx              # Help modal + focus management
│  ├─ constants/
│  │  ├─ game.ts                 # WORD_LENGTH, MAX_GUESSES
│  │  └─ api.ts                  # API_BASE (with env override)
│  ├─ types/
│  │  ├─ game.ts                 # LetterStatus, EvaluatedLetter, UsedKeys
│  │  └─ ui.ts                   # Theme
│  ├─ utils/
│  │  ├─ evaluateGuess.ts         # Tile evaluation logic
│  │  └─ buildUsedKeys.ts         # Key coloring priority
│  └─ *.css
├─ eslint.config.js              # ESLint flat config (JS + TS)
├─ tsconfig.json
├─ vite.config.js
└─ package.json
```

</details>

---

## Key Features

- Random solution each round via backend API
- Guess validation via backend API
- Correct Wordle-style evaluation (including duplicate-letter handling)
- Keyboard coloring that respects priority (correct > misplaced > incorrect)
- Playable loop (type letters, Backspace, Enter)
- Fading feedback messages for invalid length / invalid word / win / loss
- Play Again button to restart and pick a new solution
- Theme toggle (dark/light) persisted in localStorage
- Help modal with keyboard support (Esc + focus management)

---

## Installation Guide

### Prerequisites

- Node.js (LTS recommended)
- npm

### 1) Install dependencies (frontend)

```bash
npm install
```

### 2) Run the frontend (Vite)

```bash
npm run dev
```

Open the URL Vite prints (usually: http://localhost:5173).

- The frontend calls the hosted Railway API by default (see [Environment Variables](#environment-variables) below)

### 3) Run the backend locally (optional)

If you want to develop/test the API locally:

```bash
cd server
npm install
npm run dev
```

The API runs on `http://localhost:3001`.

### 4) Point the frontend to the local API (optional)

Create a file in the repo root called `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:3001
```

Then restart the frontend dev server (`npm run dev`) so Vite reloads the env vars.

### Useful scripts (frontend)

| Script                 | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start dev server (HMR)                    |
| `npm run build`        | Build production bundle                   |
| `npm run preview`      | Preview production build locally          |
| `npm run lint`         | Run ESLint                                |
| `npm run lint:fix`     | Run ESLint and auto-fix issues            |
| `npm run format`       | Format files with Prettier (writes)       |
| `npm run format:check` | Check formatting with Prettier            |
| `npm run typecheck`    | TypeScript typecheck (no emit)            |
| `npm test`             | Run Vitest once                           |
| `npm run test:watch`   | Run Vitest in watch mode                  |
| `npm run docker:build` | Build the frontend Docker image           |
| `npm run docker:run`   | Run the frontend Docker container locally |

---

## Usage

### Playing the game

- Type letters on your keyboard to fill the active row.
- Press <kbd>Enter</kbd> to submit a guess.
- Press <kbd>Backspace</kbd> to delete the last letter.
- Click **Play Again** to start a new round with a new random solution.

The game ends when you either:

- guess the word correctly, or
- use all guesses.

### How tile evaluation works (high level)

- First pass: mark correct letters in the correct position.
- Track remaining unmatched letters in the solution.
- Second pass: mark misplaced if the guessed letter is still available in the remaining pool; otherwise incorrect.

<details>
  <summary><strong>Where the main logic lives (click to expand)</strong></summary>

- `src/Game.tsx`
  - Fetches a random solution from the backend (`GET /words/random`)
  - Validates guesses via the backend (`POST /words/validate`)
  - Stores guesses and ends the game on win/loss
  - Handles restart and message fade timers

- `src/utils/evaluateGuess.ts`
  - Produces an array of `{ letter, status }` per guess

- `src/utils/buildUsedKeys.ts`
  - Computes keyboard coloring based on all submitted guesses

</details>

---

## API

The frontend uses a small REST API (Node.js/Express), deployed on Railway (and runnable locally).

### Base URL

- **Production:** `https://http-nodejs-production-02f4.up.railway.app`
- **Local:** `http://localhost:3001`

The frontend resolves the base URL like this:

- If `VITE_API_BASE_URL` is set → use it
- Otherwise → fall back to the Railway URL (`src/constants/api.ts`)

<details>
  <summary><strong>Endpoints (click to expand)</strong></summary>

#### `GET /health`

Basic health check.

**Response**

```json
{
  "status": "ok",
  "service": "wordle-api",
  "time": "2026-03-02T12:34:56.000Z"
}
```

#### `GET /words/random`

Returns a random 5-letter solution word.

**Response**

```json
{ "word": "crane" }
```

#### `POST /words/validate`

Validates a guessed word.

**Request**

```json
{ "word": "crane" }
```

**Responses**

```json
{ "valid": true }
```

```json
{ "valid": false, "reason": "format" }
```

```json
{ "valid": false, "reason": "not_found" }
```

`reason` values:

- `format` → not exactly 5 lowercase letters (`/^[a-z]{5}$/`)
- `not_found` → not present in the server word list

</details>

### Basic hardening

The API includes:

- JSON body size limit (`1kb`)
- input validation (`/^[a-z]{5}$/`)
- per-endpoint rate limiting
- `trust proxy` enabled (required behind Railway/proxies)

---

## Environment Variables

The frontend defaults to the hosted Railway API, but you can override it locally.

### Frontend

- `VITE_API_BASE_URL` (optional)

If set, the frontend uses this base URL for API requests.  
If not set, it falls back to the Railway URL defined in `src/constants/api.ts`.

#### Local development override (recommended)

Create a file in the repo root called `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:3001
```

Then restart the frontend dev server (`npm run dev`) so Vite reloads the env vars.

### Backend

- `PORT` (provided by Railway)
  - defaults to `3001` locally

---

## Continuous Integration

This project uses **GitHub Actions** to run automated checks on pushes and on pull requests into `main`.

- Development happens on a temporary `dev` branch and is merged into `main` via PR.
- `main` is protected: all required CI checks must pass before merging.

**Pipeline jobs:**

- **Lint:** ESLint
- **Format:** Prettier check
- **TypeCheck:** TypeScript (`tsc` / `npm run typecheck`)
- **Build:** Vite production build

Merges into `main` use **squash merge**.

---

## Contribution Guide

This project is a personal learning exercise, so I’m not accepting external contributions right now.

If you spot an issue or have suggestions, feel free to open an issue or contact me (see [Support & Contact](#support--contact)).

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
