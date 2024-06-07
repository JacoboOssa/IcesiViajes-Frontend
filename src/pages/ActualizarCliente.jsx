import React, { useState, useEffect } from 'react';
import axios from 'axios';
import instance from "../axios.js";
import Sidebar from '../components/SideBar';
import { jwtDecode } from "jwt-decode";
import { Box, useColorModeValue, FormControl, FormLabel, Input, Select, Button, Flex, Text,Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';


export default function ActualizarCliente() {
  const [identificacion, setIdentificacion] = useState("");
  const [selectedTipoId, setSelectTipoId] = useState();
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono1, setTelefono1] = useState("");
  const [telefono2, setTelefono2] = useState("");
  const [correo, setCorreo] = useState("");
  const [sexo, setSexo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [tipoId, setTipoId] = useState([]);
  const { idClie } = useParams(); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    const name = decoded.sub;
    setUser(name);
    const role = decoded.Rol[0].authority;
    setRole(role);
  }
}, []);

  useEffect(() => {
    const fetchCliente = async () => {
        try {
            const response = await axios.get(instance.getUri() + "/cliente/consultarid/" + idClie);
            const cliente = response.data;
            setIdentificacion(cliente.numeroIdentificacion);
            setPrimerApellido(cliente.primerApellido);
            setSegundoApellido(cliente.segundoApellido);
            setNombre(cliente.nombre);
            setTelefono1(cliente.telefono1);
            setTelefono2(cliente.telefono2);
            setCorreo(cliente.correo);
            setSexo(cliente.sexo);
            setFechaNacimiento(formatDate(cliente.fechaNacimiento));
            setSelectTipoId(cliente.idTiid);
        } catch (error) {
            console.error("Error fetching cliente:", error);
        }
    };
    fetchCliente();
}, [idClie]);

  useEffect(() => {
    const fetchTipoId = async () => {
        try {
            const response = await axios.get(instance.getUri() + "/tipoidentificacion/consultar");
            setTipoId(response.data);
        } catch (error) {
            console.error("Error fetching tipo Identifcacion:", error);
        }
    };
    fetchTipoId();
  }, []);


  const handleUpdateCliente = async () => {
    const updatedClient = {
      idClie: idClie,
      numeroIdentificacion: identificacion,
      primerApellido: primerApellido,
      segundoApellido: segundoApellido,
      nombre: nombre,
      telefono1: telefono1,
      telefono2: telefono2,
      correo: correo,
      sexo: sexo,
      fechaNacimiento: fechaNacimiento,
      fechaModificacion: new Date(),
      fechaCreacion: new Date(),
      usuCreador: user, 
      usuModificador: user,
      estado: "A",
      idTiid: selectedTipoId
    };

    try {
      await axios.post(instance.getUri() + "/cliente/actualizar", updatedClient);
      setSuccessMessage("Usuario actualizado correctamente");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating Cliente:", error);
      setSuccessMessage("");
      setErrorMessage("Error al actualizar el usuario")
    }
  };

  return (
    <>        
      <Box display={"flex"} shadow={useColorModeValue('rgba(0, 0, 0, 0.25)')}>
        <Sidebar roleName={role} username={user} />
        <Box flex="1" p={4}>
          <Box maxW="900px" mx="auto" p={4} mt={8} >
            <Text fontSize="2xl" fontWeight="bold" mb={6} mt={-10}>Editar Cliente</Text>
            {successMessage && (
              <Alert status='success' mb={4}>
                <AlertIcon />
                <Box flex='1'>
                  <AlertTitle>Usuario guardado</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Box>
                <CloseButton position='absolute' right='8px' top='8px' onClick={() => setSuccessMessage('')} />
              </Alert>
            )}
            {errorMessage && (
              <Alert status='error' mb={4}>
                <AlertIcon />
                <Box flex='1'>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Box>
                <CloseButton position='absolute' right='8px' top='8px' onClick={() => setErrorMessage('')} />
              </Alert>
            )}
              <FormControl id="nombre" mb={2}>
                <FormLabel fontSize="sm">Nombre</FormLabel>
                <Input size="sm" type="text" name="nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} />
              </FormControl>

              <Flex mb={2}>
                <FormControl id="primerApellido" mr={2}>
                  <FormLabel fontSize="sm">Primer Apellido</FormLabel>
                  <Input size="sm" type="text" name="primerApellido" value={primerApellido} onChange={(e)=>setPrimerApellido(e.target.value)} />
                </FormControl>
                <FormControl id="segundoApellido" ml={2}>
                  <FormLabel fontSize="sm">Segundo Apellido</FormLabel>
                  <Input size="sm" type="text" name="segundoApellido" value={segundoApellido} onChange={(e)=>setSegundoApellido(e.target.value)} />
                </FormControl>
              </Flex>

              <Flex mb={2}>
                <FormControl id="telefono1" mr={2}>
                  <FormLabel fontSize="sm">Teléfono 1</FormLabel>
                  <Input size="sm" type="tel" name="telefono1" value={telefono1} onChange={(e)=>setTelefono1(e.target.value)} />
                </FormControl>
                <FormControl id="telefono2" ml={2}>
                  <FormLabel fontSize="sm">Teléfono 2</FormLabel>
                  <Input size="sm" type="tel" name="telefono2" value={telefono2} onChange={(e)=>setTelefono2(e.target.value)} />
                </FormControl>
              </Flex>

              <FormControl id="correo" mb={2}>
                <FormLabel fontSize="sm">Correo Electrónico</FormLabel>
                <Input size="sm" type="email" name="correo" value={correo} onChange={(e)=>setCorreo(e.target.value)} />
              </FormControl>

              <Flex mb={2}>
                <FormControl id="fechaNacimiento" mr={2}>
                  <FormLabel fontSize="sm">Fecha de Nacimiento</FormLabel>
                  <Input size="sm" type="date" name="fechaNacimiento" value={fechaNacimiento} onChange={(e)=>setFechaNacimiento(e.target.value)} />
                </FormControl>
                <FormControl id="sexo" ml={2}>
                  <FormLabel fontSize="sm">Género</FormLabel>
                  <Select size="sm" placeholder="Seleccione un género" name="sexo" value={sexo} onChange={(e)=>setSexo(e.target.value)}>
                    <option value="M">Hombre</option>
                    <option value="F">Mujer</option>
                    <option value="N">No binario</option>
                  </Select>
                </FormControl>
              </Flex>

              <FormControl id="tipoIdentificacion" mb={2}>
                <FormLabel fontSize="sm">Tipo de Identificación</FormLabel>
                <Select size="sm" placeholder="Seleccione un Tipo de Identificación" name="tipoIdentificacion" value={selectedTipoId} onChange={(e)=>setSelectTipoId(e.target.value)}>
                  {tipoId.map((tipoId) => (
                        <option key={tipoId.idTiid} value={tipoId.idTiid}>{tipoId.nombre}</option>
                  ))}
                  {/* <option value="CEDULA CIUDADANIA">CÉDULA DE CIUDADANÍA</option> */}
                  {/* <option value="TARJETA DE IDENTIDAD">TARJETA DE IDENTIDAD</option> */}
                  {/* <option value="CEDULA EXTRANJERA">CÉDULA EXTRANJERA</option> */}
                  {/* <option value="PASAPORTE">PASAPORTE</option> */}
                  {/* <option value="REGISTRO CIVIL">REGISTRO CIVIL</option> */}
                </Select>
              </FormControl>

              <FormControl id="identificacion" mb={2}>
                <FormLabel fontSize="sm">Número de Identificación</FormLabel>
                <Input size="sm" type="text" name="identificacion" value={identificacion} onChange={(e)=>setIdentificacion(e.target.value)} />
              </FormControl>

              <Flex justify="flex-end" mt={4}>
                <Button type="submit" colorScheme="blue" size="sm" onClick={handleUpdateCliente}>Actualizar Cliente</Button>
              </Flex>
          </Box>
        </Box>
      </Box>
    </>
  );
}
