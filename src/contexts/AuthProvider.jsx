import { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({children})=>{

    const[token,setToken]=useState(localStorage.getItem("token")|| null)

    const saveToken= (newToken)=>{
        setToken(newToken)
        localStorage.setItem("token",newToken)
    }

    const deleteToken = ()=>{
        setToken(null)
        localStorage.removeItem("token")
        alert("Se ha desconectado.")
    }

    const value = {
        saveToken,
        token,
        deleteToken
    }


    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}

