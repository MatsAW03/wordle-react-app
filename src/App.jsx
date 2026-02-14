import "./App.css";
import Game from "./Game";
import Header from "./Header";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="app">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Game />
    </div>
  );
}

export default App;
