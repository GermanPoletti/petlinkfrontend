import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnPrimary } from "@/components/UI/Buttons/BtnPrimary";
import { BtnSecondary } from "@/components/UI/Buttons/BtnSecondary";
import styles from './EditarPerfil.module.css';
import { useToast } from '@/components/UI/Toast';
import { useUsersApi } from '@/hooks/useUsersApi'
function EditarPerfil() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [username, setUsername] = useState('');
  const { patchMe } = useUsersApi()
  const [nameIsChecked, setNameIsChecked] = useState(false);
  const [lastNameIsChecked, setLastNameIsChecked] = useState(false);
  const [usernameIsChecked, setUsernameIsChecked] = useState(false);

  const handleSave = () => {
    
    const data = {}


    //TODO: estilizar checkbox para eliminar los datos
    if (nombres) {data.first_name = nombres} else if(nameIsChecked){data.first_name = null};
    if (apellidos) {data.last_name = apellidos} else if(lastNameIsChecked){data.last_name = null}
    if (username) {data.username = username} else if(usernameIsChecked){data.username = null}
    
    patchMe.mutate(data,{
       onSuccess: () => {
         navigate('/perfil')
       },
       onError: (err) => showToast(err, {type: "error"})
     }
     )    

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
          <input type="checkbox" name="borrarNombre" checked={nameIsChecked} onChange={setNameIsChecked} />
          <label for="borrarNombre">Delete</label>
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
          <input type="checkbox" name="borrarApellido"  checked={lastNameIsChecked} onChange={setLastNameIsChecked}/>
          <label for="borrarApellido">Delete</label>
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
          <input type="checkbox" name="borrarUsername" checked={usernameIsChecked} onChange={setUsernameIsChecked}/>
          <label for="borrarApellido">Delete</label>

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