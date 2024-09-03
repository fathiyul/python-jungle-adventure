import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './Board';
import ScoreDisplay from './ScoreDisplay';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const MOVE_INTERVAL = 100;

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
    } while (isPositionOccupied(newFood, [...snake, ...poisons, ...foods]));
    return newFood;
  }, [snake, poisons, foods, generateRandomPosition, isPositionOccupied]);

  const generatePoisons = useCallback(() => {
    const newPoisons = [];
    while (newPoisons.length < poisonCount) {
      const newPoison = generateRandomPosition();
      if (!isPositionOccupied(newPoison, [...snake, ...newPoisons, ...foods])) {
        newPoisons.push(newPoison);
      }
    }
    setPoisons(newPoisons);
  }, [snake, foods, poisonCount, generateRandomPosition, isPositionOccupied]);

  const generateInitialFoods = useCallback(() => {
    const newFoods = [];
    while (newFoods.length < foodCount) {
      const newFood = generateRandomPosition();
      if (!isPositionOccupied(newFood, [...snake, ...poisons, ...newFoods])) {
        newFoods.push(newFood);
      }
    }
    setFoods(newFoods);
  }, [snake, poisons, foodCount, generateRandomPosition, isPositionOccupied]);

  const moveSnake = useCallback(() => {
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
    lastDirectionRef.current = direction;
  }, [snake, direction, foods, poisons, generateSingleFood]);

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

    if (newDirection.x !== -lastDirectionRef.current.x || newDirection.y !== -lastDirectionRef.current.y) {
      setDirection(newDirection);
    }
  }, [snake]);

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
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, MOVE_INTERVAL);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, moveSnake]);

  const renderSetupScreen = () => (
    <div style={{ textAlign: 'center' }}>
      <h2>Game Setup</h2>
      <div>
        <label>
          Number of Foods:
          <input
            type="number"
            min="1"
            max="10"
            value={foodCount}
            onChange={(e) => setFoodCount(Math.max(1, Math.min(10, parseInt(e.target.value))))}
          />
        </label>
      </div>
      <div>
        <label>
          Number of Poisons:
          <input
            type="number"
            min="0"
            max="10"
            value={poisonCount}
            onChange={(e) => setPoisonCount(Math.max(0, Math.min(10, parseInt(e.target.value))))}
          />
        </label>
      </div>
      <button
        onClick={startGame}
        style={{
          fontSize: '18px',
          padding: '10px 20px',
          margin: '20px 0',
          cursor: 'pointer',
        }}
      >
        Start Game
      </button>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>Snake Game</h1>
      {setupMode ? (
        renderSetupScreen()
      ) : (
        <div
          className="game"
          onMouseMove={handleMouseMove}
          style={{ position: 'relative' }}
        >
          <Board
            ref={boardRef}
            snake={snake}
            foods={foods}
            poisons={poisons}
            gridSize={GRID_SIZE}
            cellSize={CELL_SIZE}
          />
          <ScoreDisplay score={score} />
          {gameOver && (
            <div
              className="game-over"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '20px',
                borderRadius: '10px',
              }}
            >
              <h2>Game Over</h2>
              <button
                onClick={() => setSetupMode(true)}
                style={{
                  fontSize: '18px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                }}
              >
                New Game
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;