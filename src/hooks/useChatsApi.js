import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as chatApi from "../services/chatService"; // Corregido el path

export const useChatsApi = () => {
  const queryClient = useQueryClient();

  // --------------------
  // QUERIES
  // --------------------
 const useGetMyChats = (filters = {}, userId, options = {}) => {
  // Normalizamos los filtros para que la queryKey sea estable y serializable
  const normalizedFilters = {
    post_id: filters?.post_id ?? null,
    only_active: filters?.only_active ?? null, // true | false | null (para "Todos")
    // Si en el futuro agregas más filtros (ej. keyword, status, etc.), agrégalos aquí
  };

  return useQuery({
    queryKey: ["myChats", userId, normalizedFilters],
    // Alternativa más explícita y segura (recomendada):
    // queryKey: ["myChats", userId, normalizedFilters.post_id, normalizedFilters.only_active],

    queryFn: () => chatApi.getMyChats(filters),
    enabled: !!userId,
    ...options, // permite pasar enabled extra, etc.

    select: (data) => {
      const chatList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.items)
            ? data.items
            : [];

      // Ordenar: más reciente primero
      return chatList.sort((a, b) => {
        const dateA = new Date(
          a.last_message?.created_at || a.updated_at || a.created_at || 0
        );
        const dateB = new Date(
          b.last_message?.created_at || b.updated_at || b.created_at || 0
        );
        return dateB - dateA; // descendente
      });
    },
  });
};


  const useGetChatDetail = (chat_id) =>
    useQuery({
      queryKey: ["chatDetail", chat_id],
      queryFn: () => chatApi.getChatDetail(chat_id),
      enabled: !!chat_id,
    });

 
  // --------------------
  // MUTATIONS
  // --------------------
  const createChat = useMutation({
    mutationFn: chatApi.createChat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myChats"] }),
  });

  const sendMessage = useMutation({
    mutationFn: ({ chat_id, message }) => chatApi.sendMessage(chat_id, message),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["chatDetail", variables.chat_id] }),
  });

  const resolveChat = useMutation({
    mutationFn: ({ chat_id, completed, resolution_note }) =>
      chatApi.resolveChat(chat_id, completed, resolution_note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chatDetail", variables.chat_id] });
      queryClient.invalidateQueries({ queryKey: ["myChats"] });
    },
  });

  return {
    useGetMyChats,
    useGetChatDetail,
    createChat,
    sendMessage,
    resolveChat,
  };
};