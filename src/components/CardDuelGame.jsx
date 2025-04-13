import React, { useState, useEffect } from "react";

const initialPlayerState = {
  health: 2000,
  eth: 1,
  deck: [],
  hand: [],
  playedCards: [],
};

const generateDummyCard = (id) => ({
  id,
  name: `Card ${id}`,
  type: id % 2 === 0 ? "hero" : "event",
  cost: Math.floor(Math.random() * 5) + 1,
  damage: Math.floor(Math.random() * 200) + 50,
});

const CardDuelGame = ({ playerDeck, onGameOver }) => {
  const [player1, setPlayer1] = useState({ ...initialPlayerState });
  const [player2, setPlayer2] = useState({ ...initialPlayerState });
  const [turn, setTurn] = useState(1); // 1 or 2
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted && playerDeck.length) {
      const p1Deck = playerDeck.map((id) => generateDummyCard(id));
      const p2Deck = Array.from({ length: 20 }, (_, i) => generateDummyCard(i + 100));

      setPlayer1((p) => ({
        ...p,
        deck: p1Deck,
        hand: drawCards(p1Deck, 5),
      }));

      setPlayer2((p) => ({
        ...p,
        deck: p2Deck,
        hand: drawCards(p2Deck, 5),
      }));

      setGameStarted(true);
    }
  }, [playerDeck, gameStarted]);

  useEffect(() => {
    // Check for end game
    if (player1.health <= 0) {
      onGameOver("Player 2");
    } else if (player2.health <= 0) {
      onGameOver("Player 1");
    }
  }, [player1.health, player2.health, onGameOver]);

  const drawCards = (deck, count) => {
    return deck.splice(0, count);
  };

  const handlePlayCard = (index) => {
    const current = turn === 1 ? player1 : player2;
    const opponent = turn === 1 ? player2 : player1;
    const setCurrent = turn === 1 ? setPlayer1 : setPlayer2;
    const setOpponent = turn === 1 ? setPlayer2 : setPlayer1;

    const card = current.hand[index];
    if (card.cost > current.eth) return;

    const newHand = [...current.hand];
    newHand.splice(index, 1);

    let newOpponentHealth = opponent.health;
    if (card.type === "hero") {
      newOpponentHealth -= card.damage;
    }

    setCurrent({
      ...current,
      eth: Math.min(10, current.eth - card.cost),
      hand: newHand,
      playedCards: [...current.playedCards, card],
    });

    setOpponent({ ...opponent, health: newOpponentHealth });

    setTimeout(() => {
      const newTurn = turn === 1 ? 2 : 1;
      const newCurrent = newTurn === 1 ? player1 : player2;
      const newSetCurrent = newTurn === 1 ? setPlayer1 : setPlayer2;

      newSetCurrent({
        ...newCurrent,
        eth: Math.min(10, newCurrent.eth + 1),
        hand: [...newCurrent.hand, ...drawCards(newCurrent.deck, 1)],
      });

      setTurn(newTurn);
    }, 1000);
  };

  const renderPlayer = (player, playerNum) => (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-2">Player {playerNum}</h3>
      <p>Health: {player.health} USDT</p>
      <p>ETH: {player.eth}</p>
      <div className="flex gap-2 mt-2">
        {player.hand.map((card, idx) => (
          <div
            key={idx}
            className="border rounded p-2 w-28 text-center bg-gray-800 hover:bg-gray-700 cursor-pointer"
            onClick={() => (turn === playerNum ? handlePlayCard(idx) : null)}
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
