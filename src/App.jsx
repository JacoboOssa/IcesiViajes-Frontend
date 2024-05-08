import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./protectedRoute/ProtectedRoute.jsx";
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import Home from './pages/Home.jsx'


function App(){
  const [authenticated, setAuthenticated] = useState(false);
  const [role,setRole] = useState('')
  const [user,setUser] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      
      const decoded = jwtDecode(token);
      //console.log(decoded)

      const name = decoded.sub
      setUser(name)
      const role = decoded.Rol[0].authority
      setRole(role)
      //console.log(decoded)
      //console.log(role)
      
      // Si el token es válido, actualiza el estado de autenticación
      console.log(authenticated)
      setAuthenticated(true);
      //console.log(authenticated)
    }
  }, []);

    return(
      <ChakraProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            {/*Ruta para Login*/}
            <Route path ='/' element={<LoginPage />}/>

            {authenticated && (
              <Route
                path="/home"
                element={
                  
                    <Home roleName={role} username={user} />
                  
                }
              />
            )}  
          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ChakraProvider>
    
    )
}

export default App;