import './Header.css';
import { CiCircleQuestion, CiLight, CiDark } from 'react-icons/ci';
import type { Theme } from './types/ui';

type HeaderProps = {
  theme: Theme;
  toggleTheme: () => void;
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
};

function Header({
  theme,
  toggleTheme,
  isHelpOpen,
  openHelp,
  closeHelp,
}: HeaderProps) {
  const themeIcon = theme === 'light' ? <CiLight /> : <CiDark />;
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
        </div>
        <div className="container middle">
          <h1 className="title">WORDLE</h1>
        </div>
        <div className="container right">
          <button
            type="button"
            aria-label="Toggle theme"
            className="theme-btn"
            onClick={toggleTheme}
          >
            {themeIcon}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
