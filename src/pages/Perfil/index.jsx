import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnSecondary } from "@/components/UI/Buttons/BtnSecondary";
import PagesTemplate from "@/components/UI/PagesTemplate";
import styles from './Perfil.module.css';

function Perfil() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [username, setUsername] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const storedEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '';
    const storedProfile = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : {};

    setEmail(storedEmail);
    setNombres(storedProfile.nombres || '');
    setApellidos(storedProfile.apellidos || '');
    setUsername(storedProfile.username || '');
    setFechaNacimiento(storedProfile.fechaNacimiento || '');
  }, []);

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