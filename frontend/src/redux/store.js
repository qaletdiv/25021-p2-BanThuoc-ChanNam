// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer, // ← Thêm reducer hợp lệ
    },
  });
};