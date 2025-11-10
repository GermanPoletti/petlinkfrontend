import React from "react";
import { PagesTemplate } from "@/components/UI/PagesTemplate";
import CreatePostForm from "@/components/UI/CreatePostForm";

export default function CrearPropuesta() {
  return (
    <PagesTemplate showNewPost={false}>
      <main>
        <CreatePostForm type="propuesta" />
      </main>
    </PagesTemplate>
  );
}