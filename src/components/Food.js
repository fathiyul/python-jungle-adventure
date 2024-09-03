import React from 'react';

const Food = ({ position, cellSize }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x * cellSize}px`,
        top: `${position.y * cellSize}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        backgroundColor: '#FF5252',
        borderRadius: '50%',
      }}
    />
  );
};

export default Food;