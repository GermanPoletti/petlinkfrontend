import api from "./axios";

export const createChat = (post_id) =>
  api.post("/chats/", { post_id });

export const getMyChats = (filters = {}) =>
  api.get("/chats/me", { params: filters });

export const getChatDetail = (chat_id) =>
  api.get(`/chats/${chat_id}`);

export const sendMessage = (chat_id, message) =>
  api.post(`/chats/${chat_id}/messages`, { message });

export const resolveChat = (chat_id, completed, resolution_note = null) =>
  api.patch(`/chats/${chat_id}/resolve`, { completed, resolution_note });
