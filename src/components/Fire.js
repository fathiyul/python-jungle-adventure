import React from 'react';
import './Fire.css';

const Fire = ({ position, cellSize }) => {
  return (
    <div
      className="fire"
      style={{
        left: `${position.x * cellSize}px`,
        top: `${position.y * cellSize}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
    >
      <div className="flame"></div>
    </div>
  );
};

export default Fire;