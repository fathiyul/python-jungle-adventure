import React from 'react';

const Snake = ({ snake, cellSize }) => {
  return (
    <>
      {snake.map((segment, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${segment.x * cellSize}px`,
            top: `${segment.y * cellSize}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            backgroundColor: index === 0 ? '#4CAF50' : '#81C784', // Head is darker green
            border: '1px solid #2E7D32',
            borderRadius: '2px',
          }}
        />
      ))}
    </>
  );
};

export default Snake;