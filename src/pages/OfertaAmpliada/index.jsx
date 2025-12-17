import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { usePostsApi } from "../../hooks/usePostsApi";
import { useLocation,useParams } from "react-router-dom";
import PostAmpliadoBase from "@/components/UI/PostAmpliado/PostAmpliadoPage";
import * as classes from "./OfertaAmpliada.module.css";

function OfertaAmpliada() {
  const location = useLocation();
  const { id } = useParams();
  const {useGetPostById} = usePostsApi()
  const [post, setPost] = useState(location.state || null);
  const { userId } = useUser()
  const {data: postData, isLoading, error} = useGetPostById(id)
  useEffect(()=>{
    if(!post){
      console.log("updated by endpoint");
      setPost(postData)
    }
  }, [])

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

export default OfertaAmpliada;
