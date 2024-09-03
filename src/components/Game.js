import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './Board';
import ScoreDisplay from './ScoreDisplay';
import './Game.css';

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const MOVE_INTERVAL = 150;

const Game = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [foods, setFoods] = useState([]);
  const [fires, setFires] = useState([]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [setupMode, setSetupMode] = useState(true);
  const [foodCount, setFoodCount] = useState(3);
  const [fireCount, setFireCount] = useState(3);
  const gameLoopRef = useRef();
  const boardRef = useRef();
  const lastDirectionRef = useRef({ x: 1, y: 0 });
  const nextDirectionRef = useRef({ x: 1, y: 0 });

  const generateRandomPosition = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const isPositionOccupied = useCallback((position, occupiedPositions) => {
    return occupiedPositions.some(pos => pos.x === position.x && pos.y === position.y);
  }, []);

  const generateSingleFood = useCallback(() => {
    let newFood;
    do {
      newFood = generateRandomPosition();
    } while (isPositionOccupied(newFood, [...snake, ...fires, ...foods]));
    return newFood;
  }, [snake, fires, foods, generateRandomPosition, isPositionOccupied]);

  const generateFires = useCallback(() => {
    const newFires = [];
    while (newFires.length < fireCount) {
      const newFire = generateRandomPosition();
      if (!isPositionOccupied(newFire, [...snake, ...newFires, ...foods])) {
        newFires.push(newFire);
      }
    }
    setFires(newFires);
  }, [snake, foods, fireCount, generateRandomPosition, isPositionOccupied]);

  const generateInitialFoods = useCallback(() => {
    const newFoods = [];
    while (newFoods.length < foodCount) {
      const newFood = generateRandomPosition();
      if (!isPositionOccupied(newFood, [...snake, ...fires, ...newFoods])) {
        newFoods.push(newFood);
      }
    }
    setFoods(newFoods);
  }, [snake, fires, foodCount, generateRandomPosition, isPositionOccupied]);

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

    if (fires.some(fire => fire.x === newHead.x && fire.y === newHead.y)) {
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
  }, [snake, direction, foods, fires, generateSingleFood]);

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

  const startGame = () => {
    setGameStarted(true);
    setSetupMode(false);
    setGameOver(false);
    setSnake(INITIAL_SNAKE);
    setScore(0);
    generateFires();
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

  const renderSetupScreen = () => (
    <div className="setup-screen">
      <h2>Select number of items</h2>
      <div className="setup-controls">
        <label>
          Fruits:
          <input
            type="number"
            min="1"
            max="10"
            value={foodCount}
            onChange={(e) => setFoodCount(Math.max(1, Math.min(10, parseInt(e.target.value))))}
          />
        </label>
        <label>
          Fire Hazards:
          <input
            type="number"
            min="0"
            max="10"
            value={fireCount}
            onChange={(e) => setFireCount(Math.max(0, Math.min(10, parseInt(e.target.value))))}
          />
        </label>
      </div>
      <button onClick={startGame} className="start-button">
        Begin Adventure
      </button>
    </div>
  );

  return (
    <div className="game-container">
      <h1>Python's Jungle Adventure</h1>
      {setupMode ? (
        renderSetupScreen()
      ) : (
        <div className="game-area" onMouseMove={handleMouseMove}>
          <Board
            ref={boardRef}
            snake={snake}
            foods={foods}
            fires={fires}
            gridSize={GRID_SIZE}
            cellSize={CELL_SIZE}
          />
          <ScoreDisplay score={score} />
          {gameOver && (
            <div className="game-over">
              <h2>Adventure Over</h2>
              <p>Your python found {score} exquisite fruits!</p>
              <button onClick={() => setSetupMode(true)} className="restart-button">
                New Adventure
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;