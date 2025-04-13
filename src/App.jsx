import React, { useState } from "react";
import MainMenu from "./components/MainMenu";
import CardDuelGame from "./components/CardDuelGame";
import DeckBuilder from "./components/DeckBuilder";
import Lobby from "./components/Lobby"; // Stub if needed
import HighScores from "./components/HighScores"; // Stub if needed

function App() {
  const [screen, setScreen] = useState("menu");
  const [walletAddress, setWalletAddress] = useState(null);

  const handleWalletConnected = (address) => {
    console.log("Wallet connected:", address);
    setWalletAddress(address);
  };

  const renderScreen = () => {
    switch (screen) {
      case "deckbuilder":
        return <DeckBuilder onBack={() => setScreen("menu")} wallet={walletAddress} />;
      case "lobby":
        return <Lobby onBack={() => setScreen("menu")} wallet={walletAddress} />;
      case "highscores":
        return <HighScores onBack={() => setScreen("menu")} />;
      case "game":
        return <CardDuelGame onBack={() => setScreen("menu")} wallet={walletAddress} />;
      default:
        return <MainMenu onNavigate={setScreen} onWalletConnected={handleWalletConnected} />;
    }
  };

  return <div className="min-h-screen bg-gray-900 text-white">{renderScreen()}</div>;
}

export default App;
