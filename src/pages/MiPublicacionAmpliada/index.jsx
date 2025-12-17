import React from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { PostContainer } from "@/components/UI/PostContainer";
import { Frame as UserChatList } from "@/components/UI/UserChatList";
import { useLocation, useNavigate } from "react-router-dom";
import { BtnSecondary, BtnDanger } from "@/components/UI/Buttons";
import { useToast } from "@/components/UI/Toast";
import * as classes from "./MiPublicacionAmpliada.module.css";
import { usePostsApi } from "@/hooks/usePostsApi";
import { useUser } from "../../context/UserContext";

function MiPublicacionAmpliada() {
  const locationData = useLocation();
  const navigate = useNavigate();
  const { userId: currentUserId } = useUser();
  const { showToast } = useToast();
  const post = locationData.state || {};
   const {useGetPostById, deletePost } = usePostsApi();
const { data: postData, isLoading } = useGetPostById(post.id, {
  enabled: !!post.id && !!currentUserId, // ← SOLO SI HAY ID Y USUARIO LOGUEADO
});

  const handleDelete = () => {
  if (!post?.id) {
    showToast("Error: publicación no válida", { type: "error" });
    return;
  }

  const confirmDelete = window.confirm(
    "¿Estás seguro de que querés eliminar esta publicación? Esta acción no se puede deshacer."
  );
  // console.log(!confirmDelete);
  
  // if (!confirmDelete) return;

  deletePost.mutate(post.id, {
    onSuccess: () => {
      showToast("Publicación eliminada correctamente", { type: "success" });
      navigate("/mis-publicaciones");
    },
    onError: (error) => {
      const msg = error?.response?.data?.detail || "Error al eliminar la publicación";
      showToast(msg, { type: "error" });
    },
  });
};
  


 return (
  <PagesTemplate showNewPost={false}>
    <main className={classes.page}>
      <div className={classes.contentWrap}>
        {isLoading ? "Cargando post..." :<PostContainer
          title={postData.title}
          username = {postData.username}
          description={postData.message || postData.description}
          imageUrl={postData.imageUrl || postData?.multimedia?.[0]?.url || null}
          location={postData.city_name || postData.location}
          publishedAt={postData.created_at || postData.publishedAt}
          likesNumber={postData.likes_count}
        />}
        

        <div className={classes.actionsWrap}>
          <div className={classes.leftAction}>
            <BtnSecondary
              text="Modificar"
              className={classes.secondaryBtn}
              divClassName={classes.secondaryBtnLabel}
              size="sm"
              onClick={() => navigate("/modificar-publicacion", { state: post })}
            />
          </div>

          <div className={classes.rightAction}>
            <BtnDanger
              text={deletePost.isPending ? "Eliminando..." : "Eliminar"}
              className={classes.dangerBtn}
              divClassName={classes.dangerBtnLabel}
              size="sm"
              disabled={deletePost.isPending}
              onClick={handleDelete}   
            />
          </div>
        </div>
      </div>
    </main>
  </PagesTemplate>
);
}

export default MiPublicacionAmpliada;
