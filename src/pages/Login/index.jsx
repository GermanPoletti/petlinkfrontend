import React, { useState } from "react";
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import { BtnPrimary } from "@/components/UI/Buttons/BtnPrimary";
import styles from './Login.module.css';
import loginCat from '@/assets/images/login-Cat.png';
import { useAuthApi } from "@/hooks/useAuthApi";
import { useToast } from "../../components/UI/Toast";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuthApi();
  const { showToast } = useToast()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const isLoading = loginUser.isPending;  
  const isError = loginUser.isError;
  const error = loginUser.error;

  const handleLogin = (e) => {
    e.preventDefault(); 
    
    loginUser.mutate(
    { username: email, password },
    {
      onSuccess: (res) => {
        
        localStorage.setItem("authToken", res.access_token);
        

        navigate("/inicio");
      },
      onError: (err) => {
        
        console.log("ERROR LOGIN:", err);
        showToast(err.response?.data?.detail, {type : "error"});
      },
    }
  );
  };

  return (
    <div className={styles.container}>
      <div className={styles.panel}>

        <h1 className={styles.title}>Iniciar Sesión</h1>

        {/* Campo de Email con overlay del gato sobre el input */}
        <div className={styles.field}>
          <div className={`${styles.imageWrapper} ${styles.catWrapper}`}>
            <img src={loginCat} alt="Gato" className={styles.catImage} />
          </div>

          <input 
          type="email" 
          placeholder="Email" 
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          />

        </div>
        
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <BtnPrimary
          className={styles.loginButton}
          text={isLoading ? "Iniciando..." : "Iniciar Sesión"}
          onClick={handleLogin}
          disabled={isLoading}
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