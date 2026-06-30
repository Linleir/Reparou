import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "../utils/api";

const saved = JSON.parse(localStorage.getItem("reparouAuth") || "null");

export const loginComCredenciais = createAsyncThunk(
  "auth/loginComCredenciais",
  async ({ documento, senha }, { rejectWithValue }) => {
    try {
      return await apiPost("auth/login", { documento, senha }, { skipRefresh: true });
    } catch (error) {
      return rejectWithValue({
        status: error?.status,
        serverError: error?.serverError,
        message: error?.message,
      });
    }
  }
);

export const registerCliente = createAsyncThunk(
  "auth/registerCliente",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiPost(
        "auth/register/cliente",
        {
          ...payload,
          role: "cliente",
          favoritos: [],
        },
        { skipRefresh: true }
      );
    } catch (error) {
      return rejectWithValue({
        status: error?.status,
        serverError: error?.serverError,
        details: error?.details,
        message: error?.message,
      });
    }
  }
);

export const registerLojista = createAsyncThunk(
  "auth/registerLojista",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiPost(
        "auth/register/lojista",
        {
          ...payload,
          role: "lojista",
        },
        { skipRefresh: true }
      );
    } catch (error) {
      return rejectWithValue({
        status: error?.status,
        serverError: error?.serverError,
        details: error?.details,
        message: error?.message,
      });
    }
  }
);

export const logoutUsuario = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      await apiPost("auth/logout", {});
    } catch (_) {
      // Continuar com logout mesmo se falhar
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState: {
    user: saved?.user || null,
    role: saved?.role || null,
    accessToken: saved?.accessToken || null,
    refreshToken: saved?.refreshToken || null,
  },
  reducers: {
    loginGuest(state) {
      state.user = {
        id: "guest",
        nome: "Visitante",
        role: "guest",
      };
      state.role = "guest";
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.setItem(
        "reparouAuth",
        JSON.stringify({
          user: state.user,
          role: "guest",
          accessToken: null,
          refreshToken: null,
        })
      );
    },

    loginSuccess(state, action) {
  state.user = action.payload.usuario;
  state.role = action.payload.usuario?.role;
  state.accessToken = action.payload.accessToken || null;
  state.refreshToken = action.payload.refreshToken || null;

  const authData = {
    user: state.user,
    role: state.role,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  };

  localStorage.setItem(
    "reparouAuth",
    JSON.stringify(authData)
  );

  if (state.refreshToken) {
    localStorage.setItem(
      "reparouRefreshToken",
      state.refreshToken
    );
  }
},

    logout(state) {
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("reparouAuth");
      localStorage.removeItem("reparouRefreshToken");
    },

    updateAccessToken(state, action) {
      state.accessToken = action.payload;
      const saved = JSON.parse(localStorage.getItem("reparouAuth") || "null");
      if (saved) {
        saved.accessToken = action.payload;
        localStorage.setItem("reparouAuth", JSON.stringify(saved));
      }
    },
  },

  extraReducers: (builder) => {
  builder
    .addCase(loginComCredenciais.fulfilled, (state, action) => {
      state.user = action.payload.usuario;
      state.role = action.payload.usuario?.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      const authData = {
        user: state.user,
        role: state.role,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      };

      localStorage.setItem("reparouAuth", JSON.stringify(authData));

      if (state.refreshToken) {
        localStorage.setItem(
          "reparouRefreshToken",
          state.refreshToken
        );
      }
    })

    .addCase(registerCliente.fulfilled, (state, action) => {
      state.user = action.payload.usuario;
      state.role = action.payload.usuario?.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      const authData = {
        user: state.user,
        role: state.role,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      };

      localStorage.setItem("reparouAuth", JSON.stringify(authData));

      if (state.refreshToken) {
        localStorage.setItem(
          "reparouRefreshToken",
          state.refreshToken
        );
      }
    })

    .addCase(registerLojista.fulfilled, (state, action) => {
      state.user = action.payload.usuario;
      state.role = action.payload.usuario?.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      const authData = {
        user: state.user,
        role: state.role,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      };

      localStorage.setItem("reparouAuth", JSON.stringify(authData));

      if (state.refreshToken) {
        localStorage.setItem(
          "reparouRefreshToken",
          state.refreshToken
        );
      }
    })

    .addCase(logoutUsuario.fulfilled, (state) => {
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("reparouAuth");
      localStorage.removeItem("reparouRefreshToken");
    });
}
});

export const { loginSuccess, logout, loginGuest, updateAccessToken } = slice.actions;
export default slice.reducer;
