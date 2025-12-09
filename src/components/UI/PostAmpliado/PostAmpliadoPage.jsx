import React from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { PostContainer } from "@/components/UI/PostContainer";
import { BtnPrimary, BtnDanger } from "@/components/UI/Buttons";
import { useToast } from "@/components/UI/Toast";
import { useChatsApi } from "@/hooks/useChatsApi";
import { useChat } from "@/context/ChatContext";

function PostAmpliadoBase({ post, isOwner, classes }) {
  const { showToast } = useToast();
  const { createChat, useGetMyChats } = useChatsApi();
  const { openChat } = useChat();

  const { data: myChats = [] } = useGetMyChats(
    { post_id: post?.id },
    { enabled: !!post?.id }
  );

  const handleMeInteresa = async () => {
    if (!post?.id) {
      showToast("Error: publicación no válida", { type: "error" });
      return;
    }

    try {
      const result = await createChat.mutateAsync({ post_id: post.id });
      const chatId = result.id || result.chat_id;
      showToast("Chat creado", { type: "success" });
      openChat(chatId);
    } catch (error) {
      if (error.response?.status === 409) {
        const chat = myChats.find((c) => c.post_id === post.id);
        if (chat?.id) {
          showToast("Ya tenías un chat abierto", { type: "info" });
          openChat(chat.id);
        } else {
          showToast("Error al abrir el chat existente", { type: "error" });
        }
      } else {
        const msg = error?.response?.data?.detail || "Error al crear el chat";
        showToast(msg, { type: "error" });
      }
    }
  };

  return (
    <PagesTemplate showNewPost={false}>
      <main className={classes.page}>
        <div className={classes.contentWrap}>
          <PostContainer
            title={post.title}
            username = {post.username}
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

export default PostAmpliadoBase;
