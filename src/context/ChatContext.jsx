import React, { createContext, useContext, useMemo, useState } from "react";
import * as chatApi from "@/services/chatService";
import { useQueryClient } from "@tanstack/react-query";
import { useChatsApi } from "@/hooks/useChatsApi";
// Estado global y API para abrir/cerrar el panel de chat y
// seleccionar el chat activo (por publicación o general)
const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const queryClient = useQueryClient();
  const { useGetMyChats } = useChatsApi();
  const currentUserId = Number(localStorage.getItem("userId"));
  const { data: chatsData, refetch  } = useGetMyChats(undefined, currentUserId); 

  const openChat = (chatId) => {
    setActiveChatId(chatId); 
    setIsOpen(true);
  };

  const toggleChat = () => {
      if (isOpen) {
        setActiveChatId(null)
        closeChat();
      } else {
        console.log("refetched");
        
        refetch();
        setIsOpen(true);
      }
    };  

  const openChatForPublication = async ({ publicationId, postTitle, counterpartUsername }) => {
    // Abre el panel y trata de resolver el chatId real de esta publicación
    setIsOpen(true);
    try {
      if (!publicationId) return;
      const resp = await queryClient.fetchQuery({
        queryKey: ["myChats", { post_id: publicationId }],
        queryFn: () => chatApi.getMyChats({ post_id: publicationId }),
      });
      const data = resp && resp.data !== undefined ? resp.data : resp;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.items)
        ? data.items
        : [];

      // Si se pasó username, intenta matchear con la contraparte
      let match = list[0];
      if (counterpartUsername) {
        match =
          list.find(
            (c) =>
              c?.counterpart?.username === counterpartUsername ||
              c?.counterpart_username === counterpartUsername ||
              c?.user?.username === counterpartUsername
          ) || match;
      }

      const chatId = match?.id ?? match?.chat_id ?? match?.detail?.chat_id ?? null;
      if (chatId) {
        setActiveChatId(chatId);
      }
    } catch (e) {
      // En caso de error dejamos el panel abierto para no interrumpir UX
      // y no seteamos chat activo
    }
  };


 const closeChat = () => {
     setIsOpen(false);
     setActiveChatId(null);
   };

const value = useMemo(
    () => ({
      isOpen,
      activeChatId,
      chatsData,
      setActiveChatId,
      openChat,               
      closeChat,
      openChatForPublication, 
      toggleChat,
    }),
    [isOpen, activeChatId]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}


