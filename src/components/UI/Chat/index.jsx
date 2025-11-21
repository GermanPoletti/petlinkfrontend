import React, { useMemo, useState } from "react";
import styles from "./Chat.module.css";
import { useChat } from "@/context/ChatContext";
import Close from "@/assets/images/icons/Close.png";
import handshake from "@/assets/images/icons/handshake.png";

function MessageBubble({ text, time, variant = "received" }) {
  const cls = useMemo(() => {
    return [styles.message, variant === "sent" ? styles.sent : styles.received].join(" ");
  }, [variant]);
  return (
    <div className={cls}>
      <div className={styles.messageText}>{text}</div>
      {time && <div className={styles.messageTime}>{time}</div>}
    </div>
  );
}

export function ChatPanel() {
  const { isOpen, activeChat, closeChat } = useChat();
  const [messages, setMessages] = useState([
    { id: 1, text: "#message", time: "#time", variant: "received" },
    { id: 2, text: "#message", time: "#time", variant: "sent" },
    { id: 3, text: "#message", time: "#time", variant: "received" },
    { id: 4, text: "#message", time: "#time", variant: "sent" },
  ]);
  const [input, setInput] = useState("");

  const headerPost = activeChat?.postTitle ?? "Chats";
  const headerUser = activeChat?.counterpartUsername ?? "";

  const onSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, time: new Date().toLocaleTimeString(), variant: "sent" },
    ]);
    setInput("");
  };

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={closeChat} aria-hidden />}
      <aside className={`${styles.chatPanel} ${isOpen ? styles.open : ''}`} aria-label="panel de chat" aria-hidden={!isOpen}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={closeChat} aria-label="Cerrar chat">
            <img src={Close} alt="Cerrar" />
          </button>
          <div className={styles.headerCenter}>
            <span className={styles.postTitle}>{headerPost}</span>
            <img src={handshake} alt="Handshake" className={styles.headerIcon} />
            <span className={styles.username}>{headerUser}</span>
          </div>
        </div>

      <div className={styles.messages}>
        {messages.map((m) => (
          <MessageBubble key={m.id} text={m.text} time={m.time} variant={m.variant} />
        ))}
      </div>

      <div className={styles.inputBar}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mensaje"
          className={styles.textInput}
        />
        <button onClick={onSend} className={styles.sendButton} aria-label="Enviar">
          ➤
        </button>
      </div>
    </aside>
    </>
  );
}