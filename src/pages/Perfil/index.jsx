import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnPrimary } from "@/components/UI/Buttons/BtnPrimary";
import PagesTemplate from "@/components/UI/PagesTemplate";
import styles from './Perfil.module.css';
import { useUsersApi } from '@/hooks/useUsersApi';

function Perfil() {
  const navigate = useNavigate();
  const { useGetMe } = useUsersApi();

  const { data, isLoading, isError } = useGetMe();

  useEffect(() => {
    if (isError) {
      console.error("Error cargando perfil");
    }
  }, [isError]);

  const handleEditProfile = () => {
    navigate('/editar-perfil');
  };

  if (isLoading) return <PagesTemplate><div>Cargando perfil...</div></PagesTemplate>;
  if (isError) return <PagesTemplate><div>Error al cargar perfil</div></PagesTemplate>;

  return (
    <PagesTemplate>
      <div className={styles.container}>
        <div className={styles.panel}>
          <h1 className={styles.title}>Mi Perfil</h1>

          <div className={styles.dataItem}>
            <div className={styles.dataLabel}>Email</div>
            <div className={styles.dataValue}>{data?.email || "No definido"}</div>
          </div>

          <div className={styles.dataItem}>
            <div className={styles.dataLabel}>Nombres</div>
            <div className={styles.dataValue}>{data?.user_info?.first_name || "No definido"}</div>
          </div>

          <div className={styles.dataItem}>
            <div className={styles.dataLabel}>Apellidos</div>
            <div className={styles.dataValue}>{data?.user_info?.last_name || "No definido"}</div>
          </div>

          <div className={styles.dataItem}>
            <div className={styles.dataLabel}>Username</div>
            <div className={styles.dataValue}>@{data?.user_info?.username || "sin username"}</div>
          </div>

          <BtnPrimary
            text="Editar Perfil"
            className={styles.editButton}
            onClick={handleEditProfile}
          />
        </div>
      </div>
    </PagesTemplate>
  );
}

export default Perfil;