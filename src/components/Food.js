import React from 'react';
import './Food.css';

const Food = ({ position, cellSize }) => {
  return (
    <div
      className="food"
      style={{
        left: `${position.x * cellSize}px`,
        top: `${position.y * cellSize}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
    />
  );
};

export default Food;