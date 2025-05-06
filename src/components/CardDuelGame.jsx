import React, { useState, useEffect } from "react";
import { allCards } from "../data/heroCards";

const initialPlayerState = {
  health: 2000,
  eth: 1,
  deck: [],
  hand: [],
  playedCards: [],
};

const CardDuelGame = ({ playerDeck, onGameEnd }) => {
  const [player1, setPlayer1] = useState({ ...initialPlayerState });
  const [player2, setPlayer2] = useState({ ...initialPlayerState });
  const [turn, setTurn] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const [mulliganHand, setMulliganHand] = useState([]);
  const [selectedMulligan, setSelectedMulligan] = useState([]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!gameStarted && playerDeck?.length) {
      const p2Deck = playerDeck.map((id) => allCards[id]);
      const p1Deck = Array.from({ length: 20 }, (_, i) => ({
        ...allCards[Object.keys(allCards)[i % Object.keys(allCards).length]],
        id: `${Object.keys(allCards)[i % Object.keys(allCards).length]}_${i}`,
      }));

      const initialMulligan = [...p2Deck].sort(() => 0.5 - Math.random()).slice(0, 5);
      setMulliganHand(initialMulligan);

      setPlayer1((p) => ({ ...p, deck: p1Deck, hand: p1Deck.slice(0, 5) }));
      setPlayer2((p) => ({ ...p, deck: p2Deck }));
    }
  }, [playerDeck, gameStarted]);

  useEffect(() => {
    if (mulliganHand.length && selectedMulligan.length === 3) {
      const finalHand = selectedMulligan;
      setPlayer2((prev) => ({ ...prev, hand: finalHand }));
    }
  }, [selectedMulligan]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleAutoSelect();
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mulliganHand]);

  const handleSelectCard = (card) => {
    if (selectedMulligan.includes(card)) {
      setSelectedMulligan(selectedMulligan.filter((c) => c !== card));
    } else if (selectedMulligan.length < 3) {
      setSelectedMulligan([...selectedMulligan, card]);
    }
  };

  const handleAutoSelect = () => {
    const autoPick = [...selectedMulligan];
    const remainder = mulliganHand.filter((c) => !autoPick.includes(c)).slice(0, 3 - autoPick.length);
    const finalHand = [...autoPick, ...remainder];
    setSelectedMulligan(finalHand);
    setPlayer2((prev) => ({ ...prev, hand: finalHand }));
    setGameStarted(true);
  };

  const handlePlayCard = (index) => {
    const current = turn === 1 ? player1 : player2;
    const opponent = turn === 1 ? player2 : player1;
    const setCurrent = turn === 1 ? setPlayer1 : setPlayer2;
    const setOpponent = turn === 1 ? setPlayer2 : setPlayer1;

    const card = current.hand[index];
    if (!card || card.cost > current.eth) return;

    const updatedHand = [...current.hand];
    updatedHand.splice(index, 1);

    let updatedOpponentHealth = opponent.health;
    if (card.type === "hero") {
      updatedOpponentHealth -= card.damage;
    }

    setCurrent({
      ...current,
      eth: Math.min(10, current.eth - card.cost),
      hand: updatedHand,
      playedCards: [...current.playedCards, card],
    });

    setOpponent({ ...opponent, health: updatedOpponentHealth });

    setTimeout(() => {
      const nextTurn = turn === 1 ? 2 : 1;
      const nextPlayer = nextTurn === 1 ? player1 : player2;
      const setNext = nextTurn === 1 ? setPlayer1 : setPlayer2;
      const draw = nextPlayer.deck.shift();

      setNext({
        ...nextPlayer,
        eth: Math.min(10, nextPlayer.eth + 1),
        hand: draw ? [...nextPlayer.hand, draw] : nextPlayer.hand,
      });

      setTurn(nextTurn);
    }, 800);
  };

  const renderPlayer = (player, label) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold">{label}</h3>
      <p>❤️ {player.health} USDT | 💠 ETH: {player.eth}</p>
      <div className="relative h-24 mt-2 overflow-visible">
        {player.hand.map((card, idx) => (
          <div
            key={`${card.id}-${idx}`}
            className="absolute bg-gray-800 p-1 rounded text-center w-16 border hover:bg-gray-700 cursor-pointer"
            style={{ left: `${idx * 32}px`, zIndex: idx }}
            onClick={() => (label === "You" && turn === 2 ? handlePlayCard(idx) : null)}
          >
            <img src={`./cards/${card.id}.png`} alt={card.name} className="w-full h-10 object-contain" />
            <p className="text-[7px] font-bold truncate">{card.name}</p>
            <p className="text-[7px]">{card.cost} ETH</p>
            <p className="text-[7px]">{card.damage} DMG</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (!gameStarted) {
    return (
      <div
        className="p-6 text-white min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url(/images/arena.png)" }}
      >
        <h2 className="text-xl font-bold mb-4">Choose 3 Starting Cards</h2>
        <p className="mb-2">Time left: {timer}s</p>
        <div className="flex justify-center gap-4">
          {mulliganHand.map((card, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectCard(card)}
              className={`p-2 border-4 rounded text-center w-20 cursor-pointer transition-all duration-200 ${
                selectedMulligan.includes(card)
                  ? "border-yellow-400 shadow-md shadow-yellow-400"
                  : "border-gray-600 hover:border-yellow-500"
              }`}
            >
              <img
                src={`./cards/${card.id}.png`}
                alt={card.name}
                className="w-full h-12 object-contain mb-1"
              />
              <p className="text-[8px] font-bold truncate">{card.name}</p>
              <p className="text-[8px]">{card.cost} ETH</p>
              <p className="text-[8px]">{card.damage} DMG</p>
            </div>
          ))}
        </div>
        {selectedMulligan.length === 3 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setGameStarted(true)}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold"
            >
              ✅ Ready
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="p-4 text-white min-h-screen bg-cover bg-center overflow-y-auto"
      style={{ backgroundImage: "url(/images/arena.png)" }}
    >
      <div className="grid grid-rows-2 h-full">
        <div>
          <h2 className="text-xl font-bold text-center mb-4">⚔️ Card Duel Game</h2>
          <p className="text-center mb-6">Current Turn: {turn === 2 ? "You" : "Opponent"}</p>
          {renderPlayer(player1, "Opponent")}
        </div>
        <div className="mt-10">
          {renderPlayer(player2, "You")}
        </div>
      </div>
    </div>
  );
};

export default CardDuelGame;
