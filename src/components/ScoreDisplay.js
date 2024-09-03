import React from 'react';
import './ScoreDisplay.css';

const ScoreDisplay = ({ score }) => {
  return (
    <div className="score-display">
      <span className="score-label">Fruits Eaten:</span>
      <span className="score-value">{score}</span>
    </div>
  );
};

export default ScoreDisplay;