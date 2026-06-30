import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../utils/api";

export const loadData = createAsyncThunk(
  'data/load',
  async () => {
    const data = await apiGet('data');

    return {
      clientes: data.clientes || [],
      lojistas: data.lojistas || [],
      admins: data.admins || [],
      lojas: data.lojas || [],
      chats: data.chats || [],
      reviews: data.reviews || [],
      denuncias: data.denuncias || [],
      agendamentos: data.agendamentos || [],
    };
  }
);
