import React, { useState } from "react";
import styles from "./styles.module.scss";

const StartMenu = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState("");

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Select Difficulty</h2>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => setDifficulty("easy")}>Easy</button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => setDifficulty("medium")}>Medium</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => setDifficulty("hard")}>Hard</button>
      </div>
      <button className="px-6 py-2 bg-blue-600 text-white rounded" onClick={() => difficulty && onStart(difficulty)} disabled={!difficulty}>
        Start Game
      </button>
    </div>
  );
};

export default StartMenu;
