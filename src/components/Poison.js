import React from 'react';

const Poison = ({ position, cellSize }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x * cellSize}px`,
        top: `${position.y * cellSize}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        backgroundColor: 'purple',
        borderRadius: '50%',
      }}
    />
  );
};

export default Poison;