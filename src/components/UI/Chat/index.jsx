import React, { useState, useEffect, useRef } from "react";
import styles from "./Chat.module.css";
import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import { useChatsApi } from "@/hooks/useChatsApi";
import { usePostsApi } from "@/hooks/usePostsApi";
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

  const { useGetMyChats, useGetChatDetail, sendMessage, resolveChat } = useChatsApi();
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
    show_only_active: showOnlyActive ? true : showOnlyActive === false ? false : undefined,
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
  
  const posts = postsPages?.pages.flatMap(page => page.posts) || [];

  // === Chats iniciados por mí (pestaña "Chats Iniciados") ===
  const {
    data: initiatedChats = [],
    isLoading: loadingInitiatedChats,
  } = useGetMyChats({}, currentUserId);

  const myInitiatedChats = initiatedChats.filter(chat => chat.initiator_id === currentUserId);

  // === NIVEL 2: Chats de un post seleccionado ===
  const {
    data: chatsOfPost,
    isLoading: loadingChatsOfPost,
  } = useGetMyChats({ post_id: selectedPostId }, currentUserId);

  // === NIVEL 3: Conversación individual ===
  const { data: chatData, isLoading: loadingMessages } = useGetChatDetail(activeChatId);

  // === Título del nivel 2 (post seleccionado) ===
  const { data: selectedPost } = useGetPostById(selectedPostId, {enabled: !!currentUserId});

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
    setSelectedPostId(null);
    setActiveChatId(null);
  } else {
    closeChat();
  }
};
  // Título dinámico
  const getTitle = () => {
    if (viewLevel === "posts") return tab === "myPosts" ? "Mis Publicaciones" : "Chats Iniciados";
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
    setShowOnlyActive(true);
  }
}, [isOpen]);

  // Scroll automático
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  if (!isOpen) return null;
 
  
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
            {viewLevel === "conversation" && isOwner && (
              <button
                className={styles.handshakeButton}
                onClick={() => setShowDropdown(p => !p)}
              >
                <img src={handshake} alt="Handshake" className={styles.handshakeIcon} />
              </button>
            )}
            {showDropdown && viewLevel === "conversation" && isOwner && (
              <div className={styles.dropdownMenu} ref={dropdownRef}>
                <button className={styles.dropdownItem} onClick={() => handleResolve(true)}>
                  <span className={styles.checkIcon}>Sí</span> Acuerdo concretado
                </button>
                <button className={styles.dropdownItem} onClick={() => handleResolve(false)}>
                  <span className={styles.crossIcon}>No</span> Acuerdo no concretado
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
              className={tab === "initiatedChats" ? styles.tabActive : styles.tab}
              onClick={() => setTab("initiatedChats")}
            >
              Chats Iniciados
            </button>
          </div>
        )}

        {/* FILTROS */}
        {viewLevel === "posts" && (
          <div className={styles.filtersHeader}>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(p => !p)}
            >
              Filtros {showFilters ? "▲" : "▼"}
            </button>
            {showFilters && (
              <div className={styles.filtersDropdown}>
                <input
                  type="text"
                  placeholder="Buscar por título..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className={styles.filterSearch}
                />
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
                        <div className={styles.postChatsCount}>
                          chats →
                        </div>
                      </div>
                    ))}
                    {hasNextPosts && (
                      <button onClick={() => fetchNextPosts()} disabled={loadingMorePosts}>
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
                  <div className={styles.noChats}>No has iniciado ningún chat</div>
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
          <div className={styles.chatList}>
            {loadingChatsOfPost && <div>Cargando chats...</div>}
            {chatsOfPost?.length === 0 ? (
              <div className={styles.noChats}>No hay chats en esta publicación</div>
            ) : (
              chatsOfPost?.map((chat) => (
                <div
                  key={chat.id}
                  className={styles.chatItem}
                  onClick={() => goToConversation(chat.id)}
                >
                  <div className={styles.chatUser}>
                    @{chat.counterpart_username || chat.receiver.email?.split("@")[0] || "Usuario"}
                  </div>
                  <div className={styles.lastMessagePreview}>
                    {chat.last_message?.message || "Sin mensajes"}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* NIVEL 3: Conversación */}
        {viewLevel === "conversation" && (
          <>
            <div className={styles.messages}>
              {loadingMessages && <div>Cargando mensajes...</div>}
              {chatData?.messages?.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} currentUserId={currentUserId} />
              ))}
              <div ref={messagesEndRef} />
            </div>

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
                <button onClick={handleSend} disabled={!input.trim()} className={styles.sendButton}>
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