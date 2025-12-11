import React from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { PostContainer } from "@/components/UI/PostContainer";
import { Frame as UserChatList } from "@/components/UI/UserChatList";
import { useLocation, useNavigate } from "react-router-dom";
import { BtnSecondary, BtnDanger } from "@/components/UI/Buttons";
import { useToast } from "@/components/UI/Toast";
import * as classes from "./MiPublicacionAmpliada.module.css";
import { usePostsApi } from "@/hooks/usePostsApi";

function MiPublicacionAmpliada() {
  const locationData = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const post = locationData.state || {};

  const { deletePost } = usePostsApi();

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
        <PostContainer
          title={post.title}
          description={post.description}
          imageUrl={post.imageUrl}
          location={post.location}
          publishedAt={post.publishedAt}
        />
        <UserChatList postId={post.id} postTitle={post.title} />

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
