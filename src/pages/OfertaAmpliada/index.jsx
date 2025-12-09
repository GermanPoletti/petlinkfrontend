import React from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { PostContainer } from "@/components/UI/PostContainer";
import { BtnPrimary, BtnDanger } from "@/components/UI/Buttons";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/UI/Toast";
import { useChatsApi } from "@/hooks/useChatsApi";
import * as classes from "./OfertaAmpliada.module.css";
import { useChat } from "@/context/ChatContext";

function OfertaAmpliada() {
  const { state: post } = useLocation(); 
  const { showToast } = useToast();
  const { createChat } = useChatsApi();              
  const { openChat } = useChat();

  const currentUserId = Number(localStorage.getItem("userId")); 
  const isOwner = post?.user?.id === currentUserId || post?.user_id === currentUserId;


  const handleMeInteresa = () => {
    if (!post?.id) {
      showToast("Error: publicación no válida", { type: "error" });
      return;
    }

    createChat.mutate(
      { post_id: post.id },
      {
        onSuccess: (data) => {
          const chatId = data?.id || data?.chat_id || data?.detail?.chat_id;
          if (chatId) {
            openChat(chatId);
            showToast("Chat abierto", { type: "success" });
          } else {
            showToast("Chat creado", { type: "success" });
          }
        },
        onError: (error) => {
          const status = error?.response?.status;
          if (status === 409) {
            const chatId = error?.response?.data?.detail?.chat_id;
            if (chatId) {
              openChat(chatId);
              showToast("Ya tenías un chat abierto", { type: "info" });
            } else {
              showToast("Ya existe un chat con esta persona", { type: "info" });
            }
          } else {
            const msg = error?.response?.data?.detail || "Error al crear el chat";
            showToast(msg, { type: "error" });
          }
        },
      }
    );
  };

  return (
    <PagesTemplate showNewPost={false}>
      <main className={classes.page}>
        <div className={classes.contentWrap}>
          <PostContainer
            title={post.title}
            description={post.description}
            imageUrl={post.imageUrl}
            location={post.location}
            publishedAt={post.publishedAt}
          />
          <div className={classes.actionsWrap}>
            <div className={classes.leftAction}>
            {!isOwner && (
            <BtnPrimary
             text={createChat.isPending ? "Creando chat..." : "Me Interesa"}
             onClick={handleMeInteresa}
             disabled={createChat.isPending}
             size="lg"
           />
)}
            </div>
            <div className={classes.rightAction}>
              <BtnDanger
                text="Reportar"
                className={classes.dangerBtn}
                divClassName={classes.dangerBtnLabel}
                size="sm"
                onClick={() => showToast("Has reportado esta publicación.")}
              />
            </div>
          </div>
        </div>
      </main>
    </PagesTemplate>
  );
}

export default OfertaAmpliada;
