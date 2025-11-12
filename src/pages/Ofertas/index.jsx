import React, { useState } from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { CardsFeed } from "@/components/UI/Cards";
import { useNavigate } from "react-router-dom";
import * as classes from "./Ofertas.module.css";
import { ofertasData } from '@/data/data';

const mockItems = ofertasData;

function Ofertas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOfertas = ofertasData.filter(
    (oferta) =>
      oferta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oferta.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PagesTemplate onNewPostClick={() => {}}>
      <main className={classes.page}>
        <h2 className={classes.title}>Ofertas</h2>
        <input
          type="text"
          placeholder="Buscar ofertas..."
          className={classes.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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