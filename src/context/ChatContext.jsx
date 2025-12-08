import React, { createContext, useContext, useMemo, useState } from "react";

// Estado global y API para abrir/cerrar el panel de chat y
// seleccionar el chat activo (por publicación o general)
const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  const openChat = (chatId) => {
    setActiveChatId(chatId); 
    setIsOpen(true);
  };

const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      // Si hay un chat activo, lo abre. Si no, solo abre el panel vacío
      setIsOpen(true);
    }
  };

  const openChatForPublication = ({ publicationId, postTitle, counterpartUsername }) => {
    setIsOpen(true);
  };


 const closeChat = () => {
     setIsOpen(false);
     setActiveChatId(null);
   };

const value = useMemo(
    () => ({
      isOpen,
      activeChatId,           
      openChat,               
      closeChat,
      openChatForPublication, 
      toggleChat,
    }),
    [isOpen, activeChatId]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}