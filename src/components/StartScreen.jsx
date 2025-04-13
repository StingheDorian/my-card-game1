// src/components/StartScreen.jsx
import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Card Duel Game</h1>
      <button 
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        onClick={onStart}
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;
