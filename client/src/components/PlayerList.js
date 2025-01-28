// PlayerList.js (example)
import React from 'react';
import { useSelector } from 'react-redux';
import PlayerCard from './PlayerCard';

export default function PlayerList() {
  const players = useSelector((state) => state.players.players);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
      }}
    >
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );

}
