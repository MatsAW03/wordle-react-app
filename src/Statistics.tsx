import './Statistics.css';
import { getStoredGameStats, getWinRate } from './utils/gameStats';

function Statistics() {
  const stats = getStoredGameStats();
  const winRate = getWinRate(stats);

  return (
    <section className="statistics-view" aria-labelledby="statistics-title">
      <div className="statistics-card">
        <h2 id="statistics-title" className="statistics-title">
          Statistics
        </h2>

        <div className="statistics-row">
          <span>Games Played</span>
          <span>{stats.gamesPlayed}</span>
        </div>

        <div className="statistics-row">
          <span>Wins</span>
          <span>{stats.wins}</span>
        </div>

        <div className="statistics-row">
          <span>Losses</span>
          <span>{stats.losses}</span>
        </div>

        <div className="statistics-row">
          <span>Win Rate</span>
          <span>{winRate}%</span>
        </div>

        <div className="statistics-row">
          <span>Best Streak</span>
          <span>{stats.bestStreak}</span>
        </div>
      </div>
    </section>
  );
}

export default Statistics;
