import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../utils/api";

export const getChatById = async (chatId) => {
  return await apiGet(`chats/${chatId}`);
};

export const updateChat = async (chatId, payload) => {
  return await apiPut("chats", chatId, payload);
};

export const patchChat = async (chatId, payload) => {
  return await apiPatch("chats", chatId, payload);
};

export const createChatService = async (payload) => {
  return await apiPost("chats", payload);
};

export const deleteChat = async (chatId) => {
  return await apiDelete("chats", chatId);
};
