import React, { useState, useEffect } from "react";

const Lobby = ({ onBack, onStartGame }) => {
  const [savedDecks, setSavedDecks] = useState({});
  const [selectedDeckName, setSelectedDeckName] = useState(null);

  useEffect(() => {
    const decks = JSON.parse(localStorage.getItem("savedDecks") || "{}");
    setSavedDecks(decks);
  }, []);

  const handleStartGame = () => {
    if (!selectedDeckName) {
      alert("Please select a deck first!");
      return;
    }
    onStartGame(savedDecks[selectedDeckName]);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
      {/* Deck selection */}
      <div className="md:col-span-2 bg-gray-800 p-4 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">🗃️ Choose Your Deck</h2>
        {Object.keys(savedDecks).length === 0 ? (
          <p className="text-gray-400">No decks saved yet! Go build one first.</p>
        ) : (
          <ul className="space-y-3">
            {Object.keys(savedDecks).map((name) => (
              <li
                key={name}
                className={`p-3 rounded cursor-pointer border ${
                  selectedDeckName === name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setSelectedDeckName(name)}
              >
                📁 {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Matchmaking */}
      <div className="bg-gray-800 p-4 rounded shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">🎯 Matchmaking</h2>
          <p>Select a deck and press Search!</p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={handleStartGame}
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded text-lg"
          >
            🔍 Search for Duel
          </button>
          <button
            onClick={onBack}
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
