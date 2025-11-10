import React from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { PostContainer } from "../../components/UI/PostContainer";


function Ofertas() {
  return (
    <PagesTemplate onNewPostClick={() => {}}>
        <PostContainer />
    </PagesTemplate>
  );
}