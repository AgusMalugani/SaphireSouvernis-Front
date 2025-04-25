import React, { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/Auth/AuthContext';
import {jwtDecode} from 'jwt-decode';

function ProtectedRoute({ children, requiredRole }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to={"/"}/>;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Verificar si el token tiene el rol requerido
    if (requiredRole && decodedToken.roles !== requiredRole) {
      return <Navigate to={"/"}/>;
    }
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return <Navigate to={"/"}/>;
  }

  // Si pasa todas las verificaciones, renderizar el contenido protegido
  return children;
}

export default ProtectedRoute;