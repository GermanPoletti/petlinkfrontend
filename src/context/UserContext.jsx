import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Crea un contexto para el rol
const UserContext = createContext(null);

// Proveedor del contexto que envolverá tu aplicación
export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);  
        setUserId(decodedToken.user_id);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ role, userId }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);
