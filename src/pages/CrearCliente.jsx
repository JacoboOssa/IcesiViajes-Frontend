import React, { useState, useEffect } from 'react';
import axios from 'axios';
import instance from "../axios.js";
import Sidebar from '../components/SideBar';
import { jwtDecode } from "jwt-decode";
import { Box, useColorModeValue, FormControl, FormLabel, Input, Select, Button, Flex, Text, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function CrearCliente() {
  const [user, setUser] = useState("");
  const [tipoId, setTipoId] = useState([]);
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

  const validationSchema = Yup.object({
    identificacion: Yup.string().required('Número de Identificación es obligatorio'),
    selectedTipoId: Yup.string().required('Tipo de Identificación es obligatorio'),
    primerApellido: Yup.string().required('Primer Apellido es obligatorio'),
    segundoApellido: Yup.string().required('Segundo Apellido es obligatorio'),
    nombre: Yup.string().required('Nombre es obligatorio'),
    telefono1: Yup.string().required('Teléfono 1 es obligatorio').min(1,"No se aceptan negativos"),
    telefono2: Yup.string().required('Teléfono 2 es obligatorio').min(1, "No se aceptan negativo"),
    correo: Yup.string().email('Debe ser un correo válido').required('Correo es obligatorio'),
    sexo: Yup.string().required('Género es obligatorio'),
    fechaNacimiento: Yup.date()
      .required('Fecha de Nacimiento es obligatoria')
      .max(new Date(), 'La fecha de nacimiento debe ser anterior a la fecha actual')
  });

  const formik = useFormik({
    initialValues: {
      identificacion: '',
      selectedTipoId: '',
      primerApellido: '',
      segundoApellido: '',
      nombre: '',
      telefono1: '',
      telefono2: '',
      correo: '',
      sexo: '',
      fechaNacimiento: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const newCliente = {
        numeroIdentificacion: values.identificacion,
        primerApellido: values.primerApellido,
        segundoApellido: values.segundoApellido,
        nombre: values.nombre,
        telefono1: values.telefono1,
        telefono2: values.telefono2,
        correo: values.correo,
        sexo: values.sexo,
        fechaNacimiento: values.fechaNacimiento,
        fechaCreacion: new Date(),
        usuCreador: user, // Poner user
        estado: "A",
        idTiid: values.selectedTipoId
      };

      try {
        await axios.post(instance.getUri() + "/cliente/crear", newCliente);
        resetForm();
        setSuccessMessage("Usuario guardado correctamente");
        setErrorMessage("");
      } catch (error) {
        console.error("Error creating Cliente:", error);
        setSuccessMessage("");
        setErrorMessage("Error al guardar el usuario");
      }
    }
  });

  return (
    <>        
      <Box display={"flex"} shadow={useColorModeValue('rgba(0, 0, 0, 0.25)')}>
        <Sidebar />
        <Box flex="1" p={4}>
          <Box maxW="900px" mx="auto" p={4} mt={8} >
            <Text fontSize="2xl" fontWeight="bold" mb={6} mt={-10}>Crear Cliente</Text>
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
            <form onSubmit={formik.handleSubmit}>
              <FormControl id="nombre" mb={2} isInvalid={formik.touched.nombre && formik.errors.nombre}>
                <FormLabel fontSize="sm">Nombre</FormLabel>
                <Input 
                  size="sm" 
                  type="text" 
                  name="nombre" 
                  value={formik.values.nombre} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nombre && formik.errors.nombre && <Text color="red.500" fontSize="sm">{formik.errors.nombre}</Text>}
              </FormControl>

              <Flex mb={2}>
                <FormControl id="primerApellido" mr={2} isInvalid={formik.touched.primerApellido && formik.errors.primerApellido}>
                  <FormLabel fontSize="sm">Primer Apellido</FormLabel>
                  <Input 
                    size="sm" 
                    type="text" 
                    name="primerApellido" 
                    value={formik.values.primerApellido} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.primerApellido && formik.errors.primerApellido && <Text color="red.500" fontSize="sm">{formik.errors.primerApellido}</Text>}
                </FormControl>
                <FormControl id="segundoApellido" ml={2} isInvalid={formik.touched.segundoApellido && formik.errors.segundoApellido}>
                  <FormLabel fontSize="sm">Segundo Apellido</FormLabel>
                  <Input 
                    size="sm" 
                    type="text" 
                    name="segundoApellido" 
                    value={formik.values.segundoApellido} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.segundoApellido && formik.errors.segundoApellido && <Text color="red.500" fontSize="sm">{formik.errors.segundoApellido}</Text>}
                </FormControl>
              </Flex>

              <Flex mb={2}>
                <FormControl id="telefono1" mr={2} isInvalid={formik.touched.telefono1 && formik.errors.telefono1}>
                  <FormLabel fontSize="sm">Teléfono 1</FormLabel>
                  <Input 
                    size="sm" 
                    type="tel" 
                    name="telefono1" 
                    value={formik.values.telefono1} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.telefono1 && formik.errors.telefono1 && <Text color="red.500" fontSize="sm">{formik.errors.telefono1}</Text>}
                </FormControl>
                <FormControl id="telefono2" ml={2} isInvalid={formik.touched.telefono2 && formik.errors.telefono2}>
                  <FormLabel fontSize="sm">Teléfono 2</FormLabel>
                  <Input 
                    size="sm" 
                    type="tel" 
                    name="telefono2" 
                    value={formik.values.telefono2} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.telefono2 && formik.errors.telefono2 && <Text color="red.500" fontSize="sm">{formik.errors.telefono2}</Text>}
                </FormControl>
              </Flex>

              <FormControl id="correo" mb={2} isInvalid={formik.touched.correo && formik.errors.correo}>
                <FormLabel fontSize="sm">Correo Electrónico</FormLabel>
                <Input 
                  size="sm" 
                  type="email" 
                  name="correo" 
                  value={formik.values.correo} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur}
                />
                {formik.touched.correo && formik.errors.correo && <Text color="red.500" fontSize="sm">{formik.errors.correo}</Text>}
              </FormControl>

              <Flex mb={2}>
                <FormControl id="fechaNacimiento" mr={2} isInvalid={formik.touched.fechaNacimiento && formik.errors.fechaNacimiento}>
                  <FormLabel fontSize="sm">Fecha de Nacimiento</FormLabel>
                  <Input 
                    size="sm" 
                    type="date" 
                    name="fechaNacimiento" 
                    value={formik.values.fechaNacimiento} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.fechaNacimiento && formik.errors.fechaNacimiento && <Text color="red.500" fontSize="sm">{formik.errors.fechaNacimiento}</Text>}
                </FormControl>
                <FormControl id="sexo" ml={2} isInvalid={formik.touched.sexo && formik.errors.sexo}>
                  <FormLabel fontSize="sm">Género</FormLabel>
                  <Select 
                    size="sm" 
                    placeholder="Seleccione un género" 
                    name="sexo" 
                    value={formik.values.sexo} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                  >
                    <option value="M">Hombre</option>
                    <option value="F">Mujer</option>
                    <option value="N">No binario</option>
                  </Select>
                  {formik.touched.sexo && formik.errors.sexo && <Text color="red.500" fontSize="sm">{formik.errors.sexo}</Text>}
                </FormControl>
              </Flex>

              <FormControl id="tipoIdentificacion" mb={2} isInvalid={formik.touched.selectedTipoId && formik.errors.selectedTipoId}>
                <FormLabel fontSize="sm">Tipo de Identificación</FormLabel>
                <Select 
                  size="sm" 
                  placeholder="Seleccione un Tipo de Identificación" 
                  name="selectedTipoId" 
                  value={formik.values.selectedTipoId} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur}
                >
                  {tipoId.map((tipo) => (
                    <option key={tipo.idTiid} value={tipo.idTiid}>{tipo.nombre}</option>
                  ))}
                </Select>
                {formik.touched.selectedTipoId && formik.errors.selectedTipoId && <Text color="red.500" fontSize="sm">{formik.errors.selectedTipoId}</Text>}
              </FormControl>

              <FormControl id="identificacion" mb={2} isInvalid={formik.touched.identificacion && formik.errors.identificacion}>
                <FormLabel fontSize="sm">Número de Identificación</FormLabel>
                <Input 
                  size="sm" 
                  type="text" 
                  name="identificacion" 
                  value={formik.values.identificacion} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur}
                />
                {formik.touched.identificacion && formik.errors.identificacion && <Text color="red.500" fontSize="sm">{formik.errors.identificacion}</Text>}
              </FormControl>

              <Flex justify="flex-end" mt={4}>
                <Button type="submit" colorScheme="blue" size="sm">Guardar Cliente</Button>
              </Flex>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
}
