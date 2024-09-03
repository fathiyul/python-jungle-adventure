import React, { forwardRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import Fire from './Fire';
import './Board.css';

const Board = forwardRef(({ snake, foods, fires, gridSize, cellSize }, ref) => {
  const style = {
    width: `${gridSize * cellSize}px`,
    height: `${gridSize * cellSize}px`,
  };

  return (
    <div ref={ref} className="game-board" style={style}>
      <div className="jungle-background"></div>
      <Snake snake={snake} cellSize={cellSize} />
      {foods.map((food, index) => (
        <Food key={`food-${index}`} position={food} cellSize={cellSize} />
      ))}
      {fires.map((fire, index) => (
        <Fire key={`fire-${index}`} position={fire} cellSize={cellSize} />
      ))}
    </div>
  );
});

export default Board;