import React from "react";
import * as classes from "./UserChatList.module.css";
import { useChat } from "@/context/ChatContext";
import { useChatsApi } from "@/hooks/useChatsApi";


// Lista de chats reales asociados a una publicación específica (del dueño)
export const Frame = ({ postId, postTitle }) => {
  const { openChat } = useChat();
  const { useGetMyChats } = useChatsApi();

  const { data, isLoading, error } = useGetMyChats({ post_id: postId });
  console.log(data)
  const chats = Array.isArray(data) ? data : data?.results || data?.items || [];
  
  return (
    <div className={classes.frame}>
      <p className={classes.title}>Viendo los chats para la publicación: {postTitle}</p>

      <div className={classes.chatContainer} data-m3-mode="green-LT">
        {isLoading && <div className={classes.messageTime}>Cargando chats…</div>}
        {error && <div className={classes.messageTime}>Error al cargar chats</div>}
        {!isLoading && !error && chats.length === 0 && (
          <div className={classes.messageTime}>No hay chats para esta publicación</div>
        )}
        {!isLoading && !error &&
          chats.map((chat) => {
            const username = chat?.receiver?.user_info?.username || chat?.receiver?.email || "Usuario";
            const lastMessage = chat?.last_message?.content || chat?.lastMessage || "";
            const lastInteractionHours = chat?.last_interaction_hours ?? "";
            return (
              <div
                className={classes.chatItem}
                key={chat.id || chat.chat_id}
                onClick={() => openChat(chat.id || chat.chat_id)}
              >
                <div className={classes.chatContent}>
                  <div className={classes.chatDetails}>
                    <div className={classes.textContent}>
                      <div className={classes.username}>{username}</div>
                      <p className={classes.supportingText}>{lastMessage}</p>
                    </div>
                  </div>
                  <div className={classes.messageTime}>{lastInteractionHours ? `${lastInteractionHours}h` : ""}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
