import { useState } from "react";
import StartMenu from "./Components/StartMenu/index";
import Board1 from "./Components/levels/Board1";
import Board2 from "./Components/levels/Board2";
import Board3 from "./Components/levels/Board3";
import Board4 from "./Components/levels/Board4";
import Board5 from "./Components/levels/Board5";
import Board6 from "./Components/levels/Board6";
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

  const boards = [Board1, Board2, Board3, Board4, Board5, Board6];
  const CurrentBoard = boards[level - 1];

  return (
    <div className="app-container">
      {!gameStarted ? (
        <StartMenu onStart={handleStart} />
      ) : (
        CurrentBoard ? (
          <CurrentBoard 
            difficulty={difficulty} 
            onGameOver={() => setGameStarted(false)}
          />
        ) : (
          <div>Invalid level selected</div>
        )
      )}
    </div>
  );
};

export default App;