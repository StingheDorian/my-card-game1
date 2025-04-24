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
  const [turn, setTurn] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted && playerDeck?.length) {
      const p1Deck = playerDeck.map((id) => allCards[id]);
      const p2Deck = Array.from({ length: 20 }, (_, i) => ({
        ...allCards[Object.keys(allCards)[i % Object.keys(allCards).length]],
        id: `${Object.keys(allCards)[i % Object.keys(allCards).length]}_${i}`,
      }));

      setPlayer1((p) => ({
        ...p,
        deck: p1Deck,
        hand: p1Deck.slice(0, 5),
      }));

      setPlayer2((p) => ({
        ...p,
        deck: p2Deck,
        hand: p2Deck.slice(0, 5),
      }));

      setGameStarted(true);
    }
  }, [playerDeck, gameStarted]);

  useEffect(() => {
    if (player1.health <= 0) {
      onGameEnd("Player 2 Wins!");
    } else if (player2.health <= 0) {
      onGameEnd("Player 1 Wins!");
    }
  }, [player1.health, player2.health, onGameEnd]);

  const drawCard = (deck) => {
    return deck.length > 0 ? deck.shift() : null;
  };

  const handlePlayCard = (index) => {
    const currentPlayer = turn === 1 ? player1 : player2;
    const opponentPlayer = turn === 1 ? player2 : player1;
    const setCurrent = turn === 1 ? setPlayer1 : setPlayer2;
    const setOpponent = turn === 1 ? setPlayer2 : setPlayer1;

    const card = currentPlayer.hand[index];
    if (!card || card.cost > currentPlayer.eth) return;

    const updatedHand = [...currentPlayer.hand];
    updatedHand.splice(index, 1);

    let updatedOpponentHealth = opponentPlayer.health;
    if (card.type === "hero") {
      updatedOpponentHealth -= card.damage;
    }

    setCurrent({
      ...currentPlayer,
      eth: Math.min(10, currentPlayer.eth - card.cost),
      hand: updatedHand,
      playedCards: [...currentPlayer.playedCards, card],
    });

    setOpponent({
      ...opponentPlayer,
      health: updatedOpponentHealth,
    });

    setTimeout(() => {
      const newTurn = turn === 1 ? 2 : 1;
      const nextPlayer = newTurn === 1 ? player1 : player2;
      const setNext = newTurn === 1 ? setPlayer1 : setPlayer2;
      const drawnCard = drawCard(nextPlayer.deck);

      setNext({
        ...nextPlayer,
        eth: Math.min(10, nextPlayer.eth + 1),
        hand: drawnCard ? [...nextPlayer.hand, drawnCard] : nextPlayer.hand,
      });

      setTurn(newTurn);
    }, 1000);
  };

  const renderPlayer = (player, number) => (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-2">Player {number}</h3>
      <p>Health: {player.health} USDT</p>
      <p>ETH: {player.eth}</p>
      <div className="flex gap-2 mt-2 flex-wrap">
        {player.hand.map((card, idx) => (
          <div
            key={`${card.id}-${idx}`}
            className="border rounded p-2 w-28 text-center bg-gray-800 hover:bg-gray-700 cursor-pointer"
            onClick={() => (turn === number ? handlePlayCard(idx) : null)}
          >
            <p className="font-bold">{card.name}</p>
            <p>Type: {card.type}</p>
            <p>Cost: {card.cost} ETH</p>
            <p>Damage: {card.damage}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl text-center mb-4">⚔️ Card Duel Game</h2>
      <p className="text-center mb-6">Turn: Player {turn}</p>
      {renderPlayer(player1, 1)}
      <hr className="my-6" />
      {renderPlayer(player2, 2)}
    </div>
  );
};

export default CardDuelGame;
