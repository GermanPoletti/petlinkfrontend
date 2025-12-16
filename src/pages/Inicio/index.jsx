import { useEffect, useMemo } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { FeedCard } from "@/components/UI/Cards";
import PagesTemplate from "@/components/UI/PagesTemplate";
import badgeCat from "@/assets/images/badge-Cat.png";
import registerDog from "@/assets/images/register-Dog.png";
import styles from "./Inicio.module.css";
import ContributionPanel from "@/components/UI/Community/ContributionPanel";
import DonatorPanel from "@/components/UI/Community/DonatorPanel";
import { usePostsApi } from "../../hooks/usePostsApi";
import { useUsersApi } from "../../hooks/useUsersApi"
const Inicio = () => {
  const navigate = useNavigate();
  const { useGetMe } = useUsersApi()
  const { useGetPosts } = usePostsApi()
  const {
    data: ultimaOfert,
    isLoading: cargandoOferta,
    isError: isErrorOferta,
    error: errorOferta,
  } = useGetPosts({limit: 1, post_type_id: 1})
  const { role } = useUser();
  
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
    error: userError,
  } = useGetMe()
  
  const {
    data: ultimaNecesida,
    isLoading: cargandoNecesidad,
    isError: isErrorNecesidad,
    error: errorNecesidad,
  } = useGetPosts({limit: 1, post_type_id: 2})
  
  const loading = cargandoNecesidad || cargandoOferta
  const error = errorOferta || errorNecesidad

   const handleOpenMenu = () => {
     console.log("Abrir menú desplegable");
   };



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
            <h3 className={styles.cardTitle}>Última Necesidad:</h3>
            {ultimaNecesida?.posts?.length > 0 ? (
              <Link
                to={`/propuesta-ampliada/${ultimaNecesida.posts[0].id}`}
                state={ultimaNecesida.posts[0]}
                className={styles.cardLink}
              >
                <FeedCard
                  title={ultimaNecesida.posts[0].title}
                  username={ultimaNecesida.posts[0].username}
                  description={ultimaNecesida.posts[0].message}
                  imageUrl={ultimaNecesida.posts[0].multimedia[0]?.url}
                  location={ultimaNecesida.posts[0].city_name}
                  publishedAt={ultimaNecesida.posts[0].created_at}
                />
              </Link>
            ) : (
              <p>No hay propuestas disponibles</p>
            )}


            <h3 className={styles.cardTitle}>Última Oferta:</h3>
            {ultimaOfert?.posts?.length > 0 ? (
              <Link
                to={`/oferta-ampliada/${ultimaOfert.posts[0].id}`}
                state={ultimaOfert.posts[0]}
                className={styles.cardLink}
              >
                <FeedCard
                  title={ultimaOfert.posts[0].title}
                  username={ultimaOfert.posts[0].username}
                  description={ultimaOfert.posts[0].message}
                  imageUrl={ultimaOfert.posts[0].multimedia[0]?.url}
                  location={ultimaOfert.posts[0].city_name}
                  publishedAt={ultimaOfert.posts[0].created_at}
                />
              </Link>
            ) : (
              <p>No hay ofertas disponibles</p>
            )}

          </div>
      )}
        </section>

        <aside className={styles.sidebar}>
          <ContributionPanel contributionsCount={userData?.help_count} imageUrl={registerDog} />
          <DonatorPanel donorsTotal={200} imageUrl={badgeCat} />
        </aside>
      </main>
    </PagesTemplate>
  );
};

export default Inicio;