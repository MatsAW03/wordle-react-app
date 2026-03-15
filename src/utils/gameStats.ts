import type { GameStats } from '../types/stats';

const GAME_STATS_STORAGE_KEY = 'wordle-game-stats';

export function getInitialGameStats(): GameStats {
  return {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    bestStreak: 0,
  };
}

export function getStoredGameStats(): GameStats {
  try {
    const storedValue = window.localStorage.getItem(GAME_STATS_STORAGE_KEY);

    if (!storedValue) {
      return getInitialGameStats();
    }

    const parsedValue = JSON.parse(storedValue) as Partial<GameStats>;

    return {
      gamesPlayed:
        typeof parsedValue.gamesPlayed === 'number' &&
        parsedValue.gamesPlayed >= 0
          ? parsedValue.gamesPlayed
          : 0,
      wins:
        typeof parsedValue.wins === 'number' && parsedValue.wins >= 0
          ? parsedValue.wins
          : 0,
      losses:
        typeof parsedValue.losses === 'number' && parsedValue.losses >= 0
          ? parsedValue.losses
          : 0,
      currentStreak:
        typeof parsedValue.currentStreak === 'number' &&
        parsedValue.currentStreak >= 0
          ? parsedValue.currentStreak
          : 0,
      bestStreak:
        typeof parsedValue.bestStreak === 'number' &&
        parsedValue.bestStreak >= 0
          ? parsedValue.bestStreak
          : 0,
    };
  } catch {
    return getInitialGameStats();
  }
}

export function saveStoredGameStats(stats: GameStats): void {
  window.localStorage.setItem(GAME_STATS_STORAGE_KEY, JSON.stringify(stats));
}

export function getWinRate(stats: GameStats): number {
  if (stats.gamesPlayed === 0) return 0;

  return Math.round((stats.wins / stats.gamesPlayed) * 100);
}
