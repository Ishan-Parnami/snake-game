import { useState, useEffect } from "react";
import { StartMenuPropTypes } from "../../utils/propTypes";
import styles from "./styles.module.scss";

const StartMenu = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState("");
  const [level, setLevel] = useState(null);

  const getStartButtonColor = () => {
    switch (difficulty) {
      case "easy":
        return styles.easy;
      case "medium":
        return styles.medium;
      case "hard":
        return styles.hard;
      default:
        return styles.default;
    }
  };
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && level && difficulty) {
        onStart(level, difficulty);
      }
    };
  
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [difficulty, onStart, level]);

  return (
    <div className={styles.startMenu}>
      <h2 className={styles.title}>Select Level</h2>
      <div className={styles.levelButtons}>
        <button className={level === 1 ? styles.selected : ""} onClick={() => setLevel(1)}>1</button>
        <button className={level === 2 ? styles.selected : ""} onClick={() => setLevel(2)}>2</button>
        <button className={level === 3 ? styles.selected : ""} onClick={() => setLevel(3)}>3</button>
        <button className={level === 4 ? styles.selected : ""} onClick={() => setLevel(4)}>4</button>
        <button className={level === 5 ? styles.selected : ""} onClick={() => setLevel(5)}>5</button>
        {/* // Add more levels */}
      </div>

      <h2 className={styles.title}>Select Difficulty</h2>
      <div className={styles.buttons}>
        <button
        className={`${styles.button} ${styles.easy}`}
          onClick={() => setDifficulty("easy")} disabled={!level}
          >
          Easy
        </button>
        <button
        className={`${styles.button} ${styles.medium}`}
          onClick={() => setDifficulty("medium")} disabled={!level}
          >
          Medium
        </button>
        <button
        className={`${styles.button} ${styles.hard}`}
          onClick={() => setDifficulty("hard")} disabled={!level}
          >
          Hard
        </button>
      </div>
      <button
        className={`${styles.startButton} ${getStartButtonColor()}`}
        onClick={() => onStart(level, difficulty)}
        disabled={!difficulty || !level}
        >
        Start Game
      </button>
    </div>
  );
};

StartMenu.propTypes = StartMenuPropTypes;

export default StartMenu;