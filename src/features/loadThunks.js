
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../utils/api";

export const loadData = createAsyncThunk(
  'data/load',
  async () => {
    const [
      clientes,
      lojistas,
      admins,
      lojas,
      chats,
      reviews,
      denuncias,
      agendamentos
    ] = await Promise.all([
      apiGet('clientes'),
      apiGet('lojistas'),
      apiGet('admins'),
      apiGet('lojas'),
      apiGet('chats'),
      apiGet('reviews'),
      apiGet('denuncias'),
      apiGet('agendamentos'),
    ]);

    return {
      clientes,
      lojistas,
      admins,
      lojas,
      chats,
      reviews,
      denuncias,
      agendamentos
    };
  }
);

