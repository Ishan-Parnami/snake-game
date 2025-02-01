import { useState } from "react";
import StartMenu from "./Components/StartMenu/index";
import Board1 from "./Components/levels/Board1";
import Board2 from "./Components/levels/Board2";
import Board3 from "./Components/levels/Board3";
import "./App.css";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState("");

  const handleStart = (selectedLevel, selectedDifficulty) => {
    setLevel(selectedLevel);
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
  };

  return (
    <div className="app-container">
      {!gameStarted ? (
        <StartMenu onStart={handleStart} />
      ) : (
        level === 1 ? (
          <Board1 
            difficulty={difficulty} 
            onGameOver={() => setGameStarted(false)}
          />
        ) : level === 2 ? (
          <Board2 difficulty={difficulty} 
          onGameOver={() => setGameStarted(false)}/>
        ) : level === 3 ? (
          <Board3 difficulty={difficulty} 
          onGameOver={() => setGameStarted(false)}/>
        ) : (
          <div>Invalid level selected</div>
        )
      )}
    </div>
  );
};

export default App;