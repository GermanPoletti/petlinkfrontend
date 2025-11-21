import React from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { PostContainer } from "@/components/UI/PostContainer";
import { Frame as UserChatList } from "@/components/UI/UserChatList";
import { useLocation, useNavigate } from "react-router-dom";
import { BtnSecondary, BtnDanger } from "@/components/UI/Buttons";
import { useToast } from "@/components/UI/Toast";
import * as classes from "./MiPublicacionAmpliada.module.css";

function MiPublicacionAmpliada() {
  const locationData = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const post = locationData.state || {};

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
          <UserChatList chats={[]} postTitle={post.title} />
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
                text="Eliminar"
                className={classes.dangerBtn}
                divClassName={classes.dangerBtnLabel}
                size="sm"
                onClick={() => {
                  const ok = window.confirm("¿Seguro que quieres eliminar esta publicación?");
                  if (ok) showToast("Publicación eliminada.");
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </PagesTemplate>
  );
}

export default MiPublicacionAmpliada;