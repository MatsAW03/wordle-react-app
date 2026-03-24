import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import {
  getInitialGameStats,
  getStoredGameStats,
  saveStoredGameStats,
  getWinRate,
} from '../gameStats';

const STORAGE_KEY = 'wordle-game-stats';

describe('gameStats', () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};

    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn((key: string) => {
          return key in storage ? storage[key] : null;
        }),
        setItem: vi.fn((key: string, value: string) => {
          storage[key] = value;
        }),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getInitialGameStats', () => {
    it('returns zeroed initial stats', () => {
      expect(getInitialGameStats()).toEqual({
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        bestStreak: 0,
      });
    });
  });

  describe('getStoredGameStats', () => {
    it('returns initial stats when nothing is stored', () => {
      expect(getStoredGameStats()).toEqual(getInitialGameStats());
    });

    it('returns stored stats when valid stats exist in localStorage', () => {
      const storedStats = {
        gamesPlayed: 10,
        wins: 7,
        losses: 3,
        currentStreak: 4,
        bestStreak: 5,
      };

      storage[STORAGE_KEY] = JSON.stringify(storedStats);

      expect(getStoredGameStats()).toEqual(storedStats);
    });

    it('returns initial stats when stored JSON is invalid', () => {
      storage[STORAGE_KEY] = '{invalid json';

      expect(getStoredGameStats()).toEqual(getInitialGameStats());
    });

    it('defaults missing fields to 0', () => {
      storage[STORAGE_KEY] = JSON.stringify({
        gamesPlayed: 8,
        wins: 5,
      });

      expect(getStoredGameStats()).toEqual({
        gamesPlayed: 8,
        wins: 5,
        losses: 0,
        currentStreak: 0,
        bestStreak: 0,
      });
    });

    it('defaults negative values to 0', () => {
      storage[STORAGE_KEY] = JSON.stringify({
        gamesPlayed: -1,
        wins: -2,
        losses: -3,
        currentStreak: -4,
        bestStreak: -5,
      });

      expect(getStoredGameStats()).toEqual({
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        bestStreak: 0,
      });
    });

    it('defaults non-number values to 0', () => {
      storage[STORAGE_KEY] = JSON.stringify({
        gamesPlayed: '10',
        wins: null,
        losses: '3',
        currentStreak: {},
        bestStreak: [],
      });

      expect(getStoredGameStats()).toEqual({
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        bestStreak: 0,
      });
    });
  });

  describe('saveStoredGameStats', () => {
    it('saves stats to localStorage as JSON', () => {
      const stats = {
        gamesPlayed: 12,
        wins: 8,
        losses: 4,
        currentStreak: 3,
        bestStreak: 6,
      };

      saveStoredGameStats(stats);

      expect(storage[STORAGE_KEY]).toBe(JSON.stringify(stats));
    });
  });

  describe('getWinRate', () => {
    it('returns 0 when no games have been played', () => {
      expect(
        getWinRate({
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          currentStreak: 0,
          bestStreak: 0,
        }),
      ).toBe(0);
    });

    it('returns the rounded win rate percentage', () => {
      expect(
        getWinRate({
          gamesPlayed: 3,
          wins: 2,
          losses: 1,
          currentStreak: 0,
          bestStreak: 0,
        }),
      ).toBe(67);
    });

    it('returns 100 when all played games are wins', () => {
      expect(
        getWinRate({
          gamesPlayed: 5,
          wins: 5,
          losses: 0,
          currentStreak: 0,
          bestStreak: 0,
        }),
      ).toBe(100);
    });
  });
});
