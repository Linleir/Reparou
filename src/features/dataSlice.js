import React from "react";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPatch, apiPost } from "../utils/api";
import { loadData } from "./loadThunks";


const BASE_URL = "http://localhost:5001";
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

/* ==========================================
   1. DELETAR MENSAGEM DO CHAT
========================================== */
export const adminDeleteMessage = createAsyncThunk(
  "admin/deleteMessage",
  async ({ chatId, indexMensagem }) => {
    const res = await fetch(`${BASE_URL}/chats/${chatId}`);
    const chat = await res.json();

    const mensagensAtualizadas = (chat.mensagens || []).filter(
      (_, index) => index !== indexMensagem
    );

    const payload = {
      ...chat,
      mensagens: mensagensAtualizadas,
      atualizadoEm: new Date().toISOString(),
    };

    await fetch(`${BASE_URL}/chats/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return payload;
  }
);

/* ==========================================
   2. EDITAR MENSAGEM DO CHAT
========================================== */
export const adminEditMessage = createAsyncThunk(
  "admin/editMessage",
  async ({ chatId, indexMensagem, novoTexto }) => {
    const res = await fetch(`${BASE_URL}/chats/${chatId}`);
    
    const chat = await res.json();

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

    await fetch(`${BASE_URL}/chats/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return payload;
  }
);

/* ==========================================
   3. EDITAR LOJA
========================================== */
export const adminEditLoja = createAsyncThunk(
  "admin/editLoja",
  async ({ lojaId, dados }) => {
    const res = await fetch(`${BASE_URL}/lojas/${lojaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    return await res.json();
  }
);

/* ==========================================
   4. EDITAR LOJISTA
========================================== */
export const adminEditLojista = createAsyncThunk(
  "admin/editLojista",
  async ({ lojistaId, dados }) => {
    const res = await fetch(`${BASE_URL}/lojistas/${lojistaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    return await res.json();
  }
);

/* ==========================================
   5. DELETAR LOJA
========================================== */
export const adminDeleteLoja = createAsyncThunk(
  "admin/deleteLoja",
  async (lojaId) => {
    await fetch(`${BASE_URL}/lojas/${lojaId}`, {
      method: "DELETE",
    });

    return lojaId;
  }
);

/* ==========================================
   6. DELETAR LOJISTA
========================================== */
export const adminDeleteLojista = createAsyncThunk(
  "admin/deleteLojista",
  async (lojistaId) => {
    await fetch(`${BASE_URL}/lojistas/${lojistaId}`, {
      method: "DELETE",
    });

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
    await fetch(`${BASE_URL}/clientes/${id}`, {
      method: "DELETE",
    });
    return id;
  }
);

export const deleteLojista = createAsyncThunk(
  "data/deleteLojista",
  async (id) => {
    await fetch(`${BASE_URL}/lojistas/${id}`, {
      method: "DELETE",
    });

    return id;
  }
);



export const deleteReview = createAsyncThunk(
  'data/deleteReview',
  async ({ reviewId, chatId }) => {
    const baseUrl = 'http://localhost:5001';

    // apaga review
    await fetch(`${baseUrl}/reviews/${reviewId}`, {
      method: 'DELETE'
    });

    // limpa vínculo do chat
    if (chatId) {
      await fetch(`${baseUrl}/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avaliacaoId: null,
          status: 'finalizado'
        })
      });
    }

    return { reviewId, chatId };
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

    await fetch(`http://localhost:5001/chats/${chat.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updated),
    });

    return updated;
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

    // buscar chat atual primeiro (evita overwrite)
    const chatRes = await fetch(`http://localhost:5001/chats/${chatId}`);
    const chat = await chatRes.json();

    const updatedChat = {
      ...chat,
      avaliacaoId: saved.id,
      status: chatStatus || 'finalizado-avaliado',
      atualizadoEm: new Date().toISOString(),
    };

    await fetch(`http://localhost:5001/chats/${chatId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedChat),
    });

    return { review: saved, chatId };
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
  const baseUrl = 'http://localhost:5001';

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
          (c) => c.id !== action.payload
        );
      })

      /* =====================================
         DELETE LOJISTA
      ===================================== */
      .addCase(deleteLojista.fulfilled, (state, action) => {
        state.lojistas = state.lojistas.filter(
          (l) => l.id !== action.payload
        );
      })

      /* =====================================
         DELETE REVIEW
      ===================================== */
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (item) => item.id !== action.payload.reviewId
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
         FAVORITOS
      ===================================== */
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const cliente = state.clientes.find(
          (item) => item.id === action.payload.clienteId
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
          (item) => item.id === action.payload.id
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
          (item) => item.id === action.payload.review.id
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
            String(item.id) !== String(action.payload.lojaId)
        );

        state.reviews = state.reviews.filter(
          (item) =>
            !action.payload.reviewIds.includes(item.id)
        );

        action.payload.clientesAfetados.forEach(
          (clienteAtualizado) => {
            const cliente = state.clientes.find(
              (item) => item.id === clienteAtualizado.id
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
          (item) => item.id === action.payload.id
        );

        if (idx >= 0) {
          state.agendamentos[idx] = action.payload;
        }
      });
  },
});



export default slice.reducer;
