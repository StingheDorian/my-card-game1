import React from "react";
import WalletConnect from "./WalletConnect";

const MainMenu = ({ onNavigate, onWalletConnected }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-8">🎴 Card Duel Game</h1>

      {/* Wallet Connection */}
      <WalletConnect onWalletConnected={onWalletConnected} />

      {/* Menu Buttons */}
      <div className="flex flex-col gap-4 mt-6">
        <button
          onClick={() => onNavigate("deckbuilder")}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-lg font-semibold"
        >
          🧩 Build Deck
        </button>

        <button
          onClick={() => onNavigate("lobby")}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded text-lg font-semibold"
        >
          🕹️ Enter Lobby
        </button>

        <button
          onClick={() => onNavigate("highscores")}
          className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded text-lg font-semibold"
        >
          🏆 High Scores
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
