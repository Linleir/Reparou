import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "../utils/api";

const saved = JSON.parse(localStorage.getItem("reparouAuth") || "null");

export const loginComCredenciais = createAsyncThunk(
  "auth/loginComCredenciais",
  async ({ documento, senha }) => {
    return await apiPost("auth/login", { documento, senha });
  }
);

export const registerCliente = createAsyncThunk(
  "auth/registerCliente",
  async (payload) => {
    return await apiPost("auth/register/cliente", {
      ...payload,
      role: "cliente",
      favoritos: [],
    });
  }
);

export const registerLojista = createAsyncThunk(
  "auth/registerLojista",
  async (payload) => {
    return await apiPost("auth/register/lojista", {
      ...payload,
      role: "lojista",
    });
  }
);

const slice = createSlice({
  name: "auth",
  initialState: {
    user: saved?.user || null,
    role: saved?.role || null,
    token: saved?.token || null,
  },
  reducers: {
    loginGuest(state) {
      state.user = {
        id: "guest",
        nome: "Visitante",
        role: "guest",
      };
      state.role = "guest";
      state.token = null;

      localStorage.setItem(
        "reparouAuth",
        JSON.stringify({
          user: state.user,
          role: "guest",
          token: null,
        })
      );
    },

    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token || null;
      localStorage.setItem("reparouAuth", JSON.stringify(action.payload));
    },

    logout(state) {
      state.user = null;
      state.role = null;
      state.token = null;
      localStorage.removeItem("reparouAuth");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginComCredenciais.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
        localStorage.setItem("reparouAuth", JSON.stringify(action.payload));
      })
      .addCase(registerCliente.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
        localStorage.setItem("reparouAuth", JSON.stringify(action.payload));
      })
      .addCase(registerLojista.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
        localStorage.setItem("reparouAuth", JSON.stringify(action.payload));
      });
  },
});

export const { loginSuccess, logout, loginGuest } = slice.actions;
export default slice.reducer;
