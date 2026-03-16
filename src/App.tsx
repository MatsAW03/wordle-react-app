import './App.css';
import Game from './Game';
import Header from './Header';
import HelpModal from './HelpModal';
import Statistics from './Statistics';
import { useEffect, useState } from 'react';
import type { Theme } from './types/ui';
import type { AppView } from './types/app';

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('game');
  const openHelp = () => setIsHelpOpen(true);
  const closeHelp = () => setIsHelpOpen(false);

  const showGame = () => setActiveView('game');
  const showStats = () => setActiveView('stats');

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
        activeView={activeView}
        showGame={showGame}
        showStats={showStats}
      />
      {activeView === 'game' ? (
        <Game isHelpOpen={isHelpOpen} />
      ) : (
        <Statistics />
      )}

      {isHelpOpen && <HelpModal closeHelp={closeHelp} />}
    </div>
  );
}

export default App;
