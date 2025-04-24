import React, { useState } from "react";
import { allCards } from "../data/heroCards";
import { userCardCollection } from "../data/userCards";
import { saveDeck } from "../data/deckStorage";

const DeckBuilder = ({ onBack, onDeckSaved, wallet }) => {
  const [selectedCards, setSelectedCards] = useState([]);

  const availableCards = userCardCollection.map((id, index) => ({
    ...allCards[id],
    uniqueId: `${id}-${index}`,
  }));

  const handleCardClick = (card) => {
    if (selectedCards.length >= 20) return;
    setSelectedCards([...selectedCards, card]);
  };

  const handleRemoveCard = (index) => {
    const newDeck = [...selectedCards];
    newDeck.splice(index, 1);
    setSelectedCards(newDeck);
  };

  const handleSaveDeck = () => {
    if (selectedCards.length !== 20) {
      alert("Deck must have exactly 20 cards!");
      return;
    }
    saveDeck(selectedCards.map((card) => card.id));
    alert("Deck saved!");
    onDeckSaved();
  };

  return (
    <div className="flex min-h-screen text-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Player Info</h2>
        <p className="mb-2">👤 {wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "Not connected"}</p>
        <p className="mb-4">🃏 Cards: {userCardCollection.length}</p>
        <button onClick={onBack} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full mb-2">
          🔙 Back
        </button>
        <button disabled className="bg-gray-700 px-4 py-2 rounded w-full mb-2 opacity-70">
          📘 My Decks (soon)
        </button>
        <button disabled className="bg-gray-700 px-4 py-2 rounded w-full opacity-70">
          🗂️ Collection (soon)
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-4">Build Your Deck</h2>
        <p className="mb-2">Select up to 20 cards</p>
        <div className="grid grid-cols-3 gap-3">
          {availableCards.map((card) => (
            <div
              key={card.uniqueId}
              className="bg-gray-700 p-2 rounded hover:scale-105 transform transition cursor-pointer text-center border border-yellow-500"
              onClick={() => handleCardClick(card)}
            >
              <img
                src={`./cards/${card.id}.png`}
                alt={card.name}
                className="w-full h-32 object-contain mb-2"
              />
              <p className="font-bold">{card.name}</p>
              <p className="text-sm">Cost: {card.cost} ETH</p>
              <p className="text-sm">Damage: {card.damage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="w-64 bg-gray-800 p-4">
        <h3 className="text-lg font-semibold mb-2">🧩 Deck Preview ({selectedCards.length}/20)</h3>
        <div className="space-y-1 max-h-[70vh] overflow-y-auto">
          {selectedCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className="flex justify-between bg-gray-700 px-2 py-1 rounded text-sm hover:bg-red-700 cursor-pointer"
              onClick={() => handleRemoveCard(index)}
            >
              <span>{card.name}</span>
              <span>❌</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveDeck}
          disabled={selectedCards.length !== 20}
          className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded w-full font-bold"
        >
          💾 Save Deck
        </button>
      </div>
    </div>
  );
};

export default DeckBuilder;
