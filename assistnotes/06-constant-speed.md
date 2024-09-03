The speed-up effect you're noticing is an unintended consequence of how we're handling the snake's movement based on the cursor position. Let's modify the game to maintain a constant speed regardless of cursor distance.

We'll update the Game component to use a fixed interval for snake movement instead of relying on cursor position for speed. Here's the revised version of the Game component with constant speed movement:

```javascript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './Board';
import ScoreDisplay from './ScoreDisplay';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const MOVE_INTERVAL = 150; // Adjust this value to change the snake's speed (in milliseconds)

const Game = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [foods, setFoods] = useState([]);
  const [poisons, setPoisons] = useState([]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [setupMode, setSetupMode] = useState(true);
  const [foodCount, setFoodCount] = useState(3);
  const [poisonCount, setPoisonCount] = useState(3);
  const gameLoopRef = useRef();
  const boardRef = useRef();
  const lastDirectionRef = useRef({ x: 1, y: 0 });
  const nextDirectionRef = useRef({ x: 1, y: 0 });

  // ... (other functions like generateRandomPosition, isPositionOccupied, etc. remain the same)

  const handleMouseMove = useCallback((e) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const headX = snake[0].x * CELL_SIZE + CELL_SIZE / 2;
    const headY = snake[0].y * CELL_SIZE + CELL_SIZE / 2;
    const dx = x - headX;
    const dy = y - headY;

    let newDirection;
    if (Math.abs(dx) > Math.abs(dy)) {
      newDirection = { x: dx > 0 ? 1 : -1, y: 0 };
    } else {
      newDirection = { x: 0, y: dy > 0 ? 1 : -1 };
    }

    // Store the next direction, but don't apply it immediately
    if (newDirection.x !== -lastDirectionRef.current.x || newDirection.y !== -lastDirectionRef.current.y) {
      nextDirectionRef.current = newDirection;
    }
  }, [snake]);

  const moveSnake = useCallback(() => {
    // Apply the next direction
    if (nextDirectionRef.current.x !== -lastDirectionRef.current.x || 
        nextDirectionRef.current.y !== -lastDirectionRef.current.y) {
      setDirection(nextDirectionRef.current);
      lastDirectionRef.current = nextDirectionRef.current;
    }

    const head = snake[0];
    const newHead = {
      x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE
    };

    if (snake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    if (poisons.some(poison => poison.x === newHead.x && poison.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];
    const eatenFoodIndex = foods.findIndex(food => food.x === newHead.x && food.y === newHead.y);

    if (eatenFoodIndex !== -1) {
      setScore(prevScore => prevScore + 1);
      const newFoods = [...foods];
      newFoods[eatenFoodIndex] = generateSingleFood();
      setFoods(newFoods);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, foods, poisons, generateSingleFood]);

  const startGame = () => {
    setGameStarted(true);
    setSetupMode(false);
    setGameOver(false);
    setSnake(INITIAL_SNAKE);
    setScore(0);
    generatePoisons();
    generateInitialFoods();
    setDirection({ x: 1, y: 0 });
    lastDirectionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, MOVE_INTERVAL);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, moveSnake]);

  // ... (rest of the component remains the same)

  return (
    // ... (JSX remains the same)
  );
};

export default Game;

```

Here are the key changes we've made to ensure constant speed:

1. We've introduced a `MOVE_INTERVAL` constant at the top of the component. This defines the fixed interval (in milliseconds) at which the snake will move. You can adjust this value to make the snake move faster or slower.

2. We've added a `nextDirectionRef` to store the next direction based on cursor movement:
   ```javascript
   const nextDirectionRef = useRef({ x: 1, y: 0 });
   ```

3. In the `handleMouseMove` function, instead of immediately setting the direction, we now store the next direction:
   ```javascript
   if (newDirection.x !== -lastDirectionRef.current.x || newDirection.y !== -lastDirectionRef.current.y) {
     nextDirectionRef.current = newDirection;
   }
   ```

4. In the `moveSnake` function, we apply the next direction at the beginning of each move:
   ```javascript
   if (nextDirectionRef.current.x !== -lastDirectionRef.current.x || 
       nextDirectionRef.current.y !== -lastDirectionRef.current.y) {
     setDirection(nextDirectionRef.current);
     lastDirectionRef.current = nextDirectionRef.current;
   }
   ```

5. The `useEffect` hook now uses the fixed `MOVE_INTERVAL` for the `setInterval` call:
   ```javascript
   gameLoopRef.current = setInterval(moveSnake, MOVE_INTERVAL);
   ```

These changes ensure that:
- The snake moves at a constant speed, determined by the `MOVE_INTERVAL`.
- The direction changes are still responsive to cursor movement, but they're applied at fixed intervals.
- The game loop runs consistently, regardless of how far or close the cursor is to the snake.

This implementation should provide a smoother, more consistent gameplay experience with the snake moving at a constant speed. You can adjust the `MOVE_INTERVAL` value to find the right balance of speed and difficulty for your game.
