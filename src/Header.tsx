import './Header.css';
import { CiCircleQuestion, CiLight, CiDark } from 'react-icons/ci';
import { IoStatsChartOutline } from 'react-icons/io5';
import type { Theme } from './types/ui';
import type { AppView } from './types/app';

type HeaderProps = {
  theme: Theme;
  toggleTheme: () => void;
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
  activeView: AppView;
  showGame: () => void;
  showStats: () => void;
};

function Header({
  theme,
  toggleTheme,
  isHelpOpen,
  openHelp,
  closeHelp,
  activeView,
  showGame,
  showStats,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="container-row">
        <div className="container left">
          <button
            type="button"
            aria-label="Help"
            className="help-btn"
            onClick={isHelpOpen ? closeHelp : openHelp}
          >
            <CiCircleQuestion />
          </button>

          <button
            type="button"
            aria-label={activeView === 'game' ? 'Show statistics' : 'Show game'}
            className="stats-btn"
            onClick={activeView === 'game' ? showStats : showGame}
          >
            <IoStatsChartOutline />
          </button>
        </div>
        <div className="container middle">
          <h1 className="title">WORDLE</h1>
        </div>
        <div className="container right">
          <button
            type="button"
            aria-label={
              theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
            }
            className="theme-btn"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <CiDark /> : <CiLight />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
