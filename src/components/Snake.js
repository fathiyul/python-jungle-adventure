import React from 'react';
import './Snake.css';

const Snake = ({ snake, cellSize }) => {
  return (
    <>
      {snake.map((segment, index) => (
        <div
          key={index}
          className={`snake-segment ${index === 0 ? 'snake-head' : ''}`}
          style={{
            left: `${segment.x * cellSize}px`,
            top: `${segment.y * cellSize}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
          }}
        />
      ))}
    </>
  );
};

export default Snake;