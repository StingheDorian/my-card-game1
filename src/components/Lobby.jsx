// src/components/Lobby.jsx
import React from 'react';
import { Button } from "./Button"; // Adjust based on your Button location

const Lobby = ({ onPlay }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Lobby</h1>
      <Button onClick={onPlay}>Find a Match</Button>
    </div>
  );
};

export default Lobby;
