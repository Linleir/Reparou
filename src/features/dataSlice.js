import React from "react";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiGet, apiPatch, apiPost } from '../utils/api';

const initialState = {
  clientes: [],
  lojistas: [],
  admins: [],
  lojas: [],
  chats: [],
  reviews: [],
  denuncias: [],
  agendamentos: [],
  status: 'idle',
  error: null,
};

export const loadData = createAsyncThunk('data/load', async () => {
  const [clientes, lojistas, admins, lojas, chats, reviews, denuncias, agendamentos] = await Promise.all([
    apiGet('clientes'),
    apiGet('lojistas'),
    apiGet('admins'),
    apiGet('lojas'),
    apiGet('chats'),
    apiGet('reviews'),
    apiGet('denuncias'),
    apiGet('agendamentos'),
  ]);
  return { clientes, lojistas, admins, lojas, chats, reviews, denuncias, agendamentos };
});

export const toggleFavorite = createAsyncThunk('data/favorite', async ({ clienteId, lojaId }, { getState }) => {
  const cliente = getState().data.clientes.find((item) => item.id === clienteId);
  const favoritos = cliente?.favoritos || [];
  const next = favoritos.includes(lojaId) ? favoritos.filter((item) => item !== lojaId) : [...favoritos, lojaId];
  await apiPatch('clientes', clienteId, { favoritos: next });
  return { clienteId, favoritos: next };
});

export const saveClienteProfile = createAsyncThunk('data/saveClienteProfile', async ({ clienteId, payload }) => {
  await apiPatch('clientes', clienteId, payload);
  return { clienteId, payload };
});

export const sendMessage = createAsyncThunk('data/sendMessage', async ({ chat, text, author = 'cliente' }) => {
  const now = new Date().toISOString();
  const updated = {
    ...chat,
    mensagens: [
      ...(Array.isArray(chat.mensagens) ? chat.mensagens : []),
      { autor: author, texto: text, horario: now },
    ],
    atualizadoEm: now,
  };
  await apiPatch('chats', chat.id, updated);
  return updated;
});

export const createChat = createAsyncThunk('data/createChat', async (payload) => apiPost('chats', payload));

export const saveReview = createAsyncThunk('data/saveReview', async ({ review, chatId, chatStatus }) => {
  const saved = review.id ? await apiPatch('reviews', review.id, review) : await apiPost('reviews', review);
  await apiPatch('chats', chatId, { avaliacaoId: saved.id, status: chatStatus || 'finalizado-avaliado' });
  return { review: saved, chatId };
});

export const saveDenuncia = createAsyncThunk('data/saveDenuncia', async (payload) => apiPost('denuncias', payload));

export const saveLoja = createAsyncThunk('data/saveLoja', async ({ id, payload }) => {
  if (id) return apiPatch('lojas', id, payload);
  return apiPost('lojas', payload);
});

export const deleteLoja = createAsyncThunk('data/deleteLoja', async (lojaId) => {
  const baseUrl = 'http://localhost:3001';

  const [clientes, chats, reviews] = await Promise.all([
    fetch(`${baseUrl}/clientes`).then((r) => r.json()),
    fetch(`${baseUrl}/chats`).then((r) => r.json()),
    fetch(`${baseUrl}/reviews`).then((r) => r.json()),
  ]);

  const clientesAfetados = clientes.filter((cliente) =>
    Array.isArray(cliente.favoritos) && cliente.favoritos.includes(lojaId)
  );

  await Promise.all(
    clientesAfetados.map((cliente) =>
      fetch(`${baseUrl}/clientes/${cliente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favoritos: (cliente.favoritos || []).filter((id) => id !== lojaId),
        }),
      })
    )
  );

  const chatsDaLoja = chats.filter((chat) => String(chat.lojaId) === String(lojaId));
  await Promise.all(
    chatsDaLoja.map((chat) =>
      fetch(`${baseUrl}/chats/${chat.id}`, {
        method: 'DELETE',
      })
    )
  );

  const reviewsDaLoja = reviews.filter((review) => String(review.lojaId) === String(lojaId));
  await Promise.all(
    reviewsDaLoja.map((review) =>
      fetch(`${baseUrl}/reviews/${review.id}`, {
        method: 'DELETE',
      })
    )
  );

  const response = await fetch(`${baseUrl}/lojas/${lojaId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Não foi possível excluir a loja.');
  }

  return {
    lojaId,
    chatIds: chatsDaLoja.map((chat) => chat.id),
    reviewIds: reviewsDaLoja.map((review) => review.id),
    clientesAfetados: clientesAfetados.map((cliente) => ({
      id: cliente.id,
      favoritos: (cliente.favoritos || []).filter((id) => id !== lojaId),
    })),
  };
});

export const saveLojista = createAsyncThunk('data/saveLojista', async ({ id, payload }) => apiPatch('lojistas', id, payload));
export const updateAgendamento = createAsyncThunk('data/updateAgendamento', async ({ id, payload }) => apiPatch('agendamentos', id, payload));

const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadData.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { status: 'succeeded', error: null });
      })
      .addCase(loadData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const cliente = state.clientes.find((item) => item.id === action.payload.clienteId);
        if (cliente) cliente.favoritos = action.payload.favoritos;
      })
      .addCase(saveClienteProfile.fulfilled, (state, action) => {
        const cliente = state.clientes.find((item) => item.id === action.payload.clienteId);
        if (cliente) Object.assign(cliente, action.payload.payload);
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const index = state.chats.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) state.chats[index] = action.payload;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.push(action.payload);
      })
      .addCase(saveReview.fulfilled, (state, action) => {
        const idx = state.reviews.findIndex((item) => item.id === action.payload.review.id);
        if (idx >= 0) state.reviews[idx] = action.payload.review;
        else state.reviews.push(action.payload.review);

        const chat = state.chats.find((item) => item.id === action.payload.chatId);
        if (chat) {
          chat.avaliacaoId = action.payload.review.id;
          chat.status = 'finalizado-avaliado';
        }
      })
      .addCase(saveDenuncia.fulfilled, (state, action) => {
        state.denuncias.push(action.payload);
      })
      .addCase(saveLoja.fulfilled, (state, action) => {
        const idx = state.lojas.findIndex((item) => item.id === action.payload.id);
        if (idx >= 0) state.lojas[idx] = action.payload;
        else state.lojas.push(action.payload);
      })
      .addCase(deleteLoja.fulfilled, (state, action) => {
        state.lojas = state.lojas.filter((item) => String(item.id) !== String(action.payload.lojaId));
        state.chats = state.chats.filter((item) => !action.payload.chatIds.includes(item.id));
        state.reviews = state.reviews.filter((item) => !action.payload.reviewIds.includes(item.id));

        action.payload.clientesAfetados.forEach((clienteAtualizado) => {
          const cliente = state.clientes.find((item) => item.id === clienteAtualizado.id);
          if (cliente) {
            cliente.favoritos = clienteAtualizado.favoritos;
          }
        });
      })
      .addCase(saveLojista.fulfilled, (state, action) => {
        const idx = state.lojistas.findIndex((item) => item.id === action.payload.id);
        if (idx >= 0) state.lojistas[idx] = action.payload;
      })
      .addCase(updateAgendamento.fulfilled, (state, action) => {
        const idx = state.agendamentos.findIndex((item) => item.id === action.payload.id);
        if (idx >= 0) state.agendamentos[idx] = action.payload;
      });
  },
});

export default slice.reducer;
