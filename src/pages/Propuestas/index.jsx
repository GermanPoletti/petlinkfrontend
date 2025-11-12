import React, { useState } from "react";
import PagesTemplate from "@/components/UI/PagesTemplate";
import { CardsFeed } from "@/components/UI/Cards";
import { useNavigate } from "react-router-dom";
import * as classes from "./Propuestas.module.css";
import { propuestasData } from '@/data/data';

const mockItems = propuestasData;

function Propuestas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPropuestas = propuestasData.filter(
    (propuesta) =>
      propuesta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propuesta.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PagesTemplate onNewPostClick={() => {}}>
      <main className={classes.page}>
        <h2 className={classes.title}>Propuestas</h2>
        <input
          type="text"
          placeholder="Buscar propuestas..."
          className={classes.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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