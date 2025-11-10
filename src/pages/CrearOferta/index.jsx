import React from "react";
import { PagesTemplate } from "@/components/UI/PagesTemplate";
import CreatePostForm from "@/components/UI/CreatePostForm";

export default function CrearOferta() {
  return (
    <PagesTemplate showNewPost={false}>
      <main>
        <CreatePostForm type="oferta" />
      </main>
    </PagesTemplate>
  );
}