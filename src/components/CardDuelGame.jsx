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
  const [turn, setTurn] = useState(2); // Player 2 is user
  const [gameStarted, setGameStarted] = useState(false);
  const [mulliganHand, setMulliganHand] = useState([]);
  const [selectedMulligan, setSelectedMulligan] = useState([]);
  const [rerolled, setRerolled] = useState(false);
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
      setGameStarted(true);
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

  const handleReroll = () => {
    if (rerolled) return;
    const rerolledCards = mulliganHand.map((card) =>
      selectedMulligan.includes(card)
        ? card
        : allCards[Object.keys(allCards)[Math.floor(Math.random() * Object.keys(allCards).length)]]
    );
    setMulliganHand(rerolledCards);
    setRerolled(true);
  };

  const handleAutoSelect = () => {
    const autoPick = [...selectedMulligan];
    const remainder = mulliganHand.filter((c) => !autoPick.includes(c)).slice(0, 3 - autoPick.length);
    setSelectedMulligan([...autoPick, ...remainder]);
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
      <div className="flex gap-2 flex-wrap mt-2">
        {player.hand.map((card, idx) => (
          <div
            key={`${card.id}-${idx}`}
            className="bg-gray-800 p-1 rounded text-center w-20 border hover:bg-gray-700 cursor-pointer"
            onClick={() => (label === "You" && turn === 2 ? handlePlayCard(idx) : null)}
          >
            <img src={`./cards/${card.id}.png`} alt={card.name} className="w-full h-14 object-contain" />
            <p className="text-[10px] font-bold truncate">{card.name}</p>
            <p className="text-[10px]">{card.cost} ETH</p>
            <p className="text-[10px]">{card.damage} DMG</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (!gameStarted) {
    return (
      <div className="p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Choose 3 Starting Cards</h2>
        <p className="mb-2">Time left: {timer}s</p>
        <div className="flex gap-2 flex-wrap">
          {mulliganHand.map((card, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectCard(card)}
              className={`p-2 border-2 rounded text-center w-24 cursor-pointer hover:border-yellow-500 transition-all duration-200 ${
                selectedMulligan.includes(card) ? "border-blue-500" : "border-gray-600"
              }`}
            >
              <img src={`./cards/${card.id}.png`} alt={card.name} className="w-full h-16 object-contain mb-1" />
              <p className="text-xs font-bold truncate">{card.name}</p>
              <p className="text-[10px]">{card.cost} ETH</p>
              <p className="text-[10px]">{card.damage} DMG</p>
            </div>
          ))}
        </div>
        <button
          disabled={rerolled}
          onClick={handleReroll}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
        >
          ♻️ Reroll Unselected
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold text-center mb-4">⚔️ Card Duel Game</h2>
      <p className="text-center mb-6">Current Turn: {turn === 2 ? "You" : "Opponent"}</p>
      {renderPlayer(player1, "Opponent")}
      <hr className="my-4" />
      {renderPlayer(player2, "You")}
    </div>
  );
};

export default CardDuelGame;
