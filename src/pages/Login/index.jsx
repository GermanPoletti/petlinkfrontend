import React from 'react';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import { BtnPrimary } from "@/components/UI/Buttons/BtnPrimary";
import styles from './Login.module.css';
import loginCat from '@/assets/images/login-Cat.png';

function Login() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.panel}>

        <h1 className={styles.title}>Iniciar Sesión</h1>

        {/* Campo de Email con overlay del gato sobre el input */}
        <div className={styles.field}>
          <div className={`${styles.imageWrapper} ${styles.catWrapper}`}>
            <img src={loginCat} alt="Gato" className={styles.catImage} />
          </div>
          <input type="email" placeholder="Email" className={styles.input} />
        </div>
        <input type="password" placeholder="Password" className={styles.input} />

        <BtnPrimary
          className={styles.loginButton}
          text="Iniciar Sesión"
          onClick={() => navigate('/inicio')}
        />

        <div className={styles.links}>
          <div className={styles.linkLine}>
            <span className={styles.linkText}>¿No tienes una cuenta?</span>{' '}
            <span
              className={styles.link}
              onClick={() => navigate('/register')}
            >
              Nueva Cuenta
            </span>
          </div>

          <div className={styles.linkLine}>
            <span
              className={styles.link}
              onClick={() => navigate('/forgot')}
            >
              ¿Olvidaste tu Contraseña?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;