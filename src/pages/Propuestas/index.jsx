import React, { useState, useEffect } from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { CardsFeed } from "@/components/UI/Cards";
import { useNavigate } from "react-router-dom";
import * as classes from "./Propuestas.module.css";
import FilterBar from "@/components/UI/FilterBar";


function Propuestas() {
  const navigate = useNavigate();
  const [keywordSearchTerm, setKeywordSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [proposals, setProposals] = useState([]);

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
    const fetchProposals = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10&_start=10');
        const data = await response.json();
        const categories = ["Veterinaria", "Tránsito", "Alimentos/Donación", "Paseos"];
        const locations = ["Palermo", "Belgrano", "Caballito", "Recoleta", "Villa Crespo", "Nuñez", "Flores", "Almagro"];

        const mappedProposals = data.map(post => ({
          id: `propuesta-${post.id}`,
          title: post.title,
          description: post.body,
          imageUrl: `https://picsum.photos/200/300?random=${post.id}`,
          location: locations[Math.floor(Math.random() * locations.length)],
          publishedAt: new Date().toISOString(),
          type: "propuesta",
          category: categories[Math.floor(Math.random() * categories.length)],
        }));
        setProposals(mappedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, []);

  const filteredPropuestas = proposals.filter((propuesta) => {
    const matchesKeyword =
      keywordSearchTerm === "" ||
      propuesta.title.toLowerCase().includes(keywordSearchTerm.toLowerCase()) ||
      propuesta.description.toLowerCase().includes(keywordSearchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || propuesta.category === selectedCategory;

    const matchesLocation =
      locationSearchTerm === "" ||
      (propuesta.location &&
        propuesta.location.toLowerCase().includes(locationSearchTerm.toLowerCase()));

    return matchesKeyword && matchesCategory && matchesLocation;
  });

  return (
    <PagesTemplate onNewPostClick={() => {}}>
      <main className={classes.page}>
        <h2 className={classes.title}>Propuestas</h2>
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
            items={filteredPropuestas}
            onCardClick={(item) => navigate(`/propuesta-ampliada/${item.id}`, { state: item })}
          />
        </div>
      </main>
    </PagesTemplate>
  );
}

export default Propuestas;