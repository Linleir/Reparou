
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
          (chat) => String(chat.id) === String(action.payload.id)
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
          (chat) => String(chat.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (c) => c.id === action.payload.id
        );

        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })

      .addCase(editMessage.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index >= 0) {
          state.chats[index] = action.payload;
        }
      })

      .addCase(deleteMessage.fulfilled, (state, action) => {
        const index = state.chats.findIndex(
          (c) => c.id === action.payload.id
        );

        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })

      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.push(action.payload);
      });
  },
});

export default chatSlice.reducer;
