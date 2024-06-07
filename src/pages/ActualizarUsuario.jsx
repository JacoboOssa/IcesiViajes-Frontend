import React, { useState, useEffect } from 'react';
import axios from 'axios';
import instance from "../axios.js";
import Sidebar from '../components/SideBar';
import {jwtDecode} from "jwt-decode";
import { Box, useColorModeValue, FormControl, FormLabel, Input, Select, Button, Flex, Text,Alert, AlertIcon, CloseButton,FormErrorMessage } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';


export default function CrearUsuario() {
    const [identificacion, setIdentificacion] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [rol, setRol] = useState("");
  
    const [correo, setCorreo] = useState("");
    const [sexo, setSexo] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [user, setUser] = useState("");
    const [tipoId, setTipoId] = useState([]);
    const [selectedTipoId, setSelectedTipoId] = useState("");
    const { idUsua } = useParams(); 
    const roles = {
        1: "Administrador",
        2: "Asesor",
        3: "Invitado"
    };

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
      


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const name = decoded.sub;
      setUser(name);
    }
  }, []);

  
  useEffect(() => {
    const fetchUsuario = async () => {
        try {
            const response = await axios.get(instance.getUri() + "/usuario/consultarid/" + idUsua);
            const usuario = response.data;
            setIdentificacion(usuario.identificacion);
            setLogin(usuario.login);
            setPassword(usuario.password);
            setNombre(usuario.nombre);
            setRol(usuario.id_rol);
        } catch (error) {
            console.error("Error fetching usuario:", error);            
        }
    };
    fetchUsuario();
}, [idUsua]);

  const handleUpdateUsuario = async () => {
    const updatedUsuario = {
      idUsua: idUsua,
      login: login,
      password: password,
      nombre: nombre,
      identificacion: identificacion,
      usuCreador: "darpa", //AGREGAR USUARIO
      estado: "A",
      id_rol: rol,
      fechaModificacion: new Date(),
      fechaCreacion: new Date(),
      usuCreador: user, //PONER USER
      usuModificador: user,
    };

    try {
      await axios.post(instance.getUri() + "/usuario/actualizar", updatedUsuario);
      setSuccessMessage("Usuario actualizado correctamente.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating Usuario:", error);
      setSuccessMessage("");
      setErrorMessage("Error al actualiar usuario.");    }
  };

  return (
    <>
      <Box display={"flex"} shadow={useColorModeValue('rgba(0, 0, 0, 0.25)')}>
        <Sidebar />
        <Box flex="1" p={4}>
          <Box maxW="900px" mx="auto" p={4} mt={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={6} mt={-10}>Editar Usuario</Text>
            {successMessage && (
              <Alert status="success" mb={4}>
                <AlertIcon />
                {successMessage}
                <CloseButton position="absolute" right="8px" top="8px" onClick={() => setSuccessMessage("")} />
              </Alert>
            )}

            {errorMessage && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {errorMessage}
                <CloseButton position="absolute" right="8px" top="8px" onClick={() => setErrorMessage("")} />
              </Alert>
            )}
            <Flex mb={2}>
                
                <FormControl id="identificacion" mr={2}>
                    <FormLabel fontSize="sm">Número de Identificación</FormLabel>
                    <Input size="sm" type="text" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} />
                </FormControl>
                <FormControl id="rol" ml={2}>
                    <FormLabel fontSize="sm">Rol</FormLabel>
                    <Select placeholder="Seleccione un Rol" size="sm" value={rol} onChange={(e) => setRol(e.target.value)}>
                    {Object.keys(roles).map((key) => (
                        <option key={key} value={key}>{roles[key]}</option>
                    ))}
                    </Select>
                </FormControl>
            </Flex>
                        

            <Flex mb={2}>
              <FormControl mr={2}>
                <FormLabel fontSize="sm">Nombre Completo</FormLabel>
                <Input size="sm" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </FormControl>
              <FormControl ml={2}>
                <FormLabel fontSize="sm">Nombre de Usuario</FormLabel>
                <Input size="sm" type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
              </FormControl>
            </Flex>

            <Flex mb={2}>
              <FormControl mr={2}>
                <FormLabel fontSize="sm">Contraseña</FormLabel>
                <Input size="sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <FormControl ml={2}>
                <FormLabel fontSize="sm">Confirmar Contraseña</FormLabel>
                <Input size="sm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </FormControl>
            </Flex>

            <Flex justify="flex-end" mt={4}>
              <Button type="submit" colorScheme="blue" size="sm" onClick={handleUpdateUsuario}>Guardar Usuario</Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  );
}
