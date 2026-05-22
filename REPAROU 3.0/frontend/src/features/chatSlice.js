
import { createSlice } from "@reduxjs/toolkit";
import { loadData } from "./loadThunks";

import {
  adminDeleteMessage,
  adminEditMessage,
  editMessage,
  deleteMessage,
  sendMessage,
  createChat,
} from "./chatThunks";

import {
  deleteCliente,
  deleteLojista,
  deleteLoja,
  deleteReview,
  saveReview,
} from "./dataSlice";

const idsIguais = (a, b) => String(a) === String(b);

const initialState = {
  chats: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(loadData.fulfilled, (state, action) => {
        state.chats = action.payload.chats;
      })

      /* =====================================
         ADMIN - EDITAR MENSAGEM
      ===================================== */
      .addCase(adminEditMessage.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (chat) => idsIguais(chat.id, action.payload.id)
        );

        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })

      /* =====================================
         ADMIN - DELETAR MENSAGEM
      ===================================== */
      .addCase(adminDeleteMessage.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (chat) => idsIguais(chat.id, action.payload.id)
        );

        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (c) => idsIguais(c.id, action.payload.id)
        );

        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })

      .addCase(editMessage.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (item) => idsIguais(item.id, action.payload.id)
        );

        if (index >= 0) {
          state.chats[index] = action.payload;
        }
      })

      .addCase(deleteMessage.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (c) => idsIguais(c.id, action.payload.id)
        );

        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })

      .addCase(saveReview.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (chat) => idsIguais(chat.id, action.payload.chatId)
        );

        if (index !== -1 && action.payload.chat) {
          state.chats[index] = action.payload.chat;
        }
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (chat) => idsIguais(chat.id, action.payload.chatId)
        );

        if (index !== -1 && action.payload.chat) {
          state.chats[index] = action.payload.chat;
        }
      })

      .addCase(deleteLoja.fulfilled, (state, action) => {
        state.chats = state.chats.filter(
          (chat) => !action.payload.chatIds.some((id) => idsIguais(id, chat.id))
        );
      })

      .addCase(deleteCliente.fulfilled, (state, action) => {
        state.chats = state.chats.filter(
          (chat) => !action.payload.chatIds.some((id) => idsIguais(id, chat.id))
        );
      })

      .addCase(deleteLojista.fulfilled, (state, action) => {
        state.chats = state.chats.filter(
          (chat) => !action.payload.chatIds.some((id) => idsIguais(id, chat.id))
        );
      })

      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.push(action.payload);
      });
  },
});

export default chatSlice.reducer;
