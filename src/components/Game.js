import React from 'react';
import Board from './Board';
import ScoreDisplay from './ScoreDisplay';

const Game = () => {
  return (
    <div className="game">
      <Board />
      <ScoreDisplay />
    </div>
  );
};

export default Game;