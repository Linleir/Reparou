import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "../../utils/api";

export const registerCliente = createAsyncThunk(
  "auth/registerCliente",
  async (payload) => {
    const newUser = await apiPost("clientes", {
      ...payload,
      role: "cliente",
      favoritos: [],
    });

    return newUser;
  }
);

export const registerLojista = createAsyncThunk(
  "auth/registerLojista",
  async (payload) => {
    const newUser = await apiPost("lojistas", {
      ...payload,
      role: "lojista",
    });

    return newUser;
  }
);