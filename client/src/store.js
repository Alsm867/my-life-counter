// client/src/store.js
import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './features/playersSlice';

export const store = configureStore({
  reducer: {
    players: playersReducer,
  },
});

export default store;
