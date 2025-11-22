import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BtnLink } from "@/components/UI/Buttons/BtnLink";
import { FeedCard } from "@/components/UI/Cards";
import PagesTemplate from "@/components/UI/PagesTemplate";
import badgeCat from "@/assets/images/badge-Cat.png";
import registerDog from "@/assets/images/register-Dog.png";
import styles from "./Inicio.module.css";
import ContributionPanel from "@/components/UI/Community/ContributionPanel";
import DonatorPanel from "@/components/UI/Community/DonatorPanel";


const Inicio = () => {
  const navigate = useNavigate();

  const userData = {
    profilePic: "https://url-de-la-foto-del-usuario.com/" /*mock por el momento*/
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const transformedPosts = response.data.map((post, index) => ({
          id: String(post.id),
          title: post.title,
          description: post.body,
          imageUrl: `https://picsum.photos/seed/${post.id}/400/300`, // Imagen aleatoria
          location: `Ciudad ${post.userId}`, // Ubicación mock
          publishedAt: new Date(Date.now() - index * 86400000).toISOString(), // Fecha mock descendente
          type: index % 2 === 0 ? "oferta" : "propuesta", // Alternar tipo
          category: index % 3 === 0 ? "Veterinaria" : "Tránsito", // Categoría mock
        }));
        setPosts(transformedPosts);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleOpenMenu = () => {
    console.log("Abrir menú desplegable");
  };

  const sortedPropuestas = posts
    .filter((post) => post.type === "propuesta")
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const latestPropuesta = sortedPropuestas[0];
  // console.log(
  //   "Latest Propuesta ID:",
  //   latestPropuesta?.id,
  //   "Published At:",
  //   latestPropuesta?.publishedAt
  // );

  const sortedOfertas = posts
    .filter((post) => post.type === "oferta")
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const latestOferta = sortedOfertas[0];
  // console.log(
  //   "Latest Oferta ID:",
  //   latestOferta?.id,
  //   "Published At:",
  //   latestOferta?.publishedAt
  // );

  return (
    <PagesTemplate
      onProfileClick={handleOpenMenu}
      onNewPostClick={(tipo) => navigate(tipo === 'propuesta' ? '/crear-propuesta' : '/crear-oferta')}
    >
      <main className={styles.contentGrid}>
        <section className={styles.feedSection}>

      {loading && <p>Cargando posts...</p>}
      {error && <p>Error al cargar los posts: {error.message}</p>}
      {!loading && !error && (
          <div className={styles.cardsList}>
            <h3 className={styles.cardTitle}>Última Propuesta:</h3>
            {latestPropuesta && (
              <Link to={`/propuesta-ampliada/${latestPropuesta.id}`} state={latestPropuesta} className={styles.cardLink}>
                <FeedCard
                  title={latestPropuesta.title}
                  description={latestPropuesta.description}
                  imageUrl={latestPropuesta.imageUrl}
                  location={latestPropuesta.location}
                  publishedAt={latestPropuesta.publishedAt}
                />
              </Link>
            )}

            <h3 className={styles.cardTitle}>Última Oferta:</h3>
            {latestOferta && (
              <Link to={`/oferta-ampliada/${latestOferta.id}`} state={latestOferta} className={styles.cardLink}>
                <FeedCard
                  title={latestOferta.title}
                  description={latestOferta.description}
                  imageUrl={latestOferta.imageUrl}
                  location={latestOferta.location}
                  publishedAt={latestOferta.publishedAt}
                />
              </Link>
            )}
          </div>
      )}
        </section>

        <aside className={styles.sidebar}>
          <ContributionPanel contributionsCount={4} imageUrl={registerDog} />
          <DonatorPanel donorsTotal={200} imageUrl={badgeCat} />
        </aside>
      </main>
    </PagesTemplate>
  );
};

export default Inicio;