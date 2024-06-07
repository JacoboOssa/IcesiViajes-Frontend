import React, { useState,useEffect } from 'react';
import PlanCard from '../components/PlanCard';
import Sidebar from '../components/SideBar';
import instance from "../axios.js";
import axios from "axios";
import { Box,
    Text,
    Input,
    Stack,
    SimpleGrid,
    IconButton,
    InputGroup,
    InputLeftElement,
    Button,
    ButtonGroup,
    Flex } from "@chakra-ui/react";
import { FaLocationDot } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { TbUserSquare } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';




export default function Plan() {
    const navigate = useNavigate(); 
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [role, setRole] = useState("");
    const [user, setUser] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [plansPerPage] = useState(3); // Número de planes por página
    const [planes,setPlanes] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState("");

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Sumar 1 al mes porque los meses comienzan desde 0
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
        if (location.state && location.state.results) {
            setResults(location.state.results); // Obtener los resultados de la ubicación
        }
    }, [location.state]);

    // Calcula el total de páginas
    const totalPages = Math.ceil(results.length / plansPerPage);

    // Maneja el cambio a la página anterior
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    // Maneja el cambio a la página siguiente
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    const uniquePlans = results.reduce((unique, result) => {
      if (!unique.some((item) => item.idPlan === result.idPlan)) {
          unique.push(result);
      }
      return unique;
    }, []);


    console.log(results)
    return (
      <>
        <Flex>
            <Sidebar roleName={role} username={user} />
            <Box flex="1" ml="5%" mr="5%" mt="3%">
                <Text fontSize="2xl" mb={10}>Resultados de búsqueda</Text>
                {/* <Box bgColor={"white"} shadow={"md"} p={3} borderRadius={8}>
                  <Stack direction="row" spacing={2} align="center">
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaLocationDot color="gray.300" />
                      </InputLeftElement>
                      <Input variant="filled" placeholder="Destino" />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <MdDateRange color="gray.300" />
                      </InputLeftElement>
                      <Input variant="filled" placeholder="Check in" />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <MdDateRange color="gray.300" />
                      </InputLeftElement>
                      <Input variant="filled" placeholder="Check out" />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <TbUserSquare  color="gray.300" />
                      </InputLeftElement>
                      <Input variant="filled" placeholder="Personas" type="number" />
                    </InputGroup>
                    <ButtonGroup>
                      <Button colorScheme='blue'>Buscar</Button>
                    </ButtonGroup>              
                  </Stack>
                </Box> */}
                <Flex justifyContent="center" flexWrap="wrap">
                    {uniquePlans
                        .slice(
                            currentPage * plansPerPage,
                            currentPage * plansPerPage + plansPerPage
                        )
                        .map((result, index) => (
                            <PlanCard
                                key={index}
                                name={result.plan_nombre}
                                destination={result.destino_nombre}
                                initialDate={formatDate(result.fechaInicioViaje)}
                                endDate={formatDate(result.fechaFinViaje)}
                                people={result.cantidadPersonas}
                                price={result.valorTotal}
                                imageSrc={result.url}
                                idPlan={result.idPlan}
                            />
                        ))}
                </Flex>
                <Flex justifyContent="center" mt={4} mb={4}>
                    <ButtonGroup>
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
            </Box>
        </Flex>
        </>
    );
}
