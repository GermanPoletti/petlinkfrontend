import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [messages, setMessages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Mock API call to fetch messages
  const fetchMessages = async (publicationId) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (publicationId === "1") {
      return [
        { id: 1, text: "¡Hola! ¿Todavía tienes el perrito en adopción?", time: "10:00 AM", variant: "received" },
        { id: 2, text: "¡Sí! Sigue disponible. ¿Te gustaría conocerlo?", time: "10:05 AM", variant: "sent" },
        { id: 3, text: "Me encantaría. ¿Cuándo sería un buen momento?", time: "10:10 AM", variant: "received" },
      ];
    } else if (publicationId === "2") {
      return [
        { id: 1, text: "Hola, ¿la gatita de la publicación sigue buscando hogar?", time: "09:30 AM", variant: "received" },
        { id: 2, text: "Así es, es muy cariñosa. ¿Tienes alguna pregunta?", time: "09:35 AM", variant: "sent" },
      ];
    }
    return [];
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (activeChat?.publicationId) {
      fetchMessages(activeChat.publicationId).then((data) => {
        setMessages(data);
      });
    } else {
      setMessages([]); // Clear messages if no active chat
    }
  }, [activeChat?.publicationId]);
  const [input, setInput] = useState("");

  const headerPost = activeChat?.postTitle ?? "Chats";
  const headerUser = activeChat?.counterpartUsername ?? "";

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Mock API call to send message
    const sendMessage = async (messageContent) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { id: Date.now(), text: messageContent, time: new Date().toLocaleTimeString(), variant: "sent" };
    };

    const newMessage = await sendMessage(trimmed);

    setMessages((prev) => [
      ...prev,
      newMessage,
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
          <div className={styles.headerCenter} ref={dropdownRef}>
            <span className={styles.postTitle}>{headerPost}</span>
            <button className={styles.handshakeButton} onClick={() => setShowDropdown((prev) => !prev)} aria-label="Acuerdo">
              <img src={handshake} alt="Handshake" className={styles.handshakeIcon} />
            </button>
            <span className={styles.username}>{headerUser}</span>
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem}>
                  <span className={styles.checkIcon}>✔</span> Sí
                </button>
                <button className={styles.dropdownItem}>
                  <span className={styles.crossIcon}>✖</span> No
                </button>
              </div>
            )}
          </div>
        </div>

      <div className={styles.messages}>
        {messages.map((m) => (
          <MessageBubble key={m.id} text={m.text} time={m.time} variant={m.variant} />
        ))}
      </div>

      <div className={styles.inputBar}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            } else if (e.key === "Enter" && e.shiftKey) {
              // Allow new line
            }
          }}
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