import './App.css';
import React, { useState } from "react";
import MainMenu from "./components/MainMenu";
import DeckBuilder from "./components/DeckBuilder";
import Lobby from "./components/Lobby";
import CardDuelGame from "./components/CardDuelGame";
import HighScores from "./components/HighScores"; // Optional

function App() {
  const [screen, setScreen] = useState("menu");
  const [selectedDeck, setSelectedDeck] = useState(null);

  const renderScreen = () => {
    switch (screen) {
      case "deckbuilder":
        return <DeckBuilder onBack={() => setScreen("menu")} />;
      case "lobby":
        return (
          <Lobby
            onBack={() => setScreen("menu")}
            onStartGame={(deck) => {
              setSelectedDeck(deck);
              setScreen("game");
            }}
          />
        );
      case "game":
        return (
          <CardDuelGame
            playerDeck={selectedDeck}
            onBack={() => setScreen("menu")}
          />
        );
      case "highscores":
        return <HighScores onBack={() => setScreen("menu")} />;
      default:
        return <MainMenu onNavigate={setScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {renderScreen()}
    </div>
  );
}

export default App;
