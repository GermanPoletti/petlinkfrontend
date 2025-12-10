import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as chatApi from "../services/chatService"; // Corregido el path

export const useChatsApi = () => {
  const queryClient = useQueryClient();

  // --------------------
  // QUERIES
  // --------------------
 const useGetMyChats = (filters, userId) =>
  useQuery({
    queryKey: ["myChats", filters?.post_id],
    queryFn: () => chatApi.getMyChats(filters),
    // enabled: !!filters?.post_id, 
    enabled: !!userId
  });


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