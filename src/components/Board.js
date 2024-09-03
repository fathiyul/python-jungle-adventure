import React, { forwardRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import Poison from './Poison';

const Board = forwardRef(({ snake, foods, poisons, gridSize, cellSize }, ref) => {
  const style = {
    width: `${gridSize * cellSize}px`,
    height: `${gridSize * cellSize}px`,
    position: 'relative',
    border: '1px solid black',
  };

  return (
    <div ref={ref} style={style}>
      <Snake snake={snake} cellSize={cellSize} />
      {foods.map((food, index) => (
        <Food key={`food-${index}`} position={food} cellSize={cellSize} />
      ))}
      {poisons.map((poison, index) => (
        <Poison key={`poison-${index}`} position={poison} cellSize={cellSize} />
      ))}
    </div>
  );
});

export default Board;