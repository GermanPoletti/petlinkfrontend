import { useMemo } from "react";
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

  const mapPost = (post) => {
    return post?.map(post => ({
      id: post.id,
      userId: post.user_id,
      title: post.title,
      username: post.username,
      description: post.message,
      imageUrl: post.multimedia?.[0]?.url || null,
      location: post.city_name || "Sin ubicación",
      publishedAt: post.created_at,
      type: post.post_type_id === 1 ? "propuesta" : "oferta",
      category: post.category,
      likes: post.likes_count || 0,
    }));
  }
  console.log(ultimaNecesida, ultimaOfert);
  
  const ultimaNecesidad = useMemo(() => mapPost(ultimaNecesida?.posts || []), [ultimaNecesida]);
  const ultimaOferta = useMemo(() => mapPost(ultimaOfert?.posts || []), [ultimaOfert]);

  
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
            {ultimaNecesidad?.length > 0 ? (
              <Link
                to={`/propuesta-ampliada/${ultimaNecesidad[0].id}`}
                state={ultimaNecesidad[0]}
                className={styles.cardLink}
              >
                <FeedCard
                  title={ultimaNecesidad[0].title}
                  username={ultimaNecesidad[0].username}
                  description={ultimaNecesidad[0].description}
                  imageUrl={ultimaNecesidad[0].imageUrl}
                  location={ultimaNecesidad[0].location}
                  publishedAt={ultimaNecesidad[0].publishedAt}
                />
              </Link>
            ) : (
              <p>No hay propuestas disponibles</p>
            )}


            <h3 className={styles.cardTitle}>Última Oferta:</h3>
            {ultimaOferta?.length > 0 ? (
              <Link
                to={`/oferta-ampliada/${ultimaOferta[0].id}`}
                state={ultimaOferta[0]}
                className={styles.cardLink}
              >
                <FeedCard
                  title={ultimaOferta[0].title}
                  username={ultimaOferta[0].username}
                  description={ultimaOferta[0].description}
                  imageUrl={ultimaOferta[0].imageUrl}
                  location={ultimaOferta[0].location}
                  publishedAt={ultimaOferta[0].publishedAt}
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