import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Crea un contexto para el rol
const UserContext = createContext(null);

// Proveedor del contexto que envolverá tu aplicación
export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Obtén el token desde localStorage o sessionStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);  // Extrae el rol del token y guárdalo en el estado
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ role }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);
