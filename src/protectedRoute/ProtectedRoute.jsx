import React from 'react';
import {Navigate} from 'react-router-dom';

// Contexto de autenticación
import {useAuthContext} from "../context/AuthContext.jsx";

// Componente de ruta protegida
const ProtectedRoute = ({children}) => {
    const {authData} = useAuthContext()

    return authData ? children : <Navigate to={"/"}/>
};

export default ProtectedRoute;