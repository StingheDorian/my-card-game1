import React, { useState, useEffect } from "react";
import { allCards } from "../data/heroCards";
import { userCardCollection } from "../data/userCards";
import { saveDeck } from "../data/deckStorage";

const DeckBuilder = ({ onBack, onDeckSaved, wallet }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [savedDecks, setSavedDecks] = useState({});
  const [viewingSavedDeck, setViewingSavedDeck] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  useEffect(() => {
    const decks = JSON.parse(localStorage.getItem("savedDecks") || "{}");
    setSavedDecks(decks);
  }, []);

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
    const name = prompt("Enter deck name:");
    if (!name) return;

    const updatedDecks = { ...savedDecks, [name]: selectedCards.map((c) => c.id) };
    localStorage.setItem("savedDecks", JSON.stringify(updatedDecks));
    setSavedDecks(updatedDecks);
    alert("Deck saved!");
    setSelectedCards([]);
    onDeckSaved();
  };

  const loadSavedDeck = (deckName) => {
    const deckIds = savedDecks[deckName];
    const cards = deckIds.map((id) => allCards[id]);
    setViewingSavedDeck(cards);
  };

  const returnToCollection = () => {
    setViewingSavedDeck(null);
  };

  const displayedCards = viewingSavedDeck || availableCards;

  return (
    <div
      className="flex min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url(/images/portal2.png)" }}
    >
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 bg-opacity-90 p-4">
        <h2 className="text-xl font-bold mb-4">Player Info</h2>
        <p className="mb-2">
          👤 {wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "Not connected"}
        </p>
        <p className="mb-4">🃏 Cards: {userCardCollection.length}</p>

        <h3 className="text-lg font-bold mt-6 mb-2">🗃️ Saved Decks</h3>
        {Object.keys(savedDecks).length === 0 ? (
          <p className="text-gray-400">No decks yet!</p>
        ) : (
          <ul className="space-y-2">
            {Object.keys(savedDecks).map((name) => (
              <li
                key={name}
                onClick={() => loadSavedDeck(name)}
                className="text-blue-400 hover:text-blue-200 cursor-pointer"
              >
                📁 {name}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onBack}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full mt-6"
        >
          🔙 Back
        </button>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-4 pt-10 max-h-screen overflow-y-auto bg-black bg-opacity-40 border-l border-white">
        <h2 className="text-2xl font-bold mb-4">
          {viewingSavedDeck ? "🧩 Viewing Saved Deck" : "🧩 Build Your Deck"}
        </h2>
        {viewingSavedDeck && (
          <button
            onClick={returnToCollection}
            className="mb-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded font-bold"
          >
            🔙 Return to Collection
          </button>
        )}

        <p className="mb-2">
          {viewingSavedDeck
            ? `Deck contains ${viewingSavedDeck.length} cards`
            : `Select up to 20 cards`}
        </p>

        <div className="grid grid-cols-4 gap-4">
          {displayedCards.map((card, index) => (
            <div
              key={card.uniqueId || `${card.id}-${index}`}
              className={`bg-gray-700 p-1 rounded hover:scale-105 transform transition cursor-pointer text-center border ${
                selectedCards.includes(card) ? "border-blue-500" : "border-yellow-500"
              }`}
              onClick={!viewingSavedDeck ? () => handleCardClick(card) : undefined}
            >
              <img
                src={`./cards/${card.id}.png`}
                alt={card.name}
                className="w-full h-20 object-contain mb-1"
              />
              <p className="font-bold text-xs">{card.name}</p>
              <p className="text-[10px]">Cost: {card.cost} ETH</p>
              <p className="text-[10px]">Damage: {card.damage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Deck Preview */}
      {!viewingSavedDeck && (
        <div className="w-64 bg-gray-800 bg-opacity-90 p-4 relative">
          <h3 className="text-lg font-bold mb-2">🧩 Deck Preview ({selectedCards.length}/20)</h3>
          <div className="space-y-1 max-h-[70vh] overflow-y-auto">
            {selectedCards.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                className="flex justify-between bg-gray-700 px-2 py-1 rounded text-sm hover:bg-red-700 cursor-pointer relative"
                onClick={() => handleRemoveCard(index)}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <span>{card.name}</span>
                <span>❌</span>
                {hoveredCardId === card.id && (
                  <img
                    src={`./cards/${card.id}.png`}
                    alt={card.name}
                    className="absolute right-full mr-2 w-16 h-16 object-contain z-50 border border-white"
                    style={{ top: "-4px" }}
                  />
                )}
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
      )}
    </div>
  );
};

export default DeckBuilder;
