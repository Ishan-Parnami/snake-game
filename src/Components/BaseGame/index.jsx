import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const BaseGame = ({ level, difficulty, onGameOver, obstacles = [], wallCollision = false }) => {

  if (!difficulty || !onGameOver) {
    throw new Error("Missing required props");
  }
  // Base dimensions for scaling
  const baseGridSize = 20;
  const baseCanvasSize = 500;

  const [borderStyle, setBorderStyle] = useState("none");

  useEffect(() => {
    setBorderStyle(wallCollision ? "2px solid #4CAF50" : "none");
  }, [wallCollision]);

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
  const [highScore, setHighScore] = useState(0);
  const directionRef = useRef(direction);
  const gameOverRef = useRef(false);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());

  // Responsive dimensions calculation
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
  const gameSpeed = useMemo(() => {
    return difficulty === "easy" ? 175 : difficulty === "medium" ? 150 : 125;
  }, [difficulty]);

  // High score handling
  useEffect(() => {
    const savedScore = localStorage.getItem(`snakeHighScore_level${level}_${difficulty}`);
    setHighScore(savedScore ? parseInt(savedScore) : 0);
  }, [level, difficulty]);

  const saveHighScore = useCallback((newScore) => {
    if (newScore > highScore) {
      localStorage.setItem(`snakeHighScore_level${level}_${difficulty}`, newScore);
      setHighScore(newScore);
    }
  }, [highScore, level, difficulty]);

  // Food generation
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

  // Game over handling
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

      // Collision detection
      if (wallCollision) {
        // Collision check
        if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
          handleGameOver();
          return prevSnake;
        }
      } else {
        // Wrap around logic
        head.x = (head.x + tileCountX) % tileCountX;
        head.y = (head.y + tileCountY) % tileCountY;
      }

      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      //pbstacle collision check
      const hitObstacle = obstacles.some(
        (obstacle) => head.x === obstacle.x && head.y === obstacle.y
      );

      if (hitObstacle) {
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
  }, [direction, food.x, food.y, generateFood, wallCollision, handleGameOver, tileCountX, tileCountY, obstacles]);

  // Drawing logic
  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    if (obstacles) {
      ctx.fillStyle = "#555"; // Gray color for obstacles
      obstacles.forEach((obstacle) => {
        ctx.fillRect(
          obstacle.x * gridSize + 1,
          obstacle.y * gridSize + 1,
          gridSize - 2,
          gridSize - 2
        );
      });
    }

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
  }, [snake, food, gridSize, canvasSize, obstacles]);

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

  useEffect(() => {
    gameOverRef.current = false; // Reset when the game starts
  }, [level, difficulty]);

  // Game loop
  useEffect(() => {
    if (!isPaused && !gameOver) {
      const gameSpeed = difficulty === "easy" ? 175 :
        difficulty === "medium" ? 150 : 125;
      const interval = setInterval(moveSnake, gameSpeed);
      return () => clearInterval(interval);
    }
  }, [isPaused, moveSnake, gameOver, difficulty]);

  // Mobile controls handler
  const handleMobileDirection = (newDirection) => {
    if (isPaused) setIsPaused(false);
    setDirection(newDirection);
  };

  useEffect(() => {
    const handleTouch = (e) => {
      switch (e.target.id) {
        case "up":
          handleMobileDirection("up");
          break;
        case "down":
          handleMobileDirection("down");
          break;
        case "left":
          handleMobileDirection("left");
          break;
        case "right":
          handleMobileDirection("right");
          break;
        default: return;
      }
    };
    window.addEventListener("touchstart", handleTouch);
    return () => window.removeEventListener("touchstart", handleTouch);
  }, []);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.scoreContainer}>
        <div className={styles.highScore}>Highest Score: {highScore}</div>
        <div className={styles.currentScore}>Your Score: {score}</div>
      </div>

      <div className={styles.canvasContainer}>
        <canvas id="gameCanvas" width={canvasSize} height={canvasSize} style={{ border: borderStyle }}></canvas>
      </div>
      <button className={styles.startBtn} onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "Play" : "Pause"}
      </button>

      <div className={styles.mobileControls}>
        <button className={styles.controlButton} onClick={() => handleMobileDirection("up")}>▲</button>
        <div className={styles.horizontalControls}>
          <button className={styles.controlButton} onClick={() => handleMobileDirection("left")}>◀</button>
          <button className={styles.controlButton} onClick={() => handleMobileDirection("right")}>▶</button>
        </div>
        <button className={styles.controlButton} onClick={() => handleMobileDirection("down")}>▼</button>
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

BaseGame.propTypes = {
  level: PropTypes.number.isRequired,
  difficulty: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired,
  wallCollision: PropTypes.bool,
  obstacles: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  )
};

export default BaseGame;