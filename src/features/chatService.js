
const BASE_URL = "http://localhost:3001/chats";

export const getChatById = async (chatId) => {
  const res = await fetch(`${BASE_URL}/${chatId}`);
  return await res.json();
};

export const updateChat = async (chatId, payload) => {
  const res = await fetch(`${BASE_URL}/${chatId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
};

export const patchChat = async (chatId, payload) => {
  const res = await fetch(`${BASE_URL}/${chatId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
};

export const createChatService = async (payload) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
};

export const deleteChat = async (chatId) => {
  await fetch(`${BASE_URL}/${chatId}`, {
    method: "DELETE",
  });
};
