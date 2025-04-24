// src/data/deckStorage.js
const DECK_KEY = "saved_decks";

export const saveDeck = (deck) => {
  const existing = JSON.parse(localStorage.getItem(DECK_KEY)) || [];
  existing.push(deck);
  localStorage.setItem(DECK_KEY, JSON.stringify(existing));
};

export const loadDecks = () => {
  return JSON.parse(localStorage.getItem(DECK_KEY)) || [];
};
