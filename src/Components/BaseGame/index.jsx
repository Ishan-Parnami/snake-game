import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { BaseGamePropTypes } from "../../utils/propTypes";
import styles from "./styles.module.scss";

const BaseGame = ({ level, difficulty, onGameOver, obstacles = [], wallCollision = false }) => {

  if (!difficulty || !onGameOver) {
    throw new Error("Missing required props");
  }
  const baseGridSize = 20;
  const baseCanvasSize = 500;
  const borderStyle = wallCollision ? "2px solid #4CAF50" : "none";

  const [canvasSize, setCanvasSize] = useState(baseCanvasSize);
  const [gridSize, setGridSize] = useState(baseGridSize);
  const [tileCountX, setTileCountX] = useState(Math.floor(baseCanvasSize / baseGridSize));
  const [tileCountY, setTileCountY] = useState(Math.floor(baseCanvasSize / baseGridSize));
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("right");
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const [scoreUpdated, setScoreUpdated] = useState(false);

  const directionRef = useRef(direction);
  const gameOverRef = useRef(false);

  const updateScore =(score) => {
    setScore(score + 1);
  }

  const gameSpeed = useMemo(() => {
    return difficulty === "easy" ? 175 : difficulty === "medium" ? 150 : 125;
  }, [difficulty]);

  const handleMobileDirection = useCallback((newDirection) => {
    if (isPaused) setIsPaused(false);
    setDirection(newDirection);
  }, [isPaused]);

  const saveHighScore = useCallback((newScore) => {
    if (newScore > highScore) {
      localStorage.setItem(`snakeHighScore_level${level}_${difficulty}`, newScore);
      setHighScore(newScore);
    }
  }, [highScore, level, difficulty]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };

    while (
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
      obstacles.some(obstacle => obstacle.x === newFood.x && obstacle.y === newFood.y)
    ) {
      newFood.x = Math.floor(Math.random() * tileCountX);
      newFood.y = Math.floor(Math.random() * tileCountY);
    }

    return newFood;
  }, [snake, tileCountX, tileCountY, obstacles]);

  const handleGameOver = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;

    setGameOver(true);
    saveHighScore(score);

    let message;
    if (score > highScore) {
      message = `New High Score! 🎉\n Your Score: ${score}\nPrevious Best: ${highScore}`;
    } else {
      message = `Game Over! Your Score: ${score}\nHighest Score: ${highScore}`;
    }

    alert(message);
    onGameOver();
  }, [score, highScore, onGameOver, saveHighScore]);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (directionRef.current) {
        case "up": head.y--; break;
        case "down": head.y++; break;
        case "left": head.x--; break;
        case "right": head.x++; break;
      }

      if (wallCollision) {
        if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
          handleGameOver();
          return prevSnake;
        }
      } else {
        head.x = (head.x + tileCountX) % tileCountX;
        head.y = (head.y + tileCountY) % tileCountY;
      }

      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      const hitObstacle = obstacles.some(
        (obstacle) => head.x === obstacle.x && head.y === obstacle.y
      );

      if (hitObstacle) {
        handleGameOver();
        return prevSnake;
      }
      
      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        updateScore(score)
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food.x, food.y, generateFood, wallCollision, handleGameOver, tileCountX, tileCountY, obstacles, score]);

  useEffect(() => {
    if (score > 0) {
      setScoreUpdated(true);
      const timer = setTimeout(() => setScoreUpdated(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score]); 

  useEffect(() => {
    const calculateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const maxSize = Math.min(screenWidth * 0.9, screenHeight * 0.7, baseCanvasSize);
      const scaleFactor = maxSize / baseCanvasSize;
      const newGridSize = Math.max(Math.floor(baseGridSize * scaleFactor), 10);
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

  useEffect(() => {
    const savedScore = localStorage.getItem(`snakeHighScore_level${level}_${difficulty}`);
    setHighScore(savedScore ? parseInt(savedScore) : 0);
  }, [level, difficulty]);

  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    let animationFrameId; 

    const draw = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      ctx.fillStyle = "#555";
      obstacles.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.roundRect(
          x * gridSize + 1,
          y * gridSize + 1,
          gridSize - 2,
          gridSize - 2,
          [4]
        );
        ctx.fill();
      });

      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#45a049" : "#4caf50";
        ctx.beginPath();
        ctx.roundRect(
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize - 2,
          gridSize - 2,
          [5]
        );
        ctx.fill();
      });

      const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 1;
      ctx.fillStyle = "#ff0000";
      ctx.beginPath();
      ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        (gridSize / 2 - 2) * pulse,
        0,
        Math.PI * 2
      );
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [snake, food, gridSize, canvasSize, obstacles]);
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

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    gameOverRef.current = false;
  }, [level, difficulty]);

  useEffect(() => {
    let gameInterval;
    const gameLoop = () => {
      if (!isPaused && !gameOver) {
        moveSnake();
      }
    };

    if (!isPaused && !gameOver) {
      gameInterval = setInterval(gameLoop, gameSpeed);
    }
    return () => clearInterval(gameInterval);
  }, [isPaused, gameOver, moveSnake, gameSpeed]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.scoreContainer}>
        <div className={styles.highScore}>Highest Score: {highScore}</div>
        <div className={`${styles.currentScore} ${scoreUpdated ? styles.updated : ''}`}>
          Your Score: {score}
        </div>
      </div>

      <div className={styles.canvasContainer}>
        <canvas
          id="gameCanvas"
          width={canvasSize}
          height={canvasSize}
          style={{ border: borderStyle }}
        ></canvas>
      </div>

      <div className={styles.mobileControls}>
        <button className={styles.controlButton} onClick={() => handleMobileDirection("up")}>▲</button>
        <div className={styles.horizontalControls}>
          <button className={styles.controlButton} onClick={() => handleMobileDirection("left")}>◀</button>
          <button className={styles.controlButton} onClick={() => handleMobileDirection("right")}>▶</button>
        </div>
        <button className={styles.controlButton} onClick={() => handleMobileDirection("down")}>▼</button>
      </div>

      <button className={styles.mobilePauseButton} onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "Play" : "Pause"}
      </button>
    </div>
  );
};

BaseGame.propTypes = BaseGamePropTypes;

export default BaseGame;