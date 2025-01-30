import React, { useState } from "react";
import styles from "./styles.module.scss";

const StartMenu = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState("");

  return (
    <div className={styles.startMenu}>
      <h2 className={styles.title}>Select Difficulty</h2>
      <div className={styles.buttons}>
        <button 
          className={`${styles.button} ${styles.easy}`} 
          onClick={() => setDifficulty("easy")}
        >
          Easy
        </button>
        <button 
          className={`${styles.button} ${styles.medium}`} 
          onClick={() => setDifficulty("medium")}
        >
          Medium
        </button>
        <button 
          className={`${styles.button} ${styles.hard}`} 
          onClick={() => setDifficulty("hard")}
        >
          Hard
        </button>
      </div>
      <button 
        className={styles.startButton} 
        onClick={() => difficulty && onStart(difficulty)} 
        disabled={!difficulty}
      >
        Start Game
      </button>
    </div>
  );
};

export default StartMenu;