import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './Board';
import ScoreDisplay from './ScoreDisplay';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const MOVE_INTERVAL = 100;
const POISON_COUNT = 3;

const Game = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(null);
  const [poisons, setPoisons] = useState([]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
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

  const generatePoisons = useCallback(() => {
    const newPoisons = [];
    while (newPoisons.length < POISON_COUNT) {
      const newPoison = generateRandomPosition();
      if (!isPositionOccupied(newPoison, [...snake, ...newPoisons])) {
        newPoisons.push(newPoison);
      }
    }
    setPoisons(newPoisons);
  }, [snake, generateRandomPosition, isPositionOccupied]);

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = generateRandomPosition();
    } while (isPositionOccupied(newFood, [...snake, ...poisons]));
    setFood(newFood);
  }, [snake, poisons, generateRandomPosition, isPositionOccupied]);

  const moveSnake = useCallback(() => {
    const head = snake[0];
    const newHead = {
      x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE
    };

    // Check if the new head collides with the snake's body
    if (snake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    // Check if the new head collides with poison
    if (poisons.some(poison => poison.x === newHead.x && poison.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];

    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(prevScore => prevScore + 1);
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
    lastDirectionRef.current = direction;
  }, [snake, direction, food, poisons, generateFood]);

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

    // Prevent backward movement
    if (newDirection.x !== -lastDirectionRef.current.x || newDirection.y !== -lastDirectionRef.current.y) {
      setDirection(newDirection);
    }
  }, [snake]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setSnake(INITIAL_SNAKE);
    setScore(0);
    generatePoisons();
    generateFood();
    setDirection({ x: 1, y: 0 });
    lastDirectionRef.current = { x: 1, y: 0 };
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, MOVE_INTERVAL);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, moveSnake]);

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
      <div
        className="game"
        onMouseMove={handleMouseMove}
        style={{ position: 'relative' }}
      >
        <Board
          ref={boardRef}
          snake={snake}
          food={food}
          poisons={poisons}
          gridSize={GRID_SIZE}
          cellSize={CELL_SIZE}
        />
        <ScoreDisplay score={score} />
        {!gameStarted && (
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
        )}
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
              onClick={startGame}
              style={{
                fontSize: '18px',
                padding: '10px 20px',
                cursor: 'pointer',
              }}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;