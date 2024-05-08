import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useAuthContext } from "../context/AuthContext.jsx";
import instance from "../axios.js";
import ErrorAlert from "../components/ErrorAlert.jsx";
import { useState } from 'react';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  FormErrorMessage
} from '@chakra-ui/react';


function LoginPage() {
  const {authData, login, logout} = useAuthContext()
  //const navigate = useNavigate(); // Para redireccionar al usuario
  const [errorMessage, setErrorMessage] = useState('');


  const formik = useFormik({
    initialValues: {
        login: "",
        password: "",
    },
      onSubmit: async (values) => {

          try {
              const response = await axios.post(instance.getUri() + "/auth/login", {
                "login": values.login,
                "password": values.password
              });

              // Verifica el código de estado de la respuesta
              if (response.status === 200) {
                const token = response.data.token;
              // Verifica si se devolvió un token válido
              if (token) {
                localStorage.setItem('token', token);
                
                
                //console.log(token)
                
                
                login();
                //navigate("/home"); // Navegar a home luego de loguearse
              } else {
                // No se recibió un token válido
                setErrorMessage("Incorrect user or password");
              }
            } else {
              // La solicitud no fue exitosa
              setErrorMessage("Login request failed");
            }
          } catch (e) {
              if (e.toString().includes("Network Error")) {
                  setErrorMessage("Can't connect with backend")
              } else {
                  setErrorMessage("Incorrect password")
              }
              console.log(e)
          }
      },
      validationSchema: Yup.object({
          login: Yup.string().required("Username is required"),
          password: Yup.string().required("Password is required")
      }),
  });

  const handleCloseError = () => {
    setErrorMessage('');
  };


  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bgImage="url('/background.png')">

      <Stack spacing={5} mx={'auto'} maxW={'lg'} py={7} px={6}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.8)')}
          boxShadow={'lg'}
          p={10}
          maxW={'2x1'}>
          <Stack spacing={8} py={1}  align={'center'}>
          {errorMessage && <ErrorAlert errorTitle={errorMessage} onClose={handleCloseError} />}

          <Heading color={useColorModeValue('white')} fontSize={'4xl'}>Login</Heading>
        </Stack>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={4}>
            <FormControl isInvalid={formik.touched.login && formik.errors.login}>
              <FormLabel htmlFor={"login"} color={useColorModeValue('white')}>Username</FormLabel>
              <Input id="login" name="login" {...formik.getFieldProps("login")} bg={useColorModeValue('gray.100', 'gray.700')} />
            <FormErrorMessage className="error-message">
              {formik.errors.login}
            </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.touched.password && formik.errors.password}>
              <FormLabel htmlFor={"password"} color={useColorModeValue('white')}>Password</FormLabel>
              <Input type={"password"} id="password" name="password" {...formik.getFieldProps("password")} bg={useColorModeValue('gray.100', 'gray.700')} />
              <FormErrorMessage>
                {formik.errors.password}
              </FormErrorMessage>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox color={useColorModeValue('white')}>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button
                onClick={formik.handleSubmit}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.600',
                }}>
                Sign in
              </Button>
            </Stack>
          </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default LoginPage