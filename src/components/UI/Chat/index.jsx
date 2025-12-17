import React, { useState, useEffect, useRef } from "react";
import styles from "./Chat.module.css";
import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import { useChatsApi } from "@/hooks/useChatsApi";
import { usePostsApi } from "@/hooks/usePostsApi";
import { useToast } from "@/components/UI/Toast";
import backarrowIcon from "@/assets/images/icons/backarrow.png";
import handshake from "@/assets/images/icons/handshake.png";

function MessageBubble({ msg, currentUserId, senderName }) {
  const isMine =
    msg.sender_id === currentUserId || msg.is_from_current_user === true;

  const messageDate = new Date(msg.created_at);
  const formattedDate = messageDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
  const formattedTime = messageDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateTime = `${formattedDate}, ${formattedTime}`;

  return (
    <div
      className={`${styles.message} ${isMine ? styles.sent : styles.received}`}
    >
      <div className={styles.messageText}>{msg.message || msg.content}</div>

      <div className={styles.messageFooter}>
        <span className={styles.senderName}>
          {senderName ? `${senderName}` : "Usuario"}
        </span>
        <span className={styles.messageDateTime}>{dateTime}</span>
      </div>
    </div>
  );
}

// ====== COMPONENTE PARA CHATS INICIADOS (para evitar hook dentro de map) ======
function InitiatedChatItem({ chat, onSelect }) {
  const { useGetPostById } = usePostsApi();
  const { data: post, isLoading: loadingPost } = useGetPostById(chat.post_id);
  console.log(chat);

  return (
    <div className={styles.chatItem} onClick={() => onSelect(chat.id)}>
      <div className={styles.chatPostTitle}>
        {loadingPost ? "Cargando post..." : post?.title || "Post eliminado"}
      </div>
      <div className={styles.chatUser}>
        Dueño: @{chat.receiver_username || chat.receiver?.email || "Usuario"}
      </div>
    </div>
  );
}

export function ChatPanel() {
  const [previousTab, setPreviousTab] = useState("myPosts"); // recuerda la pestaña anterior
  const { isOpen, activeChatId, setActiveChatId, closeChat } = useChat();
  const { showToast } = useToast();
  const { userId: currentUserId } = useUser();
  const [chatsFilter, setChatsFilter] = useState("active"); // "active" | "inactive" | "all"
  const { useGetMyChats, useGetChatDetail, sendMessage, resolveChat } =
    useChatsApi();
  const { useInfinitePosts, useGetPostById } = usePostsApi();

  // Estados de navegación
  const [viewLevel, setViewLevel] = useState("posts"); // "posts" | "chats" | "conversation"
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [tab, setTab] = useState("myPosts"); // "myPosts" | "initiatedChats"

  // Filtros
  const [searchTitle, setSearchTitle] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Input de mensaje
  const [input, setInput] = useState("");
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // === NIVEL 1: Mis Posts ===
  const postsFilters = {
    user_id: tab === "myPosts" ? currentUserId : undefined,
    keyword: searchTitle || undefined,
    show_only_active: showOnlyActive
      ? true
      : showOnlyActive === false
      ? false
      : undefined,
  };
  console.log("aaaa", currentUserId);

  const {
    data: postsPages,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: loadingMorePosts,
    isLoading: loadingPosts,
  } = useInfinitePosts(postsFilters, {
    enabled: !!currentUserId, // ← SOLO SI ESTÁS LOGUEADO
  });

  const posts = postsPages?.pages.flatMap((page) => page.posts) || [];
  const initiatedChatsFilters = {
    only_active: showOnlyActive === null ? undefined : showOnlyActive,
  };
  // === Chats iniciados por mí (pestaña "Chats Iniciados") ===
  const { data: initiatedChats = [], isLoading: loadingInitiatedChats } =
    useGetMyChats(initiatedChatsFilters, currentUserId, {
      enabled: !!currentUserId,
    });

  const myInitiatedChats = initiatedChats.filter(
    (chat) => chat.initiator_id === currentUserId
  );

  // === NIVEL 2: Chats de un post seleccionado ===
  const chatsOfPostFilters = {
    post_id: selectedPostId,
    only_active: chatsFilter === "all" ? undefined : chatsFilter === "active",
  };

  const { data: chatsOfPost = [], isLoading: loadingChatsOfPost } =
    useGetMyChats(chatsOfPostFilters, currentUserId, {
      enabled: !!selectedPostId && viewLevel === "chats",
    });

  // === NIVEL 3: Conversación individual ===
  const { data: chatData, isLoading: loadingMessages } =
    useGetChatDetail(activeChatId);

  // === Título del nivel 2 (post seleccionado) ===
  const { data: selectedPost } = useGetPostById(selectedPostId, {
    enabled: !!currentUserId,
  });

  // Handlers de navegación
  const goToPosts = () => {
    setViewLevel("posts");
    setSelectedPostId(null);
    setActiveChatId(null);
  };

  const goToChatsOfPost = (postId) => {
    setPreviousTab(tab); // ← también guardamos aquí
    setViewLevel("chats");
    setSelectedPostId(postId);
    setActiveChatId(null);
  };

  const goToConversation = (chatId) => {
    setPreviousTab(tab); // ← GUARDAMOS la pestaña actual
    setViewLevel("conversation");
    setActiveChatId(chatId);
  };

  const handleBack = () => {
    if (viewLevel === "conversation") {
      setViewLevel("posts");
      setTab(previousTab); // ← VOLVEMOS a la pestaña desde donde vinimos
      setActiveChatId(null);
    } else if (viewLevel === "chats") {
      setViewLevel("posts");
      setChatsFilter("active");
      setSelectedPostId(null);
      setActiveChatId(null);
    } else {
      closeChat();
    }
  };
  // Título dinámico
  const getTitle = () => {
    if (viewLevel === "posts")
      return tab === "myPosts" ? "Mis Publicaciones" : "Chats Iniciados";
    if (viewLevel === "chats") return selectedPost?.title || "Cargando post...";
    return chatData?.post_title || "Chat";
  };

  // Handshake solo si soy dueño del post
  const isOwner = !!chatData && chatData.receiver_id === currentUserId;

  const handleResolve = (completed) => {
    if (!activeChatId) return;
    resolveChat.mutate(
      { chat_id: activeChatId, completed, resolution_note: null },
      {
        onSuccess: () => {
          setShowDropdown(false);
          showToast(completed ? "Acuerdo concretado" : "Acuerdo rechazado", {
            type: completed ? "success" : "info",
          });
          closeChat();
        },
        onError: () => showToast("Error al resolver", { type: "error" }),
      }
    );
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || !activeChatId) return;

    sendMessage.mutate(
      { chat_id: activeChatId, message: text },
      {
        onSuccess: () => setInput(""),
        onError: () => showToast("Error al enviar", { type: "error" }),
      }
    );
  };

  useEffect(() => {
    if (isOpen) {
      // Al abrir el panel, siempre empezamos en nivel 1, pestaña "Mis Publicaciones"
      setViewLevel("posts");
      setTab("myPosts");
      setSelectedPostId(null);
      setActiveChatId(null);
      setShowFilters(false);
      setSearchTitle("");
      setChatsFilter("active");
      setShowOnlyActive(true);
    }
  }, [isOpen]);

  // Scroll automático
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  // Cerrar filtros al hacer click fuera
  useEffect(() => {
    if (!showFilters) return;

    const handleClickOutside = (event) => {
      // Si el click no está dentro del contenedor de filtros, cerramos
      const filtersContainer = document.querySelector(
        `.${styles.filtersContainer}`
      );
      if (filtersContainer && !filtersContainer.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  if (!isOpen) return null;

  console.log(
    "chatdata: ",
    chatData,
    " chatofpost:",
    chatsOfPost,
    " post:",
    posts,
    "postpage",
    postsPages
  );
  console.log("myinit", myInitiatedChats);

  return (
    <>
      <div className={styles.backdrop} onClick={closeChat} />
      <aside className={`${styles.chatPanel} ${styles.open}`}>
        {/* HEADER */}
        <div className={styles.header}>
          <button onClick={handleBack} className={styles.backButton}>
            <img src={backarrowIcon} alt="Volver" />
          </button>
          <div className={styles.headerCenter}>
            <span className={styles.postTitle}>{getTitle()}</span>
            {viewLevel === "conversation" && isOwner && chatData?.is_active ? (
              <button
                className={styles.handshakeButton}
                onClick={() => setShowDropdown((p) => !p)}
              >
                <img
                  src={handshake}
                  alt="Handshake"
                  className={styles.handshakeIcon}
                />
              </button>
            ) : viewLevel === "conversation" ? (
              <span>-</span>
            ) : null}
            {viewLevel === "conversation" && !loadingMessages && chatData && (
              <span>
                {isOwner
                  ? chatData.initiator_username
                  : chatData.receiver_username}
              </span>
            )}
            {showDropdown &&
              viewLevel === "conversation" &&
              isOwner &&
              chatData?.is_active && (
                <div className={styles.dropdownMenu} ref={dropdownRef}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleResolve(true)}
                  >
                    <span className={styles.checkIcon}>Sí</span> Acuerdo
                    concretado
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleResolve(false)}
                  >
                    <span className={styles.crossIcon}>No</span> Acuerdo no
                    concretado
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* PESTAÑAS */}
        {viewLevel === "posts" && (
          <div className={styles.tabs}>
            <button
              className={tab === "myPosts" ? styles.tabActive : styles.tab}
              onClick={() => setTab("myPosts")}
            >
              Mis Publicaciones
            </button>
            <button
              className={
                tab === "initiatedChats" ? styles.tabActive : styles.tab
              }
              onClick={() => setTab("initiatedChats")}
            >
              Chats Iniciados
            </button>
          </div>
        )}

        {/* FILTROS */}
        {viewLevel === "posts" && (
          <div className={styles.filtersContainer}>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              Filtros {showFilters ? "▲" : "▼"}
            </button>

            {showFilters && (
              <div className={styles.filtersDropdown}>
                {tab === "myPosts" && (
                  <input
                    type="text"
                    placeholder="Buscar por título..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className={styles.filterSearch}
                  />
                )}
                <div className={styles.filterOptions}>
                  <label>
                    <input
                      type="radio"
                      checked={showOnlyActive === true}
                      onChange={() => setShowOnlyActive(true)}
                    />
                    Solo activos
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={showOnlyActive === false}
                      onChange={() => setShowOnlyActive(false)}
                    />
                    Solo inactivos
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={showOnlyActive === null}
                      onChange={() => setShowOnlyActive(null)}
                    />
                    Todos
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NIVEL 1: Lista según pestaña */}
        {viewLevel === "posts" && (
          <div className={styles.chatList}>
            {tab === "myPosts" ? (
              <>
                {loadingPosts && <div>Cargando publicaciones...</div>}
                {posts.length === 0 ? (
                  <div className={styles.noChats}>No tienes publicaciones</div>
                ) : (
                  <>
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className={styles.postItem}
                        onClick={() => goToChatsOfPost(post.id)}
                      >
                        <div className={styles.postTitleItem}>{post.title}</div>
                        <div className={styles.postChatsCount}>chats →</div>
                      </div>
                    ))}
                    {hasNextPosts && (
                      <button
                        onClick={() => fetchNextPosts()}
                        disabled={loadingMorePosts}
                      >
                        {loadingMorePosts ? "Cargando..." : "Cargar más"}
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {loadingInitiatedChats && <div>Cargando chats...</div>}
                {myInitiatedChats.length === 0 ? (
                  <div className={styles.noChats}>
                    No has iniciado ningún chat
                  </div>
                ) : (
                  myInitiatedChats.map((chat) => (
                    <InitiatedChatItem
                      key={chat.id}
                      chat={chat}
                      onSelect={goToConversation}
                    />
                  ))
                )}
              </>
            )}
          </div>
        )}

        {/* NIVEL 2: Chats de un post */}
        {viewLevel === "chats" && (
          <>
            {/* Pestañas de filtro para chats del post */}
            <div className={styles.tabs}>
              <button
                className={
                  chatsFilter === "active" ? styles.tabActive : styles.tab
                }
                onClick={() => setChatsFilter("active")}
              >
                Activos
              </button>
              <button
                className={
                  chatsFilter === "inactive" ? styles.tabActive : styles.tab
                }
                onClick={() => setChatsFilter("inactive")}
              >
                Inactivos
              </button>
              <button
                className={
                  chatsFilter === "all" ? styles.tabActive : styles.tab
                }
                onClick={() => setChatsFilter("all")}
              >
                Todos
              </button>
            </div>

            <div className={styles.chatList}>
              {loadingChatsOfPost && <div>Cargando chats...</div>}
              {chatsOfPost?.length === 0 ? (
                <div className={styles.noChats}>
                  {chatsFilter === "active" &&
                    "No hay chats activos en esta publicación"}
                  {chatsFilter === "inactive" && "No hay chats inactivos"}
                  {chatsFilter === "all" && "No hay chats"}
                </div>
              ) : (
                chatsOfPost?.map((chat) => (
                  <div
                    key={chat.id}
                    className={`${styles.chatItem} ${
                      !chat.is_active ? styles.inactive : ""
                    }`}
                    onClick={() => goToConversation(chat.id)}
                  >
                    <div className={styles.chatUser}>
                      @
                      {chat.counterpart_username ||
                        chat.receiver?.email?.split("@")[0] ||
                        "Usuario"}
                      {!chat.is_active && (
                        <span className={styles.chatClosedLabel}>
                          (cerrado)
                        </span>
                      )}
                    </div>
                    <div className={styles.lastMessagePreview}>
                      {chat.last_message?.message || "Sin mensajes"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* NIVEL 3: Conversación */}
        {viewLevel === "conversation" && (
          <>
            <div className={styles.messages}>
              {loadingMessages && <div>Cargando mensajes...</div>}
              {chatData?.messages?.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  currentUserId={currentUserId}
                  senderName={msg.sender_username}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input para enviar mensaje o info de chat cerrado */}
            {chatData?.is_active ? (
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
            ) : (
              <div className={styles.chatClosedInfo}>
                Este chat está cerrado. No se pueden enviar más mensajes.
              </div>
            )}
          </>
        )}
      </aside>
    </>
  );
}
