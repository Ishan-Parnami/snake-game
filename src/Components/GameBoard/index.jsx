import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
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
  const [gameOver, setGameOver] = useState(false);
  const directionRef = useRef(direction);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());

  const gameSpeed = difficulty === "easy" ? 175 : difficulty === "medium" ? 150 : 125;

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };

    // Ensure food doesn't spawn on snake
    if (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake]);

  const handleGameOver = useCallback(() => {
    setGameOver(true);
  }, []);

  useEffect(() => {
    if (gameOver) {
      alert(`Game Over! Score: ${score}`);
      onGameOver();
    }
  }, [gameOver, score, onGameOver]);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      // Update head position
      switch (direction) {
        case "up": head.y--; break;
        case "down": head.y++; break;
        case "left": head.x--; break;
        case "right": head.x++; break;
      }

      // Wall collision check
      if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        handleGameOver();
        return prevSnake;
      }

      // Self collision check
      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food consumption check
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food.x, food.y, generateFood, handleGameOver]);

  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#45a049" : "#4caf50";
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  }, [snake, food]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === " ") {
        setIsPaused((prev) => !prev);
        return;
      }

      if (isPaused && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        setIsPaused(false);
      }

      const now = Date.now();
      const timeSinceLastMove = now - lastMoveTime;
      const currentDir = directionRef.current;

      if (timeSinceLastMove < gameSpeed / 2) return;

      let newDir = currentDir;
      switch (e.key) {
        case "ArrowUp":
          if (currentDir !== "down") newDir = "up";
          break;
        case "ArrowDown":
          if (currentDir !== "up") newDir = "down";
          break;
        case "ArrowLeft":
          if (currentDir !== "right") newDir = "left";
          break;
        case "ArrowRight":
          if (currentDir !== "left") newDir = "right";
          break;
        default:
          return;
      }

      if (newDir !== currentDir) {
        setDirection(newDir);
        directionRef.current = newDir;
        setLastMoveTime(Date.now());
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPaused, lastMoveTime, gameSpeed]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      const interval = setInterval(moveSnake, gameSpeed);
      return () => clearInterval(interval);
    }
  }, [isPaused, moveSnake, gameSpeed, gameOver]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.score}>Score: {score}</div>
      <div className={styles.canvasContainer}>
        <canvas id="gameCanvas" width={canvasWidth} height={canvasHeight}></canvas>
      </div>
      <button className={styles.startBtn} onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "Play" : "Pause"}
      </button>

      <div className={styles.mobileControls}>
        <button className={styles.controlButton} onClick={() => setDirection("up")}>▲</button>
        <div className={styles.horizontalControls}>
          <button className={styles.controlButton} onClick={() => setDirection("left")}>◀</button>
          <button className={styles.controlButton} onClick={() => setDirection("right")}>▶</button>
        </div>
        <button className={styles.controlButton} onClick={() => setDirection("down")}>▼</button>
      </div>
      <button
        className={styles.mobilePauseButton}
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? "Play" : "Pause"}
      </button>
    </div>
  );
};

GameBoard.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired,
};

export default GameBoard;