import React, { useState, useEffect } from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { CardsFeed } from "@/components/UI/Cards";
import { useNavigate } from "react-router-dom";
import * as classes from "./Ofertas.module.css";
import FilterBar from "@/components/UI/FilterBar";


function Ofertas() {
  const navigate = useNavigate();
  const [keywordSearchTerm, setKeywordSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
        const data = await response.json();
        const categories = ["Veterinaria", "Tránsito", "Alimentos/Donación", "Paseos"];
        const locations = ["Palermo", "Belgrano", "Caballito", "Recoleta", "Villa Crespo", "Nuñez", "Flores", "Almagro"];

        const mappedOffers = data.map(post => ({
          id: `oferta-${post.id}`,
          title: post.title,
          description: post.body,
          imageUrl: `https://picsum.photos/200/300?random=${post.id}`, // Dynamic placeholder image from picsum.photos
          location: locations[Math.floor(Math.random() * locations.length)],
          publishedAt: new Date().toISOString(), // Current date
          type: "oferta",
          category: categories[Math.floor(Math.random() * categories.length)],
        }));
        setOffers(mappedOffers);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleLocationChange = (location) => {
    setLocationSearchTerm(location);
  };

  const handleKeywordChange = (keyword) => {
    setKeywordSearchTerm(keyword);
  };

  const filteredOfertas = offers.filter((oferta) => {
    const matchesKeyword =
      keywordSearchTerm === "" ||
      oferta.title.toLowerCase().includes(keywordSearchTerm.toLowerCase()) ||
      oferta.description.toLowerCase().includes(keywordSearchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || oferta.category === selectedCategory;

    const matchesLocation =
      locationSearchTerm === "" ||
      (oferta.location &&
        oferta.location.toLowerCase().includes(locationSearchTerm.toLowerCase()));

    return matchesKeyword && matchesCategory && matchesLocation;
  });

  return (
    <PagesTemplate onNewPostClick={() => {}}>
      <main className={classes.page}>
        <h2 className={classes.title}>Ofertas</h2>
        <FilterBar
          onCategoryChange={handleCategoryChange}
          onLocationChange={handleLocationChange}
          onKeywordChange={handleKeywordChange}
          selectedCategory={selectedCategory}
          keywordSearchTerm={keywordSearchTerm}
          locationSearchTerm={locationSearchTerm}
        />
        <div className={classes.feedWrap}>
          <CardsFeed
            items={filteredOfertas}
            onCardClick={(item) => navigate(`/oferta-ampliada/${item.id}`, { state: item })}
          />
        </div>
      </main>
    </PagesTemplate>
  );
}

export default Ofertas;