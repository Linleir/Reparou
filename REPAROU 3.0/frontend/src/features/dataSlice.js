import React from "react";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPatch, apiPost, apiPut, apiDelete } from "../utils/api";
import { loadData } from "./loadThunks";
import { registerCliente, registerLojista } from "./authSlice";


const initialState = {
  clientes: [],
  lojistas: [],
  admins: [],
  lojas: [],
  reviews: [],
  denuncias: [],
  agendamentos: [],
  status: 'idle',
  error: null,
};

const idsIguais = (a, b) => String(a) === String(b);

async function deleteResource(resource, id) {
  return apiDelete(resource, id);
}

/* ==========================================
   1. DELETAR MENSAGEM DO CHAT
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
   2. EDITAR MENSAGEM DO CHAT
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
   3. EDITAR LOJA
========================================== */
export const adminEditLoja = createAsyncThunk(
  "admin/editLoja",
  async ({ lojaId, dados }) => {
    return await apiPatch("lojas", lojaId, dados);
  }
);

/* ==========================================
   4. EDITAR LOJISTA
========================================== */
export const adminEditLojista = createAsyncThunk(
  "admin/editLojista",
  async ({ lojistaId, dados }) => {
    return await apiPatch("lojistas", lojistaId, dados);
  }
);

/* ==========================================
   5. DELETAR LOJA
========================================== */
export const adminDeleteLoja = createAsyncThunk(
  "admin/deleteLoja",
  async (lojaId) => {
    await apiDelete("lojas", lojaId);
    return lojaId;
  }
);

/* ==========================================
   6. DELETAR LOJISTA
========================================== */
export const adminDeleteLojista = createAsyncThunk(
  "admin/deleteLojista",
  async (lojistaId) => {
    await apiDelete("lojistas", lojistaId);
    return lojistaId;
  }
);

export const updateCliente = createAsyncThunk(
  "data/updateCliente",
  async ({ id, payload }) => {
    return await apiPatch("clientes", id, payload);
  }
);




export const deleteCliente = createAsyncThunk(
  "data/deleteCliente",
  async (id) => {
    const [chats, reviews] = await Promise.all([
      apiGet('chats'),
      apiGet('reviews'),
    ]);

    const chatsDoCliente = chats.filter((chat) => idsIguais(chat.clienteId, id));
    const chatIds = chatsDoCliente.map((chat) => chat.id);
    const reviewsDoCliente = reviews.filter((review) =>
      chatIds.some((chatId) => idsIguais(chatId, review.chatId))
    );

    await Promise.all([
      ...reviewsDoCliente.map((review) => deleteResource('reviews', review.id)),
      ...chatsDoCliente.map((chat) => deleteResource('chats', chat.id)),
    ]);

    await deleteResource('clientes', id);

    return {
      clienteId: id,
      chatIds,
      reviewIds: reviewsDoCliente.map((review) => review.id),
    };
  }
);

export const deleteLojista = createAsyncThunk(
  "data/deleteLojista",
  async (id) => {
    const [lojas, clientes, chats, reviews] = await Promise.all([
      apiGet('lojas'),
      apiGet('clientes'),
      apiGet('chats'),
      apiGet('reviews'),
    ]);

    const lojasDoLojista = lojas.filter((loja) => idsIguais(loja.lojistaId, id));
    const lojaIds = lojasDoLojista.map((loja) => loja.id);

    const clientesAfetados = clientes
      .filter((cliente) =>
        Array.isArray(cliente.favoritos) &&
        cliente.favoritos.some((lojaId) => lojaIds.some((idLoja) => idsIguais(idLoja, lojaId)))
      )
      .map((cliente) => ({
        ...cliente,
        favoritos: (cliente.favoritos || []).filter(
          (lojaId) => !lojaIds.some((idLoja) => idsIguais(idLoja, lojaId))
        ),
      }));

    await Promise.all(
      clientesAfetados.map((cliente) =>
        apiPatch('clientes', cliente.id, { favoritos: cliente.favoritos })
      )
    );

    const chatsDasLojas = chats.filter((chat) =>
      lojaIds.some((lojaId) => idsIguais(lojaId, chat.lojaId))
    );

    const reviewsDasLojas = reviews.filter((review) =>
      lojaIds.some((lojaId) => idsIguais(lojaId, review.lojaId))
    );

    await Promise.all([
      ...reviewsDasLojas.map((review) => deleteResource('reviews', review.id)),
      ...chatsDasLojas.map((chat) => deleteResource('chats', chat.id)),
      ...lojasDoLojista.map((loja) => deleteResource('lojas', loja.id)),
    ]);

    await deleteResource('lojistas', id);

    return {
      lojistaId: id,
      lojaIds,
      chatIds: chatsDasLojas.map((chat) => chat.id),
      reviewIds: reviewsDasLojas.map((review) => review.id),
      clientesAfetados: clientesAfetados.map((cliente) => ({
        id: cliente.id,
        favoritos: cliente.favoritos,
      })),
    };
  }
);

export const deleteReview = createAsyncThunk(
  'data/deleteReview',
  async ({ reviewId, chatId }) => {
    await deleteResource('reviews', reviewId);

    let chat = null;

    if (chatId) {
      chat = await apiPatch('chats', chatId, {
        avaliacaoId: null,
        status: 'finalizado',
        atualizadoEm: new Date().toISOString(),
      });
    }

    return { reviewId, chatId, chat };
  }
);





// Removido: editMessage está em chatThunks.js






export const toggleFavorite = createAsyncThunk('data/favorite', async ({ clienteId, lojaId }, { getState }) => {
  const cliente = getState().data.clientes.find((item) => item.id === clienteId);
  const favoritos = cliente?.favoritos || [];
  const next = favoritos.includes(lojaId) ? favoritos.filter((item) => item !== lojaId) : [...favoritos, lojaId];
  await apiPatch('clientes', clienteId, { favoritos: next });
  return { clienteId, favoritos: next };
});

export const saveClienteProfile = createAsyncThunk(
  'data/saveClienteProfile',
  async ({ clienteId, payload }) => {
    return await apiPatch('clientes', clienteId, payload);
  }
);

export const sendMessage = createAsyncThunk(
  'data/sendMessage',
 async ({ chat, text, author }) => {
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

    return await apiPut('chats', chat.id, updated);
  }
);

export const createChat = createAsyncThunk(
  'data/createChat',
  async (payload) => {
    return await apiPost('chats', payload);
  }
);

export const saveReview = createAsyncThunk(
  'data/saveReview',
  async ({ review, chatId, chatStatus }) => {
    const saved = review.id
      ? await apiPatch('reviews', review.id, review)
      : await apiPost('reviews', review);

    const chat = await apiGet(`chats/${chatId}`);

    const updatedChat = {
      ...chat,
      avaliacaoId: saved.id,
      status: chatStatus || 'finalizado-avaliado',
      atualizadoEm: new Date().toISOString(),
    };

    const chatSalvo = await apiPut('chats', chatId, updatedChat);

    return { review: saved, chatId, chat: chatSalvo };
  }
);

export const saveDenuncia =
  createAsyncThunk(

    "data/saveDenuncia",

    async (payload) => {

      return apiPost(
        "denuncias",
        payload
      );
    }
  );
export const saveLoja = createAsyncThunk('data/saveLoja', async ({ id, payload }) => {
  if (id) return apiPatch('lojas', id, payload);
  return apiPost('lojas', payload);
});

export const deleteLoja = createAsyncThunk('data/deleteLoja', async (lojaId) => {
  const [clientes, chats, reviews] = await Promise.all([
    apiGet('clientes'),
    apiGet('chats'),
    apiGet('reviews'),
  ]);

  const clientesAfetados = clientes.filter((cliente) =>
    Array.isArray(cliente.favoritos) &&
    cliente.favoritos.some((id) => idsIguais(id, lojaId))
  );

  await Promise.all(
    clientesAfetados.map((cliente) =>
      apiPatch('clientes', cliente.id, {
        favoritos: (cliente.favoritos || []).filter((id) => !idsIguais(id, lojaId)),
      })
    )
  );

  const chatsDaLoja = chats.filter((chat) => idsIguais(chat.lojaId, lojaId));
  const reviewsDaLoja = reviews.filter((review) => idsIguais(review.lojaId, lojaId));

  await Promise.all([
    ...reviewsDaLoja.map((review) => deleteResource('reviews', review.id)),
    ...chatsDaLoja.map((chat) => deleteResource('chats', chat.id)),
  ]);

  await deleteResource('lojas', lojaId);

  return {
    lojaId,
    chatIds: chatsDaLoja.map((chat) => chat.id),
    reviewIds: reviewsDaLoja.map((review) => review.id),
    clientesAfetados: clientesAfetados.map((cliente) => ({
      id: cliente.id,
      favoritos: (cliente.favoritos || []).filter((id) => !idsIguais(id, lojaId)),
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

      /* =====================================
         ADMIN - EDITAR LOJA
      ===================================== */
      .addCase(adminEditLoja.fulfilled, (state, action) => {
        const index = state.lojas.findIndex(
          (loja) => String(loja.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.lojas[index] = action.payload;
        }
      })

      /* =====================================
         ADMIN - EDITAR LOJISTA
      ===================================== */
      .addCase(adminEditLojista.fulfilled, (state, action) => {
        const index = state.lojistas.findIndex(
          (lojista) => String(lojista.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.lojistas[index] = action.payload;
        }
      })

      /* =====================================
         ADMIN - DELETAR LOJA
      ===================================== */
      .addCase(adminDeleteLoja.fulfilled, (state, action) => {
        state.lojas = state.lojas.filter(
          (loja) => String(loja.id) !== String(action.payload)
        );
      })

      /* =====================================
         ADMIN - DELETAR LOJISTA
      ===================================== */
      .addCase(adminDeleteLojista.fulfilled, (state, action) => {
        state.lojistas = state.lojistas.filter(
          (lojista) => String(lojista.id) !== String(action.payload)
        );
      })

      /* =====================================
         UPDATE CLIENTE
      ===================================== */
      .addCase(updateCliente.fulfilled, (state, action) => {
        const index = state.clientes.findIndex(
      (item) =>
      String(item.id) ===
      String(action.payload.id)
      );

        if (index >= 0) {
          state.clientes[index] = action.payload;
        }
      })

      /* =====================================
         DELETE CLIENTE
      ===================================== */
      .addCase(deleteCliente.fulfilled, (state, action) => {
        state.clientes = state.clientes.filter(
          (c) => !idsIguais(c.id, action.payload.clienteId ?? action.payload)
        );

        if (Array.isArray(action.payload.reviewIds)) {
          state.reviews = state.reviews.filter(
            (item) => !action.payload.reviewIds.some((id) => idsIguais(id, item.id))
          );
        }
      })

      /* =====================================
         DELETE LOJISTA
      ===================================== */
      .addCase(deleteLojista.fulfilled, (state, action) => {
        state.lojistas = state.lojistas.filter(
          (l) => !idsIguais(l.id, action.payload.lojistaId ?? action.payload)
        );

        if (Array.isArray(action.payload.lojaIds)) {
          state.lojas = state.lojas.filter(
            (loja) => !action.payload.lojaIds.some((id) => idsIguais(id, loja.id))
          );
        }

        if (Array.isArray(action.payload.reviewIds)) {
          state.reviews = state.reviews.filter(
            (review) => !action.payload.reviewIds.some((id) => idsIguais(id, review.id))
          );
        }

        if (Array.isArray(action.payload.clientesAfetados)) {
          action.payload.clientesAfetados.forEach((clienteAtualizado) => {
            const cliente = state.clientes.find((item) => idsIguais(item.id, clienteAtualizado.id));
            if (cliente) cliente.favoritos = clienteAtualizado.favoritos;
          });
        }
      })

      /* =====================================
         DELETE REVIEW
      ===================================== */
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (item) => !idsIguais(item.id, action.payload.reviewId)
        );
      })

      /* =====================================
         LOAD DATA
      ===================================== */
      .addCase(loadData.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(loadData.fulfilled, (state, action) => {
        state.clientes = action.payload.clientes;
        state.lojistas = action.payload.lojistas;
        state.admins = action.payload.admins;
        state.lojas = action.payload.lojas;
        state.reviews = action.payload.reviews;
        state.denuncias = action.payload.denuncias;
        state.agendamentos = action.payload.agendamentos;

        state.status = 'succeeded';
        state.error = null;
      })

      .addCase(loadData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      /* =====================================
         REGISTER CLIENTE
      ===================================== */
      .addCase(registerCliente.fulfilled, (state, action) => {
        const cliente = action.payload.user;
        const exists = state.clientes.some((item) => idsIguais(item.id, cliente.id));
        if (!exists) state.clientes.push(cliente);
      })

      /* =====================================
         REGISTER LOJISTA
      ===================================== */
      .addCase(registerLojista.fulfilled, (state, action) => {
        const lojista = action.payload.user;
        const exists = state.lojistas.some((item) => idsIguais(item.id, lojista.id));
        if (!exists) state.lojistas.push(lojista);
      })

      /* =====================================
         FAVORITOS
      ===================================== */
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const cliente = state.clientes.find(
          (item) => idsIguais(item.id, action.payload.clienteId)
        );

        if (cliente) {
          cliente.favoritos = action.payload.favoritos;
        }
      })

      /* =====================================
         SAVE CLIENT PROFILE
      ===================================== */
      .addCase(saveClienteProfile.fulfilled, (state, action) => {
        const index = state.clientes.findIndex(
          (item) => idsIguais(item.id, action.payload.id)
        );

        if (index >= 0) {
          state.clientes[index] = action.payload;
        }
      })

      /* =====================================
         SAVE REVIEW
      ===================================== */
      .addCase(saveReview.fulfilled, (state, action) => {
        const idx = state.reviews.findIndex(
          (item) => idsIguais(item.id, action.payload.review.id)
        );

        if (idx >= 0) {
          state.reviews[idx] = action.payload.review;
        } else {
          state.reviews.push(action.payload.review);
        }
      })

      /* =====================================
         SAVE DENUNCIA
      ===================================== */
      .addCase(saveDenuncia.fulfilled, (state, action) => {
        state.denuncias.push(action.payload);
      })

      /* =====================================
         SAVE LOJA
      ===================================== */
   .addCase(saveLoja.fulfilled, (state, action) => {
  console.log("SAVE LOJA:", action.payload);

  const idx = state.lojas.findIndex(
    (item) =>
      String(item.id) ===
      String(action.payload.id)
  );

  if (idx >= 0) {
    state.lojas[idx] = action.payload;
  } else {
    state.lojas.push(action.payload);
  }
})

      /* =====================================
         DELETE LOJA
      ===================================== */
      .addCase(deleteLoja.fulfilled, (state, action) => {
        state.lojas = state.lojas.filter(
          (item) =>
            !idsIguais(item.id, action.payload.lojaId)
        );

        state.reviews = state.reviews.filter(
          (item) =>
            !action.payload.reviewIds.some((id) => idsIguais(id, item.id))
        );

        action.payload.clientesAfetados.forEach(
          (clienteAtualizado) => {
            const cliente = state.clientes.find(
              (item) => idsIguais(item.id, clienteAtualizado.id)
            );

            if (cliente) {
              cliente.favoritos =
                clienteAtualizado.favoritos;
            }
          }
        );
      })

      /* =====================================
         SAVE LOJISTA
      ===================================== */
      .addCase(saveLojista.fulfilled, (state, action) => {
       const idx = state.lojistas.findIndex(
  (item) =>
    String(item.id) ===
    String(action.payload.id)
);

        if (idx >= 0) {
          state.lojistas[idx] = action.payload;
        }
      })

      /* =====================================
         UPDATE AGENDAMENTO
      ===================================== */
      .addCase(updateAgendamento.fulfilled, (state, action) => {
        const idx = state.agendamentos.findIndex(
          (item) => idsIguais(item.id, action.payload.id)
        );

        if (idx >= 0) {
          state.agendamentos[idx] = action.payload;
        }
      });
  },
});



export default slice.reducer;
