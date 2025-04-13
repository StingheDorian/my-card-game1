// src/components/DeckBuilder.jsx
import React, { useState } from "react";

// Dummy card data — later replace with NFT data from wallet
const dummyCards = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Card ${i + 1}`,
  description: "This is a powerful card.",
  type: i % 2 === 0 ? "Hero" : "Event",
}));

const DeckBuilder = ({ onBack }) => {
  const [selectedCards, setSelectedCards] = useState([]);

  const toggleCardSelection = (card) => {
    const isSelected = selectedCards.some((c) => c.id === card.id);

    if (isSelected) {
      setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
    } else if (selectedCards.length < 20) {
      setSelectedCards((prev) => [...prev, card]);
    }
  };

  const isCardSelected = (card) => selectedCards.some((c) => c.id === card.id);

  const saveDeck = () => {
    if (selectedCards.length !== 20) {
      alert("You must select exactly 20 cards to save your deck!");
      return;
    }
    // Placeholder: Save logic goes here (localStorage, backend, etc.)
    console.log("Deck saved:", selectedCards);
    alert("✅ Deck saved successfully!");
    onBack(); // Return to menu
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">🧩 Deck Builder</h2>
      <p className="text-center mb-2">Select 20 cards to build your deck</p>
      <p className="text-center text-sm text-gray-400 mb-4">
        Selected: {selectedCards.length}/20
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dummyCards.map((card) => (
          <div
            key={card.id}
            onClick={() => toggleCardSelection(card)}
            className={`cursor-pointer border rounded-xl p-4 shadow transition ${
              isCardSelected(card)
                ? "bg-blue-600 border-blue-400"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <h3 className="text-lg font-semibold">{card.name}</h3>
            <p className="text-sm text-gray-300">{card.description}</p>
            <p className="text-xs mt-2 italic text-yellow-400">{card.type}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={saveDeck}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded font-semibold"
        >
          💾 Save Deck
        </button>
        <button
          onClick={onBack}
          className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded font-semibold"
        >
          🔙 Back to Menu
        </button>
      </div>
    </div>
  );
};

export default DeckBuilder;
