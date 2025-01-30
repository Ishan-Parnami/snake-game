import React, { useState, useEffect, useCallback } from "react";
import styles from "./styles.module.scss";

const gridSize = 20;
const canvasWidth = 500;
const canvasHeight = 500;
const tileCountX = canvasWidth / gridSize;
const tileCountY = canvasHeight / gridSize;

const GameBoard = ({ difficulty, onGameOver }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("right");
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const gameSpeed = difficulty === "easy" ? 150 : difficulty === "medium" ? 100 : 50;

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      switch (direction) {
        case "up": head.y--; break;
        case "down": head.y++; break;
        case "left": head.x--; break;
        case "right": head.x++; break;
      }
      newSnake.unshift(head);
      newSnake.pop();
      return newSnake;
    });
  }, [direction]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(moveSnake, gameSpeed);
      return () => clearInterval(interval);
    }
  }, [isPaused, moveSnake, gameSpeed]);

  return (    
     <div className={styles.gameContainer}>
     <div className={styles.score}>Score: 0</div>
     <div className={styles.canvasContainer}>
     <canvas id="gameCanvas" width={canvasWidth} height={canvasHeight}></canvas>
     </div>
     <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "Play" : "Pause"}
      </button>
   </div>
  );
};

export default GameBoard;