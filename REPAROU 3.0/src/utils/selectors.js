import React from "react";
export const selectClienteById = (state, id) => state.data.clientes.find((item) => item.id === id);
export const selectLojistaById = (state, id) => state.data.lojistas.find((item) => item.id === id);
export const selectLojaById = (state, id) => state.data.lojas.find((item) => item.id === id);
export const selectReviewsByLoja = (state, lojaId) => state.data.reviews.filter((item) => item.lojaId === lojaId).sort((a,b)=>new Date(b.dataIso)-new Date(a.dataIso));
export const selectChatsByCliente = (state, clienteId) => state.data.chats.filter((item) => item.clienteId === clienteId).sort((a,b)=>new Date(b.atualizadoEm)-new Date(a.atualizadoEm));
export const selectChatsByLojista = (state, lojistaId) => {
  const lojasIds = state.data.lojas
    .filter((loja) => String(loja.lojistaId) === String(lojistaId))
    .map((loja) => String(loja.id));

  return state.data.chats
    .filter((chat) => lojasIds.includes(String(chat.lojaId)))
    .sort((a, b) => new Date(b.atualizadoEm) - new Date(a.atualizadoEm));
};
