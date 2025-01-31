import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

// Base dimensions for scaling
const baseGridSize = 20;
const baseCanvasSize = 500;

const GameBoard = ({ difficulty, onGameOver }) => {
  // Responsive state
  const [canvasSize, setCanvasSize] = useState(baseCanvasSize);
  const [gridSize, setGridSize] = useState(baseGridSize);
  const [tileCountX, setTileCountX] = useState(Math.floor(baseCanvasSize / baseGridSize));
  const [tileCountY, setTileCountY] = useState(Math.floor(baseCanvasSize / baseGridSize));

  // Game state
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("right");
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const directionRef = useRef(direction);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());

  // Responsive calculations
  useEffect(() => {
    const calculateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Calculate maximum canvas size
      const maxSize = Math.min(screenWidth * 0.9, screenHeight * 0.7, baseCanvasSize);
      const scaleFactor = maxSize / baseCanvasSize;
      
      // Calculate proportional grid size (minimum 10px)
      const newGridSize = Math.max(Math.floor(baseGridSize * scaleFactor), 10);
      
      // Adjust canvas size to fit exact grid cells
      const exactTileCount = Math.floor(maxSize / newGridSize);
      const adjustedCanvasSize = exactTileCount * newGridSize;
      
      setCanvasSize(adjustedCanvasSize);
      setGridSize(newGridSize);
      setTileCountX(exactTileCount);
      setTileCountY(exactTileCount);
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  // Game speed calculation
  const gameSpeed = difficulty === "easy" ? 175 : difficulty === "medium" ? 150 : 125;

  // Food generation
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };

    if (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake, tileCountX, tileCountY]);

  // Game over handling
  const handleGameOver = useCallback(() => {
    setGameOver(true);
  }, []);

  useEffect(() => {
    if (gameOver) {
      alert(`Game Over! Score: ${score}`);
      onGameOver();
    }
  }, [gameOver, score, onGameOver]);

  // Snake movement logic
  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case "up": head.y--; break;
        case "down": head.y++; break;
        case "left": head.x--; break;
        case "right": head.x++; break;
      }

      // Collision checks
      if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        handleGameOver();
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food consumption
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food.x, food.y, generateFood, handleGameOver, tileCountX, tileCountY]);

  // Drawing logic
  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#45a049" : "#4caf50";
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 2,
        gridSize - 2
      );
    });

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }, [snake, food, gridSize, canvasSize]);

  // Keyboard controls
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
        case "ArrowUp": if (currentDir !== "down") newDir = "up"; break;
        case "ArrowDown": if (currentDir !== "up") newDir = "down"; break;
        case "ArrowLeft": if (currentDir !== "right") newDir = "left"; break;
        case "ArrowRight": if (currentDir !== "left") newDir = "right"; break;
        default: return;
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

  // Sync direction ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Game loop
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
        <canvas 
          id="gameCanvas" 
          width={canvasSize} 
          height={canvasSize}
        ></canvas>
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