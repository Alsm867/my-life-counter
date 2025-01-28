// client/src/components/TurnCounter.js
import React from 'react';
import { useSelector } from 'react-redux';

export default function TurnCounter({ onNext, onPrev }) {
  const globalTurn = useSelector((state) => state.players.globalTurn);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={onPrev}>- Turn</button>
      <span style={{ margin: '0 10px' }}>Turn: {globalTurn}</span>
      <button onClick={onNext}>+ Turn</button>
    </div>
  );
}
