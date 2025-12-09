import React, { useState, useEffect } from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { CardsFeed } from "@/components/UI/Cards";
import * as classes from "./MyPosts.module.css";
import { useNavigate } from "react-router-dom";
import FilterBar from "@/components/UI/FilterBar";
import { usePostsApi } from "@/hooks/usePostsApi";
import { useToast } from "@/components/UI/Toast";
import { useQueryClient } from "@tanstack/react-query";


function MyPosts() {
  const navigate = useNavigate();
  const [keywordSearchTerm, setKeywordSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { useInfinitePosts } = usePostsApi();
  const { showToast } = useToast();

  const handleCardClick = (post) => {
    navigate(`/mi-publicacion-ampliada/${post.id}`, { state: post });
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["posts", "infinite"] });
    };
  }, []);

  const filters = {
    user_id: localStorage.getItem('userId'),
    category: selectedCategory || undefined,
    city: locationSearchTerm,
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
  
  // Aplanar todas las páginas
    const allPosts = data?.pages.flatMap(page => page.posts) || [];
  
    // Observer para el último card
    const observer = React.useRef();
    const lastCardRef = React.useCallback(
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
  
  
    const mappedMyPosts = allPosts.map(post => ({
      id: post.id,
      userId: post.user_id,
      title: post.title,
      description: post.message,
      imageUrl: post.multimedia?.[0]?.url || "https://placehold.co/600x400",
      location: post.city_name || "Sin ubicación",
      publishedAt: post.created_at,
      type: post.post_type_id === 1 ? "propuesta" : "oferta",
      category: post.category,
      likes: post.likes_count || 0,
    }));

    useEffect(() => {
        if (isError) {
          showToast("Error al cargar las ofertas", { type: "error" });
        }
    }, [isError, error, showToast]);

  

  return (
    <PagesTemplate>
      <main className={classes.page}>
        <h2 className={classes.title}>Mis Publicaciones</h2>
        <FilterBar
        onCategoryChange={setSelectedCategory}
        onLocationChange={setLocationSearchTerm}
        onKeywordChange={setKeywordSearchTerm}
        selectedCategory={selectedCategory}
        keywordSearchTerm={keywordSearchTerm}
        locationSearchTerm={locationSearchTerm}
        />
        <div className={classes.feedWrap}>
          {isPending && <p>Cargando propuestas...</p>}
          {isError && <p>Error cargando propuestas</p>}
          <CardsFeed
            items={mappedMyPosts}
            onCardClick={handleCardClick}
          />
          {/* El último card activa el scroll */}
          {mappedMyPosts.length > 0 && (
            <div ref={lastCardRef} style={{ height: "1px" }} />
          )}

          {isFetchingNextPage && <p>Cargando más ofertas...</p>}
          {!hasNextPage && mappedMyPosts.length > 0 && (
            <p style={{ textAlign: "center", color: "#666" }}>
              No hay más propuestas
            </p>
          )}
        </div>
      </main>
    </PagesTemplate>
  );
}

export default MyPosts;