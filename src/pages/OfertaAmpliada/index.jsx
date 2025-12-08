import React from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { PostContainer } from "@/components/UI/PostContainer";
import { BtnPrimary, BtnDanger } from "@/components/UI/Buttons";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/UI/Toast";
import { useChatsApi } from "@/hooks/useChatsApi";
import * as classes from "./OfertaAmpliada.module.css";

function OfertaAmpliada() {
  const { state: post } = useLocation(); 
  const { showToast } = useToast();
  const { createChat } = useChatsApi();              

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
        onSuccess: () => {
          showToast("Chat creado con el dueño", { type: "success" });
        },
        onError: (error) => {
          console.log(createChat.error);
          console.log(error)
          if (error.response?.status === 409) {
            showToast("Ya tenés un chat abierto con esta persona", { type: "info" });
          } else {
            showToast("Error al crear el chat", { type: "error" });
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
