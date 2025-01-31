import { useState } from "react";
import StartMenu from "./Components/StartMenu/index";
import GameBoard from "./Components/GameBoard/index";
import "./App.css";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("");

  return (
    <div className="app-container">
      {!gameStarted ? (
        <StartMenu onStart={(diff) => { setDifficulty(diff); setGameStarted(true); }} />
      ) : (
        <GameBoard difficulty={difficulty} onGameOver={() => setGameStarted(false)} />
      )}
    </div>
  );
};

export default App;