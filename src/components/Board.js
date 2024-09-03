import React from 'react';
import Snake from './Snake';
import Food from './Food';

const Board = () => {
  return (
    <div className="board">
      <Snake />
      <Food />
    </div>
  );
};