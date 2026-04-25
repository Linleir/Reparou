import React from "react";
import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('reparouAuth') || 'null');

const slice = createSlice({
  name: 'auth',
  initialState: { user: saved?.user || null, role: saved?.role || null },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      localStorage.setItem('reparouAuth', JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      state.role = null;
      localStorage.removeItem('reparouAuth');
    },
  },
});

export const { loginSuccess, logout } = slice.actions;
export default slice.reducer;
