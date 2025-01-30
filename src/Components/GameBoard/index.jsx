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

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };
    
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake]);

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
        onGameOver();
        return prevSnake;
      }

      // Self collision check
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        onGameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food consumption check
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food.x, food.y, generateFood, onGameOver]);

  useEffect(() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#45a049' : '#4caf50';
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 2,
        gridSize - 2
      );
    });
    
    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }, [snake, food]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowUp': 
          if (direction !== 'down') setDirection('up');
          break;
        case 'ArrowDown': 
          if (direction !== 'up') setDirection('down');
          break;
        case 'ArrowLeft': 
          if (direction !== 'right') setDirection('left');
          break;
        case 'ArrowRight': 
          if (direction !== 'left') setDirection('right');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(moveSnake, gameSpeed);
      return () => clearInterval(interval);
    }
  }, [isPaused, moveSnake, gameSpeed]);

  return (    
    <div className={styles.gameContainer}>
      <div className={styles.score}>Score: {score}</div>
      <div className={styles.canvasContainer}>
        <canvas 
          id="gameCanvas" 
          width={canvasWidth} 
          height={canvasHeight}
        ></canvas>
      </div>
      <button 
        className={styles.startBtn} 
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? "Play" : "Pause"}
      </button>
    </div>
  );
};

export default GameBoard;