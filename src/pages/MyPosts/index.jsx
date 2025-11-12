import React, { useState } from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { CardsFeed } from "@/components/UI/Cards";
import * as classes from "./MyPosts.module.css";
import { useNavigate } from "react-router-dom";
import { myPostsData } from "@/data/data";

function MyPosts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCardClick = (post) => {
    navigate(`/mi-publicacion-ampliada/${post.id}`, { state: post });
  };

  const filteredMyPosts = myPostsData.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PagesTemplate>
      <main className={classes.page}>
        <h2 className={classes.title}>Mis Publicaciones</h2>
        <input
          type="text"
          placeholder="Buscar mis publicaciones..."
          className={classes.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className={classes.feedWrap}>
          <CardsFeed items={filteredMyPosts} onCardClick={handleCardClick} />
        </div>
      </main>
    </PagesTemplate>
  );
}

export default MyPosts;