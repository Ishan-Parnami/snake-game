export const generateFoodlogic = (tileCountX, tileCountY, snake, obstacles) => {
  const newFood = {
    x: Math.floor(Math.random() * tileCountX),
    y: Math.floor(Math.random() * tileCountY),
  };

  while (
    snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    ) ||
    obstacles.some(
      (obstacle) => obstacle.x === newFood.x && obstacle.y === newFood.y
    )
  ) {
    newFood.x = Math.floor(Math.random() * tileCountX);
    newFood.y = Math.floor(Math.random() * tileCountY);
  }

  return newFood;
};

export const moveSnakelogic = ( prevSnake, direction, tileCountX, tileCountY, food, obstacles, wallCollision, handleGameOver) => {
  const head = { ...prevSnake[0] };
  let newFood = null;

  switch (direction) {
    case "up": head.y--; break;
    case "down": head.y++; break;
    case "left": head.x--; break;
    case "right": head.x++; break;
  }

  if (wallCollision && (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY)) {
    handleGameOver();
    return { newSnake: prevSnake, newFood: null };
  }

  if (!wallCollision) {
    head.x = (head.x + tileCountX) % tileCountX;
    head.y = (head.y + tileCountY) % tileCountY;
  }

  if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
    handleGameOver();
    return { newSnake: prevSnake, newFood: null };
  }

  if (obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
    handleGameOver();
    return { newSnake: prevSnake, newFood: null };
  }

  const newSnake = [head, ...prevSnake];

  if (head.x === food.x && head.y === food.y) {
    newFood = generateFoodlogic(tileCountX, tileCountY, newSnake, obstacles);
    return { newSnake, newFood };
  }

  newSnake.pop();
  return { newSnake, newFood: null };
};

export const GameOverMsg = (score, highScore, onGameOver) => {
  let message;
  if (score > highScore) {
    message = `New High Score! 🎉\n Your Score: ${score}\nPrevious Best: ${highScore}`;
  } else {
    message = `Game Over! Your Score: ${score}\nHighest Score: ${highScore}`;
  }

  alert(message);
  onGameOver();
};
