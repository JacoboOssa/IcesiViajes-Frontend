import React from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import LoginPage from "./pages/LoginPage.jsx";
import Plan from "./pages/Plan.jsx";
import DetailPlan from "./pages/DetailPlan.jsx";
import CrearPlan from "./pages/CrearPlan.jsx";
import TablePlanes from "./pages/TablePlanes.jsx";
import TableClientes from "./pages/TableClientes.jsx";
import TableUsuarios from "./pages/TableUsuarios.jsx"
import CrearCliente from "./pages/CrearCliente.jsx";
import CrearUsuario from "./pages/CrearUsuario.jsx";
import ActualizarCliente from "./pages/ActualizarCliente.jsx"
import ActualizrUsuario from "./pages/ActualizarUsuario.jsx"
import ActualizarPlanes from "./pages/ActualizarPlanes.jsx"
import Reporte from "./pages/Reporte.jsx"
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./protectedRoute/ProtectedRoute.jsx";
import { useEffect, useState } from 'react';
import Home from './pages/Home.jsx'


function App(){
  const [authenticated, setAuthenticated] = useState(false);


  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      
      setAuthenticated(true);
    }

  }, []);

    return(
      <ChakraProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            {/*Ruta para Login*/}
            <Route path ='/' element={<LoginPage />}/>
            
            {/*{!authenticated && (<Route path="/" element={<LoginPage />}/>
            )}*/}
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="/planes" element={<ProtectedRoute> <Plan /> </ProtectedRoute>} />
            <Route path="/plan/:planId" element={<ProtectedRoute> <DetailPlan /> </ProtectedRoute> } />
            <Route path="/adminplanes" element={<ProtectedRoute> <TablePlanes /> </ProtectedRoute> } />
            <Route path="/crearplanes" element={<ProtectedRoute> <CrearPlan /> </ProtectedRoute> } />
            <Route path="/adminclientes" element={<ProtectedRoute> <TableClientes /> </ProtectedRoute> } />
            <Route path="/adminusuarios" element={<ProtectedRoute> <TableUsuarios /> </ProtectedRoute> } />
            <Route path="/crearcliente" element={<ProtectedRoute> <CrearCliente /> </ProtectedRoute> } />
            <Route path="/crearusuario" element={<ProtectedRoute> <CrearUsuario /> </ProtectedRoute> } />
            <Route path="/actualizarcliente/:idClie" element={<ProtectedRoute> <ActualizarCliente /> </ProtectedRoute> } />
            <Route path="/actualizarusuario/:idUsua" element={<ProtectedRoute> <ActualizrUsuario /> </ProtectedRoute> } />
            <Route path="/actualizarplan/:idPlan" element={<ProtectedRoute> <ActualizarPlanes /> </ProtectedRoute> } />
            <Route path="/reporte" element={<ProtectedRoute> <Reporte /> </ProtectedRoute> } />
            <Route path="/home" element={<ProtectedRoute> <Home/> </ProtectedRoute>}/>


          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ChakraProvider>
    
    )
}

export default App;