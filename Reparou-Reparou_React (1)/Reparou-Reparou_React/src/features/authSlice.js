import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "../utils/api";

const saved = JSON.parse(localStorage.getItem("reparouAuth") || "null");














export const loginCliente = createAsyncThunk(
  "auth/loginCliente",
  async ({ cpf, senha }) => {
    const res = await fetch("http://localhost:3001/clientes");
    const clientes = await res.json();

    const user = clientes.find(
      (c) => c.cpf === cpf && c.senha === senha
    );

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    return user;
  }
);








/* =========================
   REGISTER CLIENTE
========================= */
export const registerCliente = createAsyncThunk(
  "auth/registerCliente",
  async (payload) => {
    const user = await apiPost("clientes", {
      ...payload,
      role: "cliente",
      favoritos: [],
    });

    return user;
  }
);

/* =========================
   REGISTER LOJISTA
========================= */
export const registerLojista = createAsyncThunk(
  "auth/registerLojista",
  async (payload) => {
    const user = await apiPost("lojistas", {
      ...payload,
      role: "lojista",
    });

    return user;
  }
);

/* =========================
   SLICE
========================= */
const slice = createSlice({
  name: "auth",
  initialState: {
    user: saved?.user || null,
    role: saved?.role || null,
  },
  reducers: {
    loginGuest(state) {
  state.user = {
    id: "guest",
    nome: "Visitante",
    role: "guest",
  };

  state.role = "guest";

  localStorage.setItem(
    "reparouAuth",
    JSON.stringify({
      user: state.user,
      role: "guest",
    })
  );
},


    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      localStorage.setItem("reparouAuth", JSON.stringify(action.payload));
    },

    logout(state) {
      state.user = null;
      state.role = null;
      localStorage.removeItem("reparouAuth");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginCliente.fulfilled, (state, action) => {
  state.user = action.payload;
  state.role = "cliente";

  localStorage.setItem(
    "reparouAuth",
    JSON.stringify({
      user: action.payload,
      role: "cliente",
    })
  );
})


    
      .addCase(registerCliente.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = "cliente";
      })
      .addCase(registerLojista.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = "lojista";
      });
  },
});

export const { loginSuccess, logout, loginGuest } = slice.actions;
export default slice.reducer;