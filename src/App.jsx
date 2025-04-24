// src/App.jsx
import React, { useState } from "react";
import MainMenu from "./components/MainMenu";
import CardDuelGame from "./components/CardDuelGame";
import DeckBuilder from "./components/DeckBuilder";
import Lobby from "./components/Lobby";
import HighScores from "./components/HighScores";

function App() {
  const [screen, setScreen] = useState("menu");
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState([]);

  const handleWalletConnected = (address) => {
    console.log("Wallet connected:", address);
    setWalletAddress(address);
  };

  const handleDeckSaved = (deck) => {
    setSelectedDeck(deck);
    setScreen("game");
  };

  const handleGameEnd = (message) => {
    alert(message);
    setScreen("menu");
  };

  const renderScreen = () => {
    switch (screen) {
      case "deckbuilder":
        return (
          <DeckBuilder
            onBack={() => setScreen("menu")}
            onDeckSaved={handleDeckSaved}
            wallet={walletAddress}
          />
        );
      case "lobby":
        return <Lobby onBack={() => setScreen("menu")} wallet={walletAddress} />;
      case "highscores":
        return <HighScores onBack={() => setScreen("menu")} />;
      case "game":
        return (
          <CardDuelGame
            playerDeck={selectedDeck}
            onGameEnd={handleGameEnd}
          />
        );
      default:
        return (
          <MainMenu
            onNavigate={setScreen}
            onWalletConnected={handleWalletConnected}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {renderScreen()}
    </div>
  );
}

export default App;
