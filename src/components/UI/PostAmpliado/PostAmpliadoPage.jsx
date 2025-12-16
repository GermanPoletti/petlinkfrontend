import React from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { PostContainer } from "@/components/UI/PostContainer";
import { BtnPrimary, BtnDanger, BtnSecondary } from "@/components/UI/Buttons";
import { useToast } from "@/components/UI/Toast";
import { useChatsApi } from "@/hooks/useChatsApi";
import { useChat } from "@/context/ChatContext";
import { useReportsApi } from "@/hooks/useReportsApi";
import styles from "./PostAmpliadoPage.module.css";
import { usePostsApi } from "@/hooks/usePostsApi";

function PostAmpliadoBase({ post, isOwner, classes }) {
  const { showToast } = useToast();
  const { createChat, useGetMyChats } = useChatsApi();
  const { openChat } = useChat();
  const { createReport } = useReportsApi();
  const {useGetPostById, likePost} = usePostsApi();

  const [customReason, setCustomReason] = React.useState("");
  const [selectedReason, setSelectedReason] = React.useState("");

  const [hasReported, setHasReported] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);


  const { data: postData } = useGetPostById(post?.id);
  console.log("PostData:", postData);

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

  const reasons = [
    { label: "Spam o estafa", value: "spam" },
    { label: "Contenido ofensivo", value: "offensive" },
    { label: "Información falsa", value: "false_info" },
    { label: "Otro motivo", value: "other", isCustom: true },
  ];

  const handleReport = (reason) => {
    if (!post?.id || hasReported) return;

    createReport.mutate(
      {
        post_id: post.id,
        reason: reason,
      },
      {
        onSuccess: () => {
          setHasReported(true);
          setShowReportModal(false);
          showToast("Gracias por tu reporte. Lo revisaremos pronto.", {
            type: "success",
            duration: 5000,
          });
        },
        onError: (error) => {
          setShowReportModal(false);
          if (error.response?.status === 409) {
            setHasReported(true);
            showToast("Ya habías reportado esta publicación", { type: "info" });
          } else {
            showToast("Error al enviar el reporte", { type: "error" });
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
            username = {post.username}
            description={post.message || post.description}
            imageUrl={post.imageUrl ||post?.multimedia[0]?.url}
            location={post.city_name || post.location}
            publishedAt={post.created_at || post.publishedAt}
          />

        <div className={classes.actionsWrap}>
            <div className={classes.leftAction}>
            {!isOwner && (
              <>
                <BtnPrimary
                  text={createChat.isPending ? "Creando chat..." : "Me Interesa"}
                  onClick={handleMeInteresa}
                  disabled={createChat.isPending}
                  size="lg"
                />
                 
              </>
            )}

            <BtnSecondary
                  text={postData?.is_liked ? "Quitar like" : "Like"}
                   onClick={() => {
                      console.log("Like button clicked", post?.id);
                      likePost.mutate(post.id, {
                        onSuccess: () => console.log("Like mutation success"),
                        onError: (e) => console.error("Like mutation error", e)
                      });
                    }}
                    disabled={likePost.isPending}
                    size="lg"
                  />
          </div>

            <div className={classes.rightAction}>
              <BtnDanger
                text={hasReported ? "Reportado" : "Reportar"}
                className={classes.dangerBtn}
                divClassName={classes.dangerBtnLabel}
                size="sm"
                onClick={() => !hasReported && setShowReportModal(true)}
                disabled={hasReported}
/>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE REPORTE */}
{showReportModal && (
  <div className={styles.reportModalOverlay} onClick={() => {
    setShowReportModal(false);
    setSelectedReason("");
    setCustomReason("");
  }}>
    <div className={styles.reportModal} onClick={(e) => e.stopPropagation()}>
      <h3>¿Por qué querés reportar esta publicación?</h3>
      
      <div className={styles.reasonsList}>
        {reasons.map((r) => (
          <button
            key={r.value}
            className={`${styles.reasonBtn} ${selectedReason === r.value ? styles.reasonBtnSelected : ""}`}
            onClick={() => {
              setSelectedReason(r.value);
              if (!r.isCustom) {
                handleReport(r.value);
              }
            }}
            disabled={createReport.isPending}
          >
            {createReport.isPending && selectedReason === r.value ? "Enviando..." : r.label}
          </button>
        ))}

        {/* Textarea solo si eligió "Otro motivo" */}
        {selectedReason === "other" && (
          <div className={styles.customReasonWrapper}>
            <textarea
              placeholder="Escribí aquí el motivo del reporte..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className={styles.customReasonTextarea}
              rows={4}
              maxLength={300}
              autoFocus
            />
            <button
              className={styles.sendCustomBtn}
              onClick={() => handleReport(customReason.trim() || "Otro motivo")}
              disabled={createReport.isPending || !customReason.trim()}
            >
              {createReport.isPending ? "Enviando..." : "Enviar reporte"}
            </button>
          </div>
        )}
      </div>

      <button
        className={styles.cancelBtn}
        onClick={() => {
          setShowReportModal(false);
          setSelectedReason("");
          setCustomReason("");
        }}
      >
        Cancelar
      </button>
    </div>
  </div>
)}
    </PagesTemplate>
  );
}

export default PostAmpliadoBase;
