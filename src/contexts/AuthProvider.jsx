import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({children})=>{

    const[token,setToken]=useState(localStorage.getItem("token")|| null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    const saveToken= (newToken)=>{
        setToken(newToken)
        localStorage.setItem("token",newToken)
        setIsAuthenticated(true)
    }

    const deleteToken = ()=>{
        setToken(null)
        localStorage.removeItem("token")
        setIsAuthenticated(false)
        alert("Se ha desconectado.")
    }

    
      
      // Verifica una vez al inicio
  useEffect(() => {
    const checkTokenExpiration = () => {
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < now) {
                deleteToken(); // Token expirado
            } else {
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error("Token inválido", error);
            deleteToken(); // Si hay error, forzamos logout
          }
        }
      };
    checkTokenExpiration();
  }, [token]);

  useEffect(() => {
      const checkTokenExpiration = () => {
          console.log("auth log");
          if (token) {
          try {
            const decoded = jwtDecode(token);
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < now) {
                deleteToken(); // Token expirado
            } else {
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error("Token inválido", error);
            deleteToken(); // Si hay error, forzamos logout
          }
        }
      };

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 20 *60 * 1000); // 20 minutos

    return () => clearInterval(interval); // Limpia el intervalo si se desmonta
  }, [token]);

    const value = {
        saveToken,
        token,
        deleteToken,
        isAuthenticated
    }


    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}

