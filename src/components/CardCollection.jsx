// src/components/CardCollection.jsx
import React from 'react';
import { Button } from "./Button"; // Adjust based on your Button location

const CardCollection = ({ cards, onSelectDeck, onBack }) => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Select Your Deck</h1>
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="border rounded shadow p-4">
            <h2>{card.name}</h2>
            <p>Type: {card.type}</p>
            <p>Attack: {card.attack}</p>
            <p>Cost: {card.cost}</p>
            <Button onClick={() => onSelectDeck(card)}>Select</Button>
          </div>
        ))}
      </div>
      <Button onClick={onBack}>Back to Start</Button>
    </div>
  );
};

export default CardCollection;
