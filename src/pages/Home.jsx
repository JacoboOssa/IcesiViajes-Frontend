import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import TripCard from "../components/TripCard";
import { jwtDecode } from "jwt-decode";
import instance from "../axios.js";
import axios from "axios";
//DEBO CONSUMIR API PARA OBTENER IMAGENES Y NOMBRES EN UNA LISTA E ITERAR SOBRE ESTAS

import {
  Box,
  Text,
  Input,
  Stack,
  SimpleGrid,
  IconButton,
  InputGroup,
  InputLeftElement,
  Button,
  ButtonGroup,
  Select
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { TbUserSquare } from "react-icons/tb";
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate




export default function Home() {
  const navigate = useNavigate(); // Para redireccionar al usuario
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage] = useState(3); // Cambiar el número de tarjetas por página según sea necesario
  const [planes,setPlanes] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");


  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(instance.getUri() + "/destino/consultar");
        setDestinations(response.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
  
    fetchDestinations();
  }, []);




  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(instance.getUri()+"/plan/obtenerplanesimagenes");
            setPlanes(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();
}, []);


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

  const totalPages = Math.ceil(planes.length / cardsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handleSearch = async () => {
    try {
      let apiUrl = instance.getUri() + "/plan/";

      const startDateInput = document.querySelector("#startDate").value;
      const endDateInput = document.querySelector("#endDate").value;
      const personasInput = document.querySelector("#personas").value;
  
      // Verificar si solo el destino está seleccionado
      if (selectedDestination && !startDateInput && !endDateInput && !personasInput) {
        apiUrl += "consultarpornombre/" + selectedDestination;
      }
      // Verificar si se seleccionaron la fecha de inicio y fin
      else if (selectedDestination && startDateInput && endDateInput && !personasInput) {
        apiUrl += "consultarfechas/" + selectedDestination + "/" + startDateInput + "/" + endDateInput;
      }
      // Verificar si se seleccionaron el destino y el número de personas
      else if (selectedDestination && !startDateInput && !endDateInput && personasInput) {
        apiUrl += "consultardestpersonas/" + selectedDestination + "/" + personasInput;
      }
      // Verificar si se seleccionaron todos los campos
      else if (selectedDestination && startDateInput && endDateInput && personasInput) {
        apiUrl += "consultartodo/" + selectedDestination + "/" + startDateInput + "/" + endDateInput + "/" + personasInput;
      }
  
      const response = await axios.get(apiUrl);
      const results = response.data; 
      navigate("/planes", { state: { results: results } }); // Navegar a /planes con los resultados como estado de ubicación
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  
  

  return (
    <>
      <Box display="flex">
        <Sidebar roleName={role} username={user} />
        <Box
          display="flex"
          flexDirection="column"
          flex="1"
          ml="5%"
          mr="5%"
          mt="3%"
          position="relative"
        >
          {/* Resto del contenido */}
          <Box
            borderRadius={20}
            bgImage="url('/bg_home.jpg')"
            backgroundPosition="center"
            backgroundSize="cover"
            height="45vh"
            position="relative"
            overflow="hidden"
          >
            {/* Texto dentro de la imagen */}
            <Box
              position="absolute"
              textAlign="center"
              color="white"
              borderRadius="md"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <Text fontSize="lg" fontWeight="bold">
                Disfrute de las vacaciones de sus sueños
              </Text>
              <Text fontSize="md" mt={4}>
                Planifique y reserve su viaje perfecto con nuestros consejos
                de expertos, sugerencias de viaje, información sobre destinos
                e inspiración
              </Text>
            </Box>
          </Box>

          <Box
            mt={-8}
            display="flex"
            justifyContent="center"
            position="relative"
            zIndex="1"
          >
            <Box bgColor={"white"} shadow={"md"} p={3} borderRadius={8} width={"auto"}>
              <Stack direction="row" spacing={1} align="center">
                <Select
                  variant="filled"
                  placeholder="Selecciona un destino"
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                >
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.nombre}>
                      {destination.nombre}
                    </option>
                  ))}
                </Select>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <MdDateRange color="gray.300" />
                  </InputLeftElement>
                  <Input id="startDate" variant="filled" placeholder="Check in" type="date" />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <MdDateRange color="gray.300" />
                  </InputLeftElement>
                  <Input id="endDate" variant="filled" placeholder="Check out" type="date" />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <TbUserSquare  color="gray.300" />
                  </InputLeftElement>
                  <Input id="personas" variant="filled" placeholder="Personas" type="number" />
                </InputGroup>
                <ButtonGroup>
                  <Button onClick={handleSearch} colorScheme='blue'>Buscar</Button>
                </ButtonGroup>
              
              </Stack>
            </Box>
          </Box>
          <Box mt={10} ml="5%" mr="5%" textAlign="center">
            <Text fontSize="2xl" mt={2}>
              Viajes Disponibles
            </Text>
            <Box position="relative">
              <IconButton
                aria-label="Previous Page"
                icon={<FaArrowLeft />}
                onClick={handlePrevPage}
                style={{ position: "absolute", left: "-40px", top: "50%", transform: "translateY(-50%)" }}
                disabled={currentPage === 0}
              />
              <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                {planes
                  .slice(
                    currentPage * cardsPerPage,
                    currentPage * cardsPerPage + cardsPerPage
                  )
                  .map((plan, index) => (
                    <TripCard
                      key={index}
                      imageSrc={plan.url}
                      name={plan.nombre}
                      planId={plan.idPlan} 
                    />
                  ))}
              </SimpleGrid>
              <IconButton
                aria-label="Next Page"
                icon={<FaArrowRight />}
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                style={{ position: "absolute", right: "-40px", top: "50%", transform: "translateY(-50%)" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
