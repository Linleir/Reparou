/* seção de mensagens do chat - thunks para ações assíncronas */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPatch, apiPost, apiPut } from "../utils/api";

/* ==========================================
   1. DELETAR MENSAGEM DO CHAT (ADMIN)
========================================== */

export const adminDeleteMessage = createAsyncThunk(
  "admin/deleteMessage",
  async ({ chatId, indexMensagem }) => {
    const chat = await apiGet(`chats/${chatId}`);

    const mensagensAtualizadas = (chat.mensagens || []).filter(
      (_, index) => index !== indexMensagem
    );

    const payload = {
      ...chat,
      mensagens: mensagensAtualizadas,
      atualizadoEm: new Date().toISOString(),
    };

    return await apiPut("chats", chatId, payload);
  }
);

/* ==========================================
   2. EDITAR MENSAGEM DO CHAT (ADMIN)
========================================== */

export const adminEditMessage = createAsyncThunk(
  "admin/editMessage",
  async ({ chatId, indexMensagem, novoTexto }) => {
    const chat = await apiGet(`chats/${chatId}`);

    const mensagensAtualizadas = (chat.mensagens || []).map((msg, index) =>
      index === indexMensagem
        ? {
            ...msg,
            texto: novoTexto,
            editado: true,
          }
        : msg
    );

    const payload = {
      ...chat,
      mensagens: mensagensAtualizadas,
      atualizadoEm: new Date().toISOString(),
    };

    return await apiPut("chats", chatId, payload);
  }
);

/* ==========================================
   3. EDITAR MENSAGEM
========================================== */

export const editMessage = createAsyncThunk(
  "chat/editMessage",
  async ({ chat, indexMensagem, novoTexto }) => {
    const now = new Date().toISOString();

    const updated = {
      ...chat,
      mensagens: chat.mensagens.map((msg, index) =>
        index === indexMensagem
          ? { ...msg, texto: novoTexto, editado: true }
          : msg
      ),
      atualizadoEm: now,
    };

    await apiPatch("chats", chat.id, updated);

    return updated;
  }
);

/* ==========================================
   4. DELETAR MENSAGEM
========================================== */

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async ({ chat, indexMensagem }) => {
    const novasMensagens = chat.mensagens.filter(
      (_, i) => i !== indexMensagem
    );

    const chatAtualizado = {
      ...chat,
      mensagens: novasMensagens,
      atualizadoEm: new Date().toISOString(),
    };

    return await apiPut("chats", chat.id, chatAtualizado);
  }
);

/* ==========================================
   5. ENVIAR MENSAGEM
========================================== */

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chat, text, author = "cliente" }) => {
    const now = new Date().toISOString();

    const updated = {
      ...chat,
      mensagens: [
        ...(chat.mensagens || []),
        {
          autor: author,
          texto: text,
          horario: now,
        },
      ],
      atualizadoEm: now,
    };

    return await apiPut("chats", chat.id, updated);
  }
);

/* ==========================================
   6. CRIAR CHAT
========================================== */

export const createChat = createAsyncThunk(
  "chat/createChat",
  async (payload) => {
    return await apiPost("chats", payload);
  }
);
