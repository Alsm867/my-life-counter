// client/src/App.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGameState,
  nextTurn,
  prevTurn,
  addPlayer,
} from './features/playersSlice';
import TurnCounter from './components/TurnCounter';
import PlayerList from './components/PlayerList';

function App() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.players);

  useEffect(() => {
    dispatch(fetchGameState());
  }, [dispatch]);

  const handleAddPlayer = () => {
    const name = prompt('Enter player name:', '');
    if (name) {
      dispatch(addPlayer(name));
    }
  };

  if (status === 'loading') return <div>Loading game state...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>LifeTap Web Clone</h1>
      <TurnCounter
        onNext={() => dispatch(nextTurn())}
        onPrev={() => dispatch(prevTurn())}
      />
      <PlayerList />
      <button onClick={handleAddPlayer}>Add Player</button>
    </div>
  );
}

export default App;
