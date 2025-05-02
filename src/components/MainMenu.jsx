// src/components/MainMenu.jsx
import React from "react";
import WalletConnect from "./WalletConnect";

const MainMenu = ({ onNavigate, onWalletConnected }) => {
  return (
    <div className="relative h-screen overflow-hidden text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/background.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/60">
        <h1 className="text-4xl font-bold mb-8">🎴 Card Duel Game</h1>

        <WalletConnect onWalletConnected={onWalletConnected} />

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
    </div>
  );
};

export default MainMenu;
