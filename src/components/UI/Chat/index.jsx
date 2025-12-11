import React, { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import { useChat } from "@/context/ChatContext";
import { useUser } from "../../../context/UserContext";
import { useChatsApi } from "@/hooks/useChatsApi";
import { useToast } from "@/components/UI/Toast";
import backarrowIcon from "@/assets/images/icons/backarrow.png";
import handshake from "@/assets/images/icons/handshake.png";

function MessageBubble({ msg, currentUserId }) {
  const isMine = msg.sender_id === currentUserId || msg.is_from_current_user === true;

  return (
    <div className={`${styles.message} ${isMine ? styles.sent : styles.received}`}>
      <div className={styles.messageText}>{msg.message || msg.content}</div>
      <div className={styles.messageTime}>
        {new Date(msg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { isOpen, activeChatId, setActiveChatId, closeChat, chatsData } = useChat();
  const { showToast } = useToast();
  const { useGetChatDetail, sendMessage, resolveChat, useGetMyChats } = useChatsApi();
  const { token } = useUser();
  // const { data: chatsData, isLoading: isLoadingChats, error: errorChats } = useGetMyChats(undefined, currentUserId); // Obtener todos los chats
  const { data: chatData, isLoading, error } = useGetChatDetail(activeChatId);
  console.log("CHAT DATA ->", chatData);
  console.log("CHATS DATA ->", chatsData);
  
  const [input, setInput] = useState("");
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId)
  };

  useEffect(() => {
    console.log("activ id changed", activeChatId, isOpen);
  }, [activeChatId]);

  // Cierra dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !activeChatId) return;

   sendMessage.mutate(
      { chat_id: activeChatId, message: text },
      {
        onSuccess: () => {
          setInput("");
        },
        onError: () => {
          showToast("Error al enviar mensaje", { type: "error" });
        },
      }
    );
  };

  const isOwner =
    !!chatData &&
    (chatData?.receiver_id === currentUserId);

  const handleResolve = (completed) => {
    if (!activeChatId) return;
    resolveChat.mutate(
      { chat_id: activeChatId, completed, resolution_note: null },
      {
        onSuccess: () => {
          setShowDropdown(false);
          if (completed) {
            showToast("Acuerdo concretado: se cerró el chat.", { type: "success" });
          } else {
            showToast("Acuerdo NO concretado: se cerró el chat.", { type: "info" });
          }
          closeChat();
        },
        onError: (error) => {
          const msg = error?.response?.data?.detail || "Error al resolver el acuerdo";
          showToast(msg, { type: "error" });
        },
      }
    );
  };

  if (!isOpen) return null;

  // Datos para el header
  const postTitle = chatData?.post_title;
  const getCounterpartName = () => {
  if (!chatData) return "Usuario";
  

  // Determinar con quién estoy hablando
  const isInitiator = chatData.initiator_id === currentUserId;

  const username = isInitiator 
    ? chatData.receiver_username 
    : chatData.initiator_username;

  // Si tiene username → usarlo
  if (username && username.trim()) {
    return username.trim();
  }

  // Si no tiene username → usar parte local del email
  const email = isInitiator 
    ? chatData.receiver_email 
    : chatData.initiator_email;

  if (email) {
    return email.split("@")[0];
  }

  return "Usuario";
};

const tempHanlder = () => {
  setActiveChatId(null)
}
const counterpartUsername = getCounterpartName();

  return (
    <>
      <div className={styles.backdrop} onClick={closeChat} />

      <aside className={`${styles.chatPanel} ${styles.open}`}>
        {/* HEADER */}
        <div className={styles.header}>
          {activeChatId && 
          <button onClick={tempHanlder} aria-label="Cerrar" className={styles.backButton}>
            <img src={backarrowIcon} alt="Cerrar" />
          </button>}

          <div className={styles.headerCenter}>
            <span className={styles.postTitle}>{postTitle} -</span>
            {isOwner && (
              
              <button
                className={styles.handshakeButton}
                onClick={() => setShowDropdown((p) => !p)}
                aria-label="Acuerdo"
              >
                <img src={handshake} alt="Handshake" className={styles.handshakeIcon} />
              </button>
              
            )}

            <span className={styles.postTitle}>{activeChatId ? `- ${counterpartUsername}` : "Lista de Chats:"}</span>
            {showDropdown && isOwner && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem} onClick={() => handleResolve(true)}>
                  <span className={styles.checkIcon}>Sí</span> Acordamos
                </button>
                <button className={styles.dropdownItem} onClick={() => handleResolve(false)}>
                  <span className={styles.crossIcon}>No</span> No llegamos a acuerdo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LISTA DE CHATS */}
        {!activeChatId &&
        <div className={styles.chatList}>
          {isLoading && <div>Cargando chats...</div>}
          {error && <div>Error al cargar los chats</div>}

        {chatsData?.length === 0 ? (
              <div className={styles.noChats}>No tienes chats disponibles</div>
            ) : (
              chatsData?.map((chat) => (
                <div
                  key={chat.id}
                  className={styles.chatItem}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <span>{chat.receiver?.user_info?.username || chat.receiver?.email}</span>
                </div>
              ))
            )}
        </div>
        }

        {/* MENSAJES */}
        {activeChatId && (
          <div className={styles.messages}>
            {isLoading && <div>Cargando...</div>}
            {error && <div>Error al cargar mensajes</div>}
            {chatData?.messages?.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              msg={msg} 
              currentUserId={currentUserId} 
           />
          ))}
          </div>
        )}

        {/* INPUT DE MENSAJE */}
        {activeChatId && (
          <div className={styles.inputBar}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Escribe un mensaje..."
              className={styles.textInput}
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={styles.sendButton}
            >
              Send
            </button>
          </div>
        )}
      </aside>
    </>
  );
}


