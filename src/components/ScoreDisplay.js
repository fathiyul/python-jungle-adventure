import React from 'react';

const ScoreDisplay = ({ score }) => {
  return (
    <div
      style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginTop: '20px',
      }}
    >
      Score: {score}
    </div>
  );
};

export default ScoreDisplay;