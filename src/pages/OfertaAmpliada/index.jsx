import React from "react";
import { useLocation } from "react-router-dom";
import PostAmpliadoBase from "@/components/UI/PostAmpliado/PostAmpliadoPage";
import * as classes from "./OfertaAmpliada.module.css";

function OfertaAmpliada() {
  const { state: post } = useLocation();
  const currentUserId = Number(localStorage.getItem("userId"));

  const isOwner =
    post?.userId === currentUserId || post?.user_id === currentUserId;

  return (
    <PostAmpliadoBase
      post={post}
      isOwner={isOwner}
      classes={classes}
    />
  );
}

export default OfertaAmpliada;
