import React from "react";
import { useLocation } from "react-router-dom";
import PostAmpliadoBase from "@/components/UI/PostAmpliado/PostAmpliadoPage";
import * as classes from "./PropuestaAmpliada.module.css";
import { useUser } from "../../context/UserContext";
function PropuestaAmpliada() {
  const { state: post } = useLocation();
    const {userId} = useUser();

  const isOwner =
    post?.userId === userId || post?.user_id === userId;

  return (
    <PostAmpliadoBase
      post={post}
      isOwner={isOwner}
      classes={classes}
    />
  );
}

export default PropuestaAmpliada;
