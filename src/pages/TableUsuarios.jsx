import React, { useEffect, useState } from "react";
import TableManageUsuarios from "../components/TableManageUsuarios";
import Sidebar from '../components/SideBar';
import { Flex, Box, Text, Button, ButtonGroup, InputGroup, InputLeftElement, Input,FormControl,useColorModeValue } from '@chakra-ui/react';
import { IoMdAdd } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import instance from "../axios.js";
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate




export default function TableUsuarios(){
    const [role, setRole] = useState("");
    const [user, setUser] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [plansPerPage] = useState(4); // Número de planes por página
    const [usuarios,setUsuarios] = useState([]);
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
                const response = await axios.get(instance.getUri()+"/usuario/consultar");
                setUsuarios(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Filtra los datos para mostrar solo la página actual
    const filteredData = usuarios.filter((item) => {
        return (
            item.nombre.toLowerCase().includes(searchPhrase.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredData.length / plansPerPage);

    const currentData = filteredData.slice(
        currentPage * plansPerPage,
        currentPage * plansPerPage + plansPerPage
    );

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
    };

    const handleSearchChange = (event) => {
        setSearchPhrase(event.target.value);
    };

    useEffect(() => {
        const filteredData = usuarios.filter((item) => {
            return (
                item.nombre.toLowerCase().includes(searchPhrase.toLowerCase())

            );
        });

    }, [searchPhrase, usuarios, plansPerPage]);

    return(
        <Flex>
            <Sidebar roleName={role} username={user}/>
            <Flex direction="column" flex="1" ml="5%" mt="2%" mr="5%">
                <Text fontSize="2xl" mb={"-3%"}>Usuarios</Text>
                <Flex mb={-5} mt={-5} flexDirection={"row"} justify="space-between" >
                    <Button leftIcon={<IoMdAdd />} colorScheme="blue" mt={20} mb={-20} ml={20} onClick={() => navigate('/crearusuario')}>Nuevo Usuario</Button>
                    <InputGroup mt={20} mb={-20} mr={20} width={"auto"} >
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
                <TableManageUsuarios data={currentData} header1={"Usuarios"} header2={"Nombre"} header3={"Identificacion"} header4={"Rol"} header5={"Estado"}/>
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
                    Página {currentPage + 1} de {totalPages}, mostrando {currentData.length} de {usuarios.length} usuarios
                </Text>
            </Flex>
        </Flex>
    );
}
