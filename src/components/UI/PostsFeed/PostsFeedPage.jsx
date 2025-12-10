import React, { useState, useEffect, useCallback, useRef } from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { CardsFeed } from "@/components/UI/Cards";
import { useNavigate } from "react-router-dom";
import * as classes from "./PostsFeed.module.css";
import FilterBar from "@/components/UI/FilterBar";
import { usePostsApi } from "@/hooks/usePostsApi";
import { useToast } from "@/components/UI/Toast";
// import { useQueryClient } from "@tanstack/react-query";

function PostsFeedPage({
  type,               
  postTypeId,         
  title,              
  detailRoutePrefix,  
  noMoreText = "No hay más publicaciones",
  userId,
}) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [keywordSearchTerm, setKeywordSearchTerm] = useState("");

  const { useInfinitePosts } = usePostsApi();
  const { showToast } = useToast();

  const filters = {
    show_only_active: true,
    user_id: userId || undefined,
    post_type_id: postTypeId,
    category: selectedCategory || undefined,
    city: locationSearchTerm || undefined,
    keyword: keywordSearchTerm || undefined,
  };

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(filters);

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  // Observer para infinite scroll
  const observer = useRef();
  const lastCardRef = useCallback(
    (node) => {
      if (isPending || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isPending, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const mappedPosts = allPosts.map((post) => ({
    id: post.id,
    userId: post.user_id,
    title: post.title,
    username: post.username,
    description: post.message,
    imageUrl: post.multimedia?.[0]?.url || "https://placehold.co/600x400",
    location: post.city_name || "Sin ubicación",
    publishedAt: post.created_at,
    type: post.post_type_id === 1 ? "propuesta" : "oferta",
    category: post.category,
    likes: post.likes_count || 0,
  }));

  // descomentar para reiniciar scroll cuando se sale de la pagina
  // useEffect(() => {
  //   return () => {
  //     queryClient.removeQueries({ queryKey: ["posts", "infinite"] });
  //   };
  // }, [queryClient]);

  useEffect(() => {
    if (isError) {
      showToast(`Error al cargar las ${type}s`, { type: "error" });
    }
  }, [isError, error, showToast, type]);

  const handleCardClick = (item) => {
    navigate(`/${detailRoutePrefix}/${item.id}`, { state: item });
  };

  return (
    <PagesTemplate title={title} onNewPostClick={() => {}}>
      <main className={classes.page}>
        <h2 className={classes.title}>{type}</h2>
        <FilterBar
          onCategoryChange={setSelectedCategory}
          onLocationChange={setLocationSearchTerm}
          onKeywordChange={setKeywordSearchTerm}
        />
        <div className={classes.feedWrap}>
          {isPending && <div style={{ textAlign: "center", padding: "2rem" }}>Cargando {type}s...</div>}
          {isError && <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>Error cargando {type}s</div>}

          <CardsFeed
            items={mappedPosts}
            onCardClick={handleCardClick}
          />

          {/* El último card activa el scroll */}
          {mappedPosts.length > 0 && (
            <div ref={lastCardRef} style={{ height: "1px" }} />
          )}

          {isFetchingNextPage && (
            <div style={{ textAlign: "center", padding: "1rem" }}>
              Cargando más {type}s...
            </div>
          )}

          {!hasNextPage && mappedPosts.length > 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
              {noMoreText}
            </div>
          )}
        </div>
      </main>
    </PagesTemplate>

  );
}

export default PostsFeedPage;