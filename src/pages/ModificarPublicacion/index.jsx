import React, { useMemo } from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import CreatePostForm from "@/components/UI/CreatePostForm";
import { useLocation } from "react-router-dom";

export default function ModificarPublicacion() {
  const locationData = useLocation();
  const initialData = useMemo(() => locationData.state || {}, [locationData.state]);
  console.log(initialData);
  
  return (
    <PagesTemplate showNewPost={false}>
      <main>
        <CreatePostForm mode="edit" initialData={initialData} />
      </main>
    </PagesTemplate>
  );
}