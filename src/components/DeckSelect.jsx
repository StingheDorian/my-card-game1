import React, { useState, useEffect } from "react";

const DeckSelect = ({ onSelectDeck, onBack }) => {
  const [savedDecks, setSavedDecks] = useState({});

  useEffect(() => {
    const decks = JSON.parse(localStorage.getItem("savedDecks") || "{}");
    setSavedDecks(decks);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📚 Choose a Deck</h2>

      {Object.keys(savedDecks).length === 0 ? (
        <p>No decks saved yet. Go build one first!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(savedDecks).map((deckName) => (
            <button
              key={deckName}
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded shadow"
              onClick={() => onSelectDeck(deckName, savedDecks[deckName])}
            >
              {deckName}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        ⬅ Back
      </button>
    </div>
  );
};

export default DeckSelect;
