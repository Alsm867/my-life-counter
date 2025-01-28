// client/src/features/playersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Async thunks for server communication
export const fetchGameState = createAsyncThunk(
  'players/fetchGameState',
  async () => {
    const response = await axios.get(`${API_BASE}/state`);
    return response.data;
  }
);

export const nextTurn = createAsyncThunk('players/nextTurn', async () => {
  const response = await axios.post(`${API_BASE}/turn`, { direction: 'next' });
  return response.data;
});

export const prevTurn = createAsyncThunk('players/prevTurn', async () => {
  const response = await axios.post(`${API_BASE}/turn`, { direction: 'prev' });
  return response.data;
});

export const addPlayer = createAsyncThunk('players/addPlayer', async (name) => {
  const response = await axios.post(`${API_BASE}/players`, { name });
  return response.data;
});

export const removePlayer = createAsyncThunk('players/removePlayer', async (id) => {
  const response = await axios.delete(`${API_BASE}/players/${id}`);
  return response.data;
});

export const updatePlayer = createAsyncThunk(
  'players/updatePlayer',
  async ({ id, updates }) => {
    const response = await axios.patch(`${API_BASE}/players/${id}`, updates);
    return response.data;
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState: {
    globalTurn: 1,
    players: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchGameState
      .addCase(fetchGameState.fulfilled, (state, action) => {
        state.globalTurn = action.payload.globalTurn;
        state.players = action.payload.players;
        state.status = 'succeeded';
      })
      .addCase(fetchGameState.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGameState.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // nextTurn, prevTurn
      .addCase(nextTurn.fulfilled, (state, action) => {
        state.globalTurn = action.payload.globalTurn;
        state.players = action.payload.players;
      })
      .addCase(prevTurn.fulfilled, (state, action) => {
        state.globalTurn = action.payload.globalTurn;
        state.players = action.payload.players;
      })
      // addPlayer
      .addCase(addPlayer.fulfilled, (state, action) => {
        state.globalTurn = action.payload.globalTurn;
        state.players = action.payload.players;
      })
      // removePlayer
      .addCase(removePlayer.fulfilled, (state, action) => {
        state.globalTurn = action.payload.globalTurn;
        state.players = action.payload.players;
      })
      // updatePlayer
      .addCase(updatePlayer.fulfilled, (state, action) => {
        state.globalTurn = action.payload.globalTurn;
        state.players = action.payload.players;
      });
  },
});

export default playersSlice.reducer;
