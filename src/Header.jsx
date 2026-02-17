import './Header.css';
import { CiCircleQuestion } from 'react-icons/ci';
import { CiLight, CiDark } from 'react-icons/ci';

function Header({ theme, toggleTheme }) {
  const themeIcon = theme === 'light' ? <CiLight /> : <CiDark />;
  return (
    <header className="app-header">
      <div className="container-row">
        <div className="container left">
          <button type="button" aria-label="Help" className="help-btn">
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
