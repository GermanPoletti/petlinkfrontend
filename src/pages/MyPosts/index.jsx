import React, { useState, useEffect } from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { CardsFeed } from "@/components/UI/Cards";
import * as classes from "./MyPosts.module.css";
import { useNavigate } from "react-router-dom";
import FilterBar from "@/components/UI/FilterBar";

function MyPosts() {
  const navigate = useNavigate();
  const [keywordSearchTerm, setKeywordSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [myPosts, setMyPosts] = useState([]);

  const handleCardClick = (post) => {
    navigate(`/mi-publicacion-ampliada/${post.id}`, { state: post });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleLocationChange = (location) => {
    setLocationSearchTerm(location);
  };

  const handleKeywordChange = (keyword) => {
    setKeywordSearchTerm(keyword);
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10&_start=20');
        const data = await response.json();
        const categories = ["Veterinaria", "Tránsito", "Alimentos/Donación", "Paseos"];
        const locations = ["Palermo", "Belgrano", "Caballito", "Recoleta", "Villa Crespo", "Nuñez", "Flores", "Almagro"];

        const mappedMyPosts = data.map(post => ({
          id: `mypost-${post.id}`,
          title: post.title,
          description: post.body,
          imageUrl: `https://picsum.photos/200/300?random=${post.id}`,
          location: locations[Math.floor(Math.random() * locations.length)],
          publishedAt: new Date().toISOString(),
          type: "mypost",
          category: categories[Math.floor(Math.random() * categories.length)],
        }));
        setMyPosts(mappedMyPosts);
      } catch (error) {
        console.error("Error fetching my posts:", error);
      }
    };

    fetchMyPosts();
  }, []);

  const filteredMyPosts = myPosts.filter((post) => {
    const matchesKeyword =
      keywordSearchTerm === "" ||
      post.title.toLowerCase().includes(keywordSearchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(keywordSearchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || post.category === selectedCategory;

    const matchesLocation =
      locationSearchTerm === "" ||
      (post.location &&
        post.location.toLowerCase().includes(locationSearchTerm.toLowerCase()));

    return matchesKeyword && matchesCategory && matchesLocation;
  });

  return (
    <PagesTemplate>
      <main className={classes.page}>
        <h2 className={classes.title}>Mis Publicaciones</h2>
        <FilterBar
          onCategoryChange={handleCategoryChange}
          onLocationChange={handleLocationChange}
          onKeywordChange={handleKeywordChange}
          selectedCategory={selectedCategory}
          keywordSearchTerm={keywordSearchTerm}
          locationSearchTerm={locationSearchTerm}
        />
        <div className={classes.feedWrap}>
          <CardsFeed items={filteredMyPosts} onCardClick={handleCardClick} />
        </div>
      </main>
    </PagesTemplate>
  );
}

export default MyPosts;