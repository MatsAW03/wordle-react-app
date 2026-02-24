import './App.css';
import Game from './Game';
import Header from './Header';
import HelpModal from './HelpModal';
import { useEffect, useState } from 'react';

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const openHelp = () => setIsHelpOpen(true);
  const closeHelp = () => setIsHelpOpen(false);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        isHelpOpen={isHelpOpen}
        openHelp={openHelp}
        closeHelp={closeHelp}
      />
      <Game isHelpOpen={isHelpOpen} />

      {isHelpOpen && <HelpModal closeHelp={closeHelp} />}
    </div>
  );
}

export default App;
