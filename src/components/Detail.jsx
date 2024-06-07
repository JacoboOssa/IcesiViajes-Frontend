import React, { useState,useEffect } from 'react';
import instance from "../axios.js";
import axios from "axios";
import { Box, Heading, Text, Image, Divider, Grid, Stack,AbsoluteCenter,useColorModeValue,UnorderedList, ListItem,Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Select } from "@chakra-ui/react";
import { MdFastfood,MdHotel, } from "react-icons/md";
import { FaCar,FaWalking  } from "react-icons/fa";



const Detail = ({ planDetails }) => {
  const [destino, setDestino] = useState([]);
  const [plan,setPlanes] = useState([]);
  const [imagenes,setImagenes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientes,setClientes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null); 

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClientSelectChange = (event) => {
    setSelectedClientId(event.target.value); 
  };

  const handleSaveModal = async() => {
    const newReserva ={
      idClie: selectedClientId,
      idPlan: planDetails.idPlan
    }
    try {
      const response = await axios.post(instance.getUri() + "/plancliente/crear",newReserva);
    } catch (error) {
      console.error("Error saving reserva:", error);
    }
      setIsModalOpen(false); 
  };




useEffect(() => {
  const fetchPlanes = async () => {
    if (planDetails.idPlan) {
      try {
        const response = await axios.get(instance.getUri() + "/plan/consultarid/" + planDetails.idPlan);
        setPlanes(response.data);
      } catch (error) {
        console.error("Error fetching Planes:", error);
      }
    }
  };
  fetchPlanes();
}, [planDetails.idPlan]);

useEffect(() => {
  const fetchDestino = async () => {
    if (planDetails.idDest) {
      try {
        const response = await axios.get(instance.getUri() + "/destino/consultarid/" + planDetails.idDest);
        setDestino(response.data);
      } catch (error) {
        console.error("Error fetching Destino:", error);
      }
    }
  };
  fetchDestino();
}, [planDetails.idDest]);

useEffect(() => {
  const fetchImagenes = async () => {
    if (planDetails.idPlan) {
      try {
        const response = await axios.get(instance.getUri() + "/imagendestino/consultarid/" + planDetails.idPlan);
        setImagenes(response.data);
      } catch (error) {
        console.error("Error fetching imagenes:", error);
      }
    }
  };
  fetchImagenes();
}, [planDetails.idPlan]);

useEffect(() => {
  const fetchClientes = async () => {
      try {
        const response = await axios.get(instance.getUri() + "/cliente/consultar");
        setClientes(response.data);
      } catch (error) {
        console.error("Error fetching Planes:", error);
      }
    
  };
  fetchClientes();
}, []);


  return (
    <Box p={8} ml={10} rounded="md" mb={8} shadow={useColorModeValue('rgba(0, 0, 0, 0.25)')}>
      <Heading as="h2" size="lg" mb={4}>
        Detalles del Plan
      </Heading>
      <Tabs>
        <TabList>
          <Tab>Resumen</Tab>
          <Tab>Imágenes</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid templateColumns="1fr 1fr" gap={8}>
              <Box>
                <Text fontSize="xl" fontWeight="bold" mt={5}>
                  Nombre del Destino
                </Text>
                <Text fontSize="md" mb={4} >
                  {destino.nombre}
                </Text>
                <Text fontSize="xl" fontWeight="bold" mt={5}>
                  Descripción:
                </Text>
                <Text fontSize="md" mb={4}>
                  {plan.descripcionSolicitud}
                </Text>
                <Text fontSize="xl" fontWeight="bold" mt={5}>
                  Número de Personas:
                </Text>
                <Text fontSize="md" mb={4}>
                  {plan.cantidadPersonas}
                </Text>
                <Text fontSize="xl" fontWeight="bold" mt={5}>
                  Fecha de Inicio:
                </Text>
                <Text fontSize="md" mb={4}>
                {formatDate(plan.fechaInicioViaje)}
                </Text>
                <Text fontSize="xl" fontWeight="bold" mt={5}>
                  Fecha de Fin:
                </Text>
                <Text fontSize="md" mb={4}>
                  {formatDate(plan.fechaFinViaje)}
                </Text>
                <Text fontSize="xl" fontWeight="bold" mt={5}>
                  Valor:
                </Text>
                <Text fontSize="md" mb={4}>
                  {plan.valorTotal}
                </Text>

              </Box>
              <Box>
                <Box position='relative' padding='10'>
                  <Divider />
                  <AbsoluteCenter bg='white' px='4'>
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      Incluye
                    </Text>
                  </AbsoluteCenter>
                </Box>
                <Box as="ul" mb={2}>
                  <UnorderedList fontSize="md" mb={4} >
                    {planDetails.alimentacion === 's' && <ListItem>Alimentación</ListItem>}
                    {planDetails.hospedaje === 's' && <ListItem> Hospedaje </ListItem>}
                    {planDetails.transporte === 's' && <ListItem>Transporte</ListItem>}
                    {planDetails.traslados === 's' && <ListItem>Traslados</ListItem>}
                  </UnorderedList>
                  <Button onClick={handleOpenModal} colorScheme="blue" mt={4}>
                    Agregar Reserva
                  </Button>
                </Box>
              </Box>
            </Grid>
          </TabPanel>
          <TabPanel>
          <Box>
            <Text fontSize="xl" fontWeight="bold" mt={5} mb={10}>
              Imágenes del Destino
            </Text>
            <Stack spacing={4} flexDirection={"row"}>
              {imagenes.map((imagen, index) => (
                <Image key={index} src={imagen.urlImg} alt={`Imagen ${index + 1}`} boxSize="200px" objectFit="cover" mb={4} />
              ))}
            </Stack>
          </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
            {/* Modal para seleccionar cliente */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Seleccionar Cliente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Selecciona un cliente para agregar la reserva:</Text>
            <Select placeholder="Seleccionar cliente" onChange={handleClientSelectChange}>
              {clientes.map(cliente => (
                <option key={cliente.idClie} value={cliente.idClie}>{cliente.nombre} {cliente.primerApellido} {cliente.segundoApellido}</option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={() => handleSaveModal(selectedClientId)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
export default Detail;
