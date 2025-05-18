// Hover preview only for player2, lifted hovered cards, glowing outline, drag-and-drop, and board rendering with board zones.
import React, { useState, useEffect } from "react";
import { allCards } from "../data/heroCards";

// Number of card slots each player has on the board
const BOARD_SLOTS = 7;

// Initial player state setup
const initialPlayerState = {
  health: 2000,
  eth: 1,
  deck: [],
  hand: [],
  playedCards: Array(BOARD_SLOTS).fill(null),
};

const CardDuelGame = ({ playerDeck, onGameEnd }) => {
  // State hooks for both players and game controls
  const [player1, setPlayer1] = useState({ ...initialPlayerState });
  const [player2, setPlayer2] = useState({ ...initialPlayerState });
  const [turn, setTurn] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [mulliganHand, setMulliganHand] = useState([]);
  const [selectedMulligan, setSelectedMulligan] = useState([]);
  const [timer, setTimer] = useState(30);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [hoveredCardOwner, setHoveredCardOwner] = useState(null);
  const [hoveredBoardCardIndex, setHoveredBoardCardIndex] = useState(null);

  const PLAYER_BOARD_OFFSET = 250;

  const drawCard = (setPlayer, player) => {
    const draw = player.deck.shift();
    setPlayer({
      ...player,
      eth: Math.min(10, player.eth + 1),
      hand: draw ? [...player.hand, draw] : player.hand,
    });
  };

  const endTurn = () => {
    const nextTurn = turn === 1 ? 2 : 1;
    const currentSet = nextTurn === 1 ? setPlayer1 : setPlayer2;
    const currentPlayer = nextTurn === 1 ? player1 : player2;
    drawCard(currentSet, currentPlayer);
    setTurn(nextTurn);
    setTimer(60);
  };

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
      setPlayer2((prev) => ({ ...prev, hand: selectedMulligan }));
    }
  }, [selectedMulligan]);

  useEffect(() => {
    if (!gameStarted || turn === null) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endTurn();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [turn, gameStarted]);

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
    setTurn(Math.random() < 0.5 ? 1 : 2);
    setTimer(60);
    setGameStarted(true);
  };

  const handleDropCard = (event, index) => {
    event.preventDefault();
    const cardIndex = parseInt(event.dataTransfer.getData("cardIndex"));
    handlePlayCard(cardIndex, index);
  };

  const handlePlayCard = (cardIndex, slotIndex) => {
    const current = turn === 1 ? player1 : player2;
    const setCurrent = turn === 1 ? setPlayer1 : setPlayer2;
    const card = current.hand[cardIndex];
    if (!card || card.cost > current.eth || current.playedCards[slotIndex]) return;
    const updatedHand = [...current.hand];
    updatedHand.splice(cardIndex, 1);
    const newPlayedCards = [...current.playedCards];
    newPlayedCards[slotIndex] = card;
    setCurrent({
      ...current,
      eth: Math.min(10, current.eth - card.cost),
      hand: updatedHand,
      playedCards: newPlayedCards,
    });
  };

  const renderBoardZones = (playedCards, owner) => (
    <div
      className="flex justify-center gap-4 absolute left-1/2 transform -translate-x-1/2"
      style={{
        top: owner === "Opponent" ? `calc(50% - ${PLAYER_BOARD_OFFSET}px)` : undefined,
        bottom: owner === "You" ? `calc(50% - ${PLAYER_BOARD_OFFSET}px)` : undefined,
      }}
    >
      {playedCards.map((card, index) => (
        <div
          key={index}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => owner === "You" && turn === 2 && handleDropCard(e, index)}
          onMouseEnter={() => card && setHoveredBoardCardIndex(index)}
          onMouseLeave={() => setHoveredBoardCardIndex(null)}
          className={`w-[200px] h-[240px] border border-dashed rounded bg-gray-800 flex items-center justify-center transition-shadow duration-200 ${
            hoveredBoardCardIndex === index && card ? "glow ring-4 ring-yellow-400" : ""
          }`}
        >
          {card && (
            <img
              src={`./cards/${card.id}.png`}
              alt={card.name}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPlayer = (player, label) => (
    <div className="relative w-full max-w-[100vw] aspect-[16/9] flex flex-col items-center justify-end mx-auto" style={{ height: '50%' }}>
      {renderBoardZones(player.playedCards, label)}
      <div
        className="absolute w-full flex justify-center"
        style={{
          top: label === "Opponent" ? "-60px" : undefined,
          bottom: label === "You" ? "60px" : undefined,
        }}
      >
        <div className="relative" style={{ width: `${player.hand.length * 40 + 220}px` }}>
          {player.hand.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className={`absolute bg-gray-800 p-1 rounded text-center border cursor-pointer transition-transform duration-200 ${
                hoveredCard && hoveredCard.id === card.id && hoveredCardOwner === label && label === "You" ? 'glow ring-2 ring-yellow-400' : ''
              }`}
              style={{
                left: `${idx * 40}px`,
                zIndex: hoveredCard && hoveredCard.id === card.id ? 99 : idx,
                width: '220px',
                height: '260px',
                transform: hoveredCard && hoveredCard.id === card.id && hoveredCardOwner === label ? 'translateY(-20px)' : 'none'
              }}
              draggable={label === "You" && turn === 2}
              onDragStart={(e) => e.dataTransfer.setData("cardIndex", idx)}
              onMouseEnter={(e) => {
                setHoveredCard(card);
                setHoverPos({ x: e.clientX, y: e.clientY });
                setHoveredCardOwner(label);
              }}
              onMouseMove={(e) => setHoverPos({ x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img src={`./cards/${card.id}.png`} alt={card.name} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
      {hoveredCard && hoveredCardOwner === "You" && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ top: hoverPos.y - 420, left: hoverPos.x + 20 }}
        >
          <img
            src={`./cards/${hoveredCard.id}.png`}
            alt={hoveredCard.name}
            className="w-[300px] h-[400px] object-contain border-4 border-yellow-400 shadow-lg"
          />
        </div>
      )}
    </div>
  );

  if (!gameStarted) {
    return (
      <div className="p-6 text-white min-h-screen bg-cover bg-center" style={{ backgroundImage: "url(/images/arena.png)" }}>
        <h2 className="text-xl font-bold mb-4">Choose 3 Starting Cards</h2>
        <p className="mb-2">Time left: {timer}s</p>
        <div className="flex justify-center gap-4">
          {mulliganHand.map((card, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectCard(card)}
              className={`p-2 border-4 rounded text-center w-20 cursor-pointer transition-all duration-200 ${
                selectedMulligan.includes(card)
                  ? "glow ring-4 ring-yellow-400 shadow-yellow-400"
                  : "border-gray-600 hover:border-yellow-500"
              }`}
            >
              <img src={`./cards/${card.id}.png`} alt={card.name} className="w-full h-12 object-contain mb-1" />
            </div>
          ))}
        </div>
        {selectedMulligan.length === 3 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAutoSelect}
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
    <div className="flex flex-col h-screen text-white bg-cover bg-center overflow-hidden relative" style={{ backgroundImage: "url(/images/arena.png)" }}>
      <div className="w-full flex justify-center absolute top-0 left-0 right-0">{renderPlayer(player1, "Opponent")}</div>
      <div className="w-full flex justify-center absolute bottom-0 left-0 right-0">{renderPlayer(player2, "You")}</div>

      {/* Visual Turn Timer Bar */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 h-2/3 w-4 bg-gray-700 rounded-full border border-yellow-500 overflow-hidden">
        <div
          className="w-full bg-yellow-400 transition-[height] duration-1000 ease-linear"
          style={{ height: `${(timer / 60) * 100}%` }}
        ></div>
      </div>

      {/* End Turn Button */}
      <button
        onClick={endTurn}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
      >
        End Turn
      </button>
    </div>
  );
};

export default CardDuelGame;
