import React, { useState, useEffect } from 'react';
import axios from 'axios';
import instance from "../axios.js";
import Sidebar from '../components/SideBar';
import {jwtDecode} from "jwt-decode";
import * as Yup from 'yup';
import { Box, useColorModeValue, FormControl, FormLabel, Input, Select, Button, Flex, Text, Alert, AlertIcon, CloseButton,FormErrorMessage } from '@chakra-ui/react';
import { Formik, Form, ErrorMessage } from 'formik';

export default function CrearUsuario() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");

  const validationSchema = Yup.object().shape({
    identificacion: Yup.string().required('Número de Identificación es obligatorio'),
    login: Yup.string().required('Nombre de Usuario es obligatorio'),
    password: Yup.string().required('Contraseña es obligatoria'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir').required('Confirmar Contraseña es obligatoria'),
    nombre: Yup.string().required('Nombre Completo es obligatorio'),
    rol: Yup.string().required('Rol es obligatorio'),
});

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

  const handleSaveUsuario = async (values) => {
    try {
        // Validar datos usando Yup
        await validationSchema.validate(values, { abortEarly: false });

        // Si la validación es exitosa, continuar con la lógica para guardar el usuario
        if (values.password !== values.confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        const newUsuario = {
            login: values.login,
            password: values.password,
            nombre: values.nombre,
            identificacion: values.identificacion,
            fechaCreacion: new Date(),
            usuCreador: user, //AGREGAR USUARIO
            estado: "A",
            rol: values.rol,
        };

        await axios.post(instance.getUri() + "/auth/register", newUsuario);
        // Aquí puedes manejar la respuesta de la API si es necesario
        setSuccessMessage("Usuario creado correctamente.");
        // Limpiar mensajes de error
        setErrorMessage("");
        onClose();
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Manejar errores de validación de Yup
            error.inner.forEach(err => {
                setErrorMessage(err.message);
            });
        } else {
            console.error("Error creating Usuario:", error);
            // Aquí puedes manejar el error si es necesario
        }
    }
};

  return (
    <>
      <Box display={"flex"} shadow={useColorModeValue('rgba(0, 0, 0, 0.25)')}>
      <Sidebar roleName={role} username={user} />
      <Box flex="1" p={4}>
          <Box maxW="900px" mx="auto" p={4} mt={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={6} mt={-10}>Crear Usuario</Text>

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

            <Formik
              initialValues={{
                identificacion: "",
                login: "",
                password: "",
                confirmPassword: "",
                nombre: "",
                rol: ""
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleSaveUsuario(values);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Form>
                  <Flex mb={2}>
                  <FormControl id="identificacion" mr={2} isInvalid={touched.identificacion && !!errors.identificacion}>
                    <FormLabel fontSize="sm">Número de Identificación</FormLabel>
                    <Input size="sm" type="text" name="identificacion" value={values.identificacion} onChange={handleChange} onBlur={handleBlur} />
                    <FormErrorMessage color="red">{errors.identificacion}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="rol" ml={2} isInvalid={touched.rol && !!errors.rol}>
                      <FormLabel fontSize="sm">Rol</FormLabel>
                      <Select placeholder="Seleccione un Rol" size="sm" name="rol" value={values.rol} onChange={handleChange} onBlur={handleBlur}>
                        <option value="ADMIN">Administrador</option>
                        <option value="ASESOR">Asesor</option>
                        <option value="VIEWER">Invitado</option>
                      </Select>
                      <FormErrorMessage color="red">{errors.rol}</FormErrorMessage>
                    </FormControl>
                  </Flex>

                  <Flex mb={2}>
                  <FormControl mr={2} isInvalid={touched.nombre && !!errors.nombre}>
                      <FormLabel fontSize="sm">Nombre Completo</FormLabel>
                      <Input size="sm" type="text" name="nombre" value={values.nombre} onChange={handleChange} onBlur={handleBlur} />
                      <FormErrorMessage color="red">{errors.nombre}</FormErrorMessage>
                    </FormControl>
                    <FormControl ml={2} isInvalid={touched.login && !!errors.login}>
                      <FormLabel fontSize="sm">Nombre de Usuario</FormLabel>
                      <Input size="sm" type="text" name="login" value={values.login} onChange={handleChange} onBlur={handleBlur} />
                      <FormErrorMessage color="red">{errors.login}</FormErrorMessage>
                    </FormControl>
                  </Flex>

                  <Flex mb={2}>
                  <FormControl mr={2} isInvalid={touched.password && !!errors.password}>
                      <FormLabel fontSize="sm">Contraseña</FormLabel>
                      <Input size="sm" type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
                      <FormErrorMessage color="red">{errors.password}</FormErrorMessage>
                  </FormControl>
                    <FormControl ml={2} isInvalid={touched.confirmPassword && !!errors.confirmPassword}>
                      <FormLabel fontSize="sm">Confirmar Contraseña</FormLabel>
                      <Input size="sm" type="password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                      {touched.confirmPassword && errors.confirmPassword && <Text color="red">{errors.confirmPassword}</Text>}
                    </FormControl>
                  </Flex>

                  <Flex justify="flex-end" mt={4}>
                    <Button type="submit" colorScheme="blue" size="sm" >Guardar Usuario</Button>
                  </Flex>
                </Form>
              )}
            </Formik>

          </Box>
        </Box>
      </Box>
    </>
  );
}
