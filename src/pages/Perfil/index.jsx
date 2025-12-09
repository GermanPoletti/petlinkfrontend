import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnSecondary } from "@/components/UI/Buttons/BtnSecondary";
import PagesTemplate from "@/components/UI/PagesTemplate";
import styles from './Perfil.module.css';
import { useUsersApi } from '@/hooks/useUsersApi'

function Perfil() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [username, setUsername] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const {useGetMe} = useUsersApi()
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetMe()
  
  useEffect(()=>{
    console.log(data);
    
    setEmail(data?.email)
    setNombres(data?.user_info?.first_name)
    setApellidos(data?.user_info?.last_name)
    setUsername(data?.user_info?.username)
  },[data]) 

  const handleEditProfile = () => {
    navigate('/editar-perfil');
  };


  return (
    <PagesTemplate>
      <div className={styles.container}>
        <div className={styles.panel}>
          <h1 className={styles.title}>Mi Perfil</h1>

          <div className={styles.field}>
            <p className={styles.dataText}><strong>Email:</strong> {email}</p>
          </div>

          <div className={styles.field}>
            <p className={styles.dataText}><strong>Nombres:</strong> {nombres}</p>
          </div>

          <div className={styles.field}>
            <p className={styles.dataText}><strong>Apellidos:</strong> {apellidos}</p>
          </div>

          <div className={styles.field}>
            <p className={styles.dataText}><strong>Username:</strong> {username}</p>
          </div>

          <div className={styles.field}>
            <p className={styles.dataText}><strong>Fecha de Nacimiento:</strong> {fechaNacimiento}</p>
          </div>

          <BtnSecondary
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