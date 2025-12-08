import React, { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import { useChat } from "@/context/ChatContext";
import { useChatsApi } from "@/hooks/useChatsApi";
import { useToast } from "@/components/UI/Toast";
import Close from "@/assets/images/icons/Close.png";
import handshake from "@/assets/images/icons/handshake.png";

function MessageBubble({ msg }) {
  const isSent = msg.is_from_current_user === true;
  return (
    <div className={`${styles.message} ${isSent ? styles.sent : styles.received}`}>
      <div className={styles.messageText}>{msg.content}</div>
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
  const { isOpen, activeChatId, closeChat } = useChat();
  const { showToast } = useToast();
  const { useGetChatDetail, sendMessage } = useChatsApi();

  const { data: chatData, isLoading, error } = useGetChatDetail(activeChatId);

  const [input, setInput] = useState("");
  const sendMutation = sendMessage;
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

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

  if (!isOpen) return null;

  // Datos para el header
  const postTitle = chatData?.post?.title || "Chat";
  const counterpartUsername = chatData?.counterpart?.username || "Usuario";

  return (
    <>
      <div className={styles.backdrop} onClick={closeChat} />

      <aside className={`${styles.chatPanel} ${styles.open}`}>
        {/* HEADER */}
        <div className={styles.header}>
          <button onClick={closeChat} aria-label="Cerrar">
            <img src={Close} alt="Cerrar" />
          </button>

          <div className={styles.headerCenter} ref={dropdownRef}>
            <span className={styles.postTitle}>{postTitle}</span>
            <button
              className={styles.handshakeButton}
              onClick={() => setShowDropdown((p) => !p)}
              aria-label="Acuerdo"
            >
              <img src={handshake} alt="Handshake" className={styles.handshakeIcon} />
            </button>
            <span className={styles.username}>@{counterpartUsername}</span>

            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem}>
                  <span className={styles.checkIcon}>Sí</span> Acordamos
                </button>
                <button className={styles.dropdownItem}>
                  <span className={styles.crossIcon}>No</span> No llegamos a acuerdo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MENSAJES */}
        <div className={styles.messages}>
          {isLoading && <div className={styles.loading}>Cargando mensajes...</div>}
          {error && <div className={styles.error}>Error al cargar el chat</div>}
          {!isLoading &&
            !error &&
            chatData?.messages?.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
        </div>

        {/* INPUT */}
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
            disabled={sendMutation.isPending || !input.trim()}
            className={styles.sendButton}
          >
            Send
          </button>
        </div>
      </aside>
    </>
  );
}