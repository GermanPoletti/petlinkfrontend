import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnPrimary } from "@/components/UI/Buttons/BtnPrimary";
import { BtnSecondary } from "@/components/UI/Buttons/BtnSecondary";
import styles from './EditarPerfil.module.css';

function EditarPerfil() {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [username, setUsername] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const handleSave = () => {
    // Lógica para guardar los datos del perfil
    console.log({ nombres, apellidos, username, fechaNacimiento });
    // Aquí podrías integrar una llamada a una API para actualizar el perfil
    localStorage.setItem('profile', JSON.stringify({ nombres, apellidos, username, fechaNacimiento }));
    navigate('/perfil'); // Navegar al perfil después de guardar
  };

  const handleSkip = () => {
    navigate('/inicio'); // Navegar al inicio si se omite la edición
  };

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Editar Perfil</h1>

        {/* Campo de Nombres */}
        <div className={styles.field}>
          <input
            type="text"
            placeholder="Nombres"
            className={styles.input}
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
        </div>

        {/* Campo de Apellidos */}
        <div className={styles.field}>
          <input
            type="text"
            placeholder="Apellidos"
            className={styles.input}
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
        </div>

        {/* Campo de Username */}
        <div className={styles.field}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Campo de Fecha de Nacimiento */}
        <div className={styles.field}>
          <input
            type="text"
            placeholder="Fecha de Nacimiento (dd/mm/aaaa)"
            className={styles.input}
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
        </div>

        <BtnSecondary
          text="Omitir"
          className={styles.skipButton}
          onClick={handleSkip}
        />
        <BtnPrimary
          text="Aceptar"
          className={styles.acceptButton}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}

export default EditarPerfil;