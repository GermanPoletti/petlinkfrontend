import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnPrimary } from "@/components/UI/Buttons/BtnPrimary";
import styles from './Register.module.css';
import registerDog from '@/assets/images/register-Dog.png';
import { useToast } from '@/components/UI/Toast';

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPassword = (value) => typeof value === 'string' && value.length >= 8;

  const onRegister = () => {
    if (!isValidEmail(email)) {
      showToast('Email inválido. Usa un correo electrónico válido.', { type: 'error' });
      return;
    }
    if (!isValidPassword(password)) {
      showToast('La contraseña debe tener al menos 8 caracteres.', { type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden.', { type: 'error' });
      return;
    }
    // Simula registro exitoso: guarda usuario/token y navega
    try {
      localStorage.setItem('user', JSON.stringify({ email }));
      localStorage.setItem('authToken', 'dummy-token');
    } catch {}
    showToast('Registro exitoso. ¡Bienvenido!', { type: 'success' });
    navigate('/editar-perfil');
  };

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Registrarse</h1>

        {/* Campo de Email con overlay del perro sobre el input */}
        <div className={styles.field}>
          <div className={`${styles.imageWrapper} ${styles.dogWrapper}`}>
            <img src={registerDog} alt="Perro" className={styles.dogImage} />
          </div>
          <input type="email" placeholder="Email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <input type="password" placeholder="Password (mín. 8 caracteres)" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirmar Password" className={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <BtnPrimary
          text="Registrarse"
          className={styles.registerButton}
          onClick={onRegister}
        />

        <div className={styles.loginPrompt}>
          <span className={styles.linkText}>¿Ya tienes una cuenta?</span>
          <span
            className={styles.link}
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;