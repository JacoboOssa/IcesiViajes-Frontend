import React, { useEffect, useState } from "react";
import TableManageClientes from '../components/TableManageClientes';
import Sidebar from '../components/SideBar';
import { Flex, Box, Text, Button, ButtonGroup, InputGroup, InputLeftElement, Input,FormControl,useColorModeValue } from '@chakra-ui/react';
import { IoMdAdd } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import { IoSearch } from "react-icons/io5";
import instance from "../axios.js";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate




export default function TableClientes(){
    const [role, setRole] = useState("");
    const [user, setUser] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [plansPerPage] = useState(4); // Número de planes por página
    const [clientes, setClientes] = useState([]);
    const [searchPhrase, setSearchPhrase] = useState("");
    const navigate = useNavigate(); // Para redireccionar al usuario


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
        const fetchData = async () => {
            try {
                const response = await axios.get(instance.getUri()+"/cliente/consultar");
                setClientes(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);



    // Filtra los datos para mostrar solo la página actual
    const filteredData = clientes.filter((item) => {
        return (
            item.nombre.toLowerCase().includes(searchPhrase.toLowerCase())
            //item.correo.toLowerCase().includes(searchPhrase.toLowerCase()) ||
            //item.telefono.toLowerCase().includes(searchPhrase.toLowerCase()) ||
            //item.estado.toLowerCase().includes(searchPhrase.toLowerCase()) ||
            //item.plan.toString().toLowerCase().includes(searchPhrase.toLowerCase())
        );
    });

    // Calcula el total de páginas
    const totalPages = Math.ceil(filteredData.length / plansPerPage);

    // Filtra los datos para mostrar solo la página actual
    const currentData = filteredData.slice(
        currentPage * plansPerPage,
        currentPage * plansPerPage + plansPerPage
    );

    // Maneja el cambio a la página anterior
    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    };

    // Maneja el cambio a la página siguiente
    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
    };

    // Función para manejar cambios en el término de búsqueda
    const handleSearchChange = (event) => {
        setSearchPhrase(event.target.value); 
    };
    
    useEffect(() => {
        const filteredData = clientes.filter((item) => {
            return (
                item.nombre.toLowerCase().includes(searchPhrase.toLowerCase())
                //item.correo.toLowerCase().includes(searchPhrase.toLowerCase()) ||
                //item.telefono.toLowerCase().includes(searchPhrase.toLowerCase()) ||
                //item.estado.toLowerCase().includes(searchPhrase.toLowerCase()) ||
                //item.plan.toString().toLowerCase().includes(searchPhrase.toLowerCase())
            );
        });
        //const totalPages = Math.ceil(filteredData.length / plansPerPage);
        //setCurrentPage(0); // Reiniciar la página a la primera cuando se cambia el término de búsqueda
    }, [searchPhrase, clientes, plansPerPage]);

    return(
        <Flex>
            <Sidebar roleName={role} username={user} />
            <Flex direction="column" flex="1" ml="5%" mt="2%" mr="5%">
                <Text fontSize="2xl" mb={"-3%"}>Clientes</Text>
                <Flex mb={-5} mt={-5} flexDirection={"row"} justify="space-between">

                        <Button leftIcon={<IoMdAdd />} colorScheme="blue" mt={20} mb={-20}  onClick={() => navigate('/crearcliente')}>Nuevo Cliente</Button>
                        <InputGroup mt={20} mb={-20} width={"auto"} >
                            <InputLeftElement pointerEvents='none'>
                                <IoSearch color='gray.300' />
                            </InputLeftElement>
                            <Input 
                                variant={"filled"}  
                                size={"md"}                      
                                value={searchPhrase}
                                onChange={handleSearchChange}
                                placeholder='Buscar' 
                            />
                        </InputGroup>
                </Flex>

                <TableManageClientes data={currentData} header1={"Cliente"} header2={"Correo"} header3={"Telefono"} header4={"Estado"} header5={"Paquete(s)"}/>

                <Flex justifyContent="center" mt={-8}>
                    <ButtonGroup mt={-20}>
                        <Button
                            colorScheme='blue'
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            variant={"outline"}
                        >
                            Anterior
                        </Button>
                        <Button
                            colorScheme='blue'
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                            variant={"outline"}
                        >
                            Siguiente
                        </Button>
                    </ButtonGroup>
                </Flex>
                <Text textAlign="center" fontSize="sm" color="gray.500" mt={-9}>
                    Página {currentPage + 1} de {totalPages}, mostrando {currentData.length} de {clientes.length} clientes
                </Text>
            </Flex>
        </Flex>
    );
}
