import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnPrimary } from "@/components/UI/Buttons/BtnPrimary";
import styles from './Register.module.css';
import registerDog from '@/assets/images/register-Dog.png';
import { useToast } from '@/components/UI/Toast';
import { useAuthApi } from "@/hooks/useAuthApi";

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {registerUser} = useAuthApi()
  const isSubmitting = registerUser.isPending;

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPassword = (value) => typeof value === 'string' && value.length >= 8;

  const onRegister = (e) => {
    e.preventDefault();

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

    registerUser.mutate({email, password},
      {
        onSuccess: () => {
          showToast("¡Registro exitoso! ¡Logueate para usar nuestro servicios!", { type: "success" })
          navigate("/")
        },
        onError: (error) => {
          const msg = error.response?.data?.detail || "Error al registrarse";
          if (error.response?.status === 409 || msg.includes("already exists")) {
            showToast("Este email ya está registrado", { type: "error" });
          } else {
          showToast(msg, { type: "error" });
        }
      } 
    }
    )

//   try {
//   setLoading(true);
//   const data =  registerUser({ email, password });

//   localStorage.setItem('authToken', data.token);
//   localStorage.setItem('user', JSON.stringify(data.user || { email, role: 'user' }));

//   showToast('¡Registro exitoso! Bienvenido a PetLink', { type: 'success' });
//   navigate('/inicio');

// } catch (err) {
//   const msg = err.response?.data?.message || 'Error al registrarse';
//   if (err.response?.status === 409) {
//     showToast('Este email ya está registrado', { type: 'error' });
//   } else {
//     showToast(msg, { type: 'error' });
//   }
// } finally {
//   setLoading(false);
// }
  };
  {
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
            disabled = {isSubmitting}
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
};

export default Register;