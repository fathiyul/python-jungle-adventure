import React, { forwardRef } from 'react';
import Snake from './Snake';
import Food from './Food';

const Board = forwardRef(({ snake, food, gridSize, cellSize }, ref) => {
  const style = {
    width: `${gridSize * cellSize}px`,
    height: `${gridSize * cellSize}px`,
    position: 'relative',
    border: '1px solid black',
  };

  return (
    <div ref={ref} style={style}>
      <Snake snake={snake} cellSize={cellSize} />
      <Food position={food} cellSize={cellSize} />
    </div>
  );
});

export default Board;