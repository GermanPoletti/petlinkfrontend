import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { PostContainer } from "@/components/UI/PostContainer";
import { useNavigate } from "react-router-dom";
import { BtnPrimary, BtnDanger, BtnSecondary } from "@/components/UI/Buttons";
import { useToast } from "@/components/UI/Toast";
import { useChatsApi } from "@/hooks/useChatsApi";
import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import { useReportsApi } from "@/hooks/useReportsApi";
import styles from "./PostAmpliadoPage.module.css";
import { usePostsApi } from "@/hooks/usePostsApi";

const formatToSQLDateTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


function PostAmpliadoBase({ post, isOwner, classes }) {
  const { showToast } = useToast();
  const { createChat, useGetMyChats } = useChatsApi();
  const navigate = useNavigate();
  const { openChat } = useChat();
  const { role } = useUser();
  const { createReport } = useReportsApi();
  const {useGetPostById, likePost, deletePost, useIsLikedByUser } = usePostsApi();
  const queryClient = useQueryClient();

  const [customReason, setCustomReason] = React.useState("");
  const [selectedReason, setSelectedReason] = React.useState("");

  const [hasReported, setHasReported] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);


  const { data: postData, isLoading } = useGetPostById(post.id);
  
  const { data: isLikedByUser } = useIsLikedByUser(post?.id);


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

  const handleLike = () => {
    likePost.mutate(post.id, {
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isLiked", post.id] });
      }
    })
  }

  console.log(post);
  
  return (
    <PagesTemplate showNewPost={false}>
      <main className={classes.page}>
        <div className={classes.contentWrap}>
          {isLoading ? "Cargando post..." : 
          <PostContainer
            title={postData.title}
            username = {postData.username}
            description={postData.message || postData.description}
            imageUrl={postData.imageUrl || postData?.multimedia?.[0]?.url || null}
            location={postData.city_name || postData.location}
            publishedAt={formatToSQLDateTime(postData.created_at) || formatToSQLDateTime(postData.publishedAt)}
            likesNumber={postData.likes_count}
          />}

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
                  text={isLikedByUser ? "Quitar like" : "Like"}
                  onClick={() => handleLike()}
                    disabled={likePost.isPending}
                    size="lg"
                  />
          </div>

            <div className={classes.rightAction}>

              {(role === 'admin' || role === 'moderator') && (
                <BtnDanger
                  text={deletePost.isPending ? "Eliminando..." : "Eliminar"}
                  className={classes.dangerBtn}
                  divClassName={classes.dangerBtnLabel}
                  size="sm"
                  onClick={() => {
                    if (window.confirm("¿Estás seguro que deseas eliminar esta publicación?")) {
                      deletePost.mutate(post.id, {
                        onSuccess: () => {
                          showToast("Publicación eliminada correctamente", { type: "success" });
                          navigate(-1); 
                        },
                        onError: () => showToast("Error al eliminar la publicación", { type: "error" })
                      });
                    }
                  }}
                  disabled={deletePost.isPending}
                />
              )}

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
