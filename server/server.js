// server/server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data (will reset when you restart the server)
let gameState = {
  globalTurn: 1,
  players: [
    // Example initial data
    { id: 1, name: "Player 1", life: 40, commanderTax: 0, backgroundUrl: "" },
    { id: 2, name: "Player 2", life: 40, commanderTax: 0, backgroundUrl: "" }
  ],
};

// GET the entire game state
app.get('/api/state', (req, res) => {
  res.json(gameState);
});

// Update turn count
app.post('/api/turn', (req, res) => {
  const { direction } = req.body; // 'next' or 'prev'
  if (direction === 'next') {
    gameState.globalTurn += 1;
  } else if (direction === 'prev') {
    if (gameState.globalTurn > 1) {
      gameState.globalTurn -= 1;
    }
  }
  res.json(gameState);
});

// Add a new player
app.post('/api/players', (req, res) => {
  const { name } = req.body; // We expect { name: "Player N" }
  const newId = gameState.players.length
    ? Math.max(...gameState.players.map(p => p.id)) + 1
    : 1;
  const newPlayer = {
    id: newId,
    name: name || `Player ${newId}`,
    life: 40,
    commanderTax: 0,
    backgroundUrl: "",
  };
  gameState.players.push(newPlayer);
  res.json(gameState);
});

// Remove a player
app.delete('/api/players/:id', (req, res) => {
  const playerId = Number(req.params.id);
  gameState.players = gameState.players.filter((p) => p.id !== playerId);
  res.json(gameState);
});

// Update a player's data (life, commander tax, backgroundUrl, etc.)
app.patch('/api/players/:id', (req, res) => {
  const playerId = Number(req.params.id);
  const updates = req.body; // e.g. { life: 39 } or { commanderTax: 2 }
  gameState.players = gameState.players.map((p) => {
    if (p.id === playerId) {
      return { ...p, ...updates };
    }
    return p;
  });
  res.json(gameState);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
