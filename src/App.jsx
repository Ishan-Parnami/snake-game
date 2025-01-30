import React, { useState } from "react";
import StartMenu from "./Components/StartMenu/index";
import GameBoard from "./Components/GameBoard/index";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("");

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
      {!gameStarted ? (
        <StartMenu onStart={(diff) => { setDifficulty(diff); setGameStarted(true); }} />
      ) : (
        <GameBoard difficulty={difficulty} onGameOver={() => setGameStarted(false)} />
      )}
    </div>
  );
};

export default App;