import React, { useState } from 'react';
import { Table,Tfoot, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Box, Flex, Button, ButtonGroup, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { FaPen, FaTrashAlt } from "react-icons/fa";
import instance from "../axios.js";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 

export default function TableManagePlanes({ data, header1, header2, header3, header4, header5 }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };
    const [planSeleccionado, setPlanSeleccionado] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();


    const handleClose = () => setIsOpen(false);
    const handleOpen = (plan) => {
        setPlanSeleccionado(plan);
        setIsOpen(true);
    };

    const handleEditClick = (plan) => {
        setPlanSeleccionado(plan);
        navigate(`/actualizarplan/${plan.idPlan}`);
    };

    const handleDelete = async () => {
        try {
            // 1. Buscar el detalle del plan por ID del plan
            const detalleResponse = await axios.get(instance.getUri() + "/detalleplan/consultarporidplan/"+planSeleccionado.idPlan);
            const detallePlan = detalleResponse.data;
            console.log("Detalle del plan:", detallePlan);

            

            // 2. Eliminar el detalle del plan
            await axios.post(instance.getUri() + "/detalleplan/borrarporid/"+detallePlan.idDepl);

            // 3. Buscar las imágenes por ID del plan
            const imagenesResponse = await axios.get(instance.getUri() + "/imagendestino/consultarid/"+planSeleccionado.idPlan);
            const imagenes = imagenesResponse.data;
            console.log("Imágenes:", imagenes);

    

            // 4. Verificar que `imagenes` es un array antes de proceder
            if (Array.isArray(imagenes) && imagenes.length > 0) {
                // Eliminar cada imagen concurrentemente
                const deletePromises = imagenes.map(imagen => axios.delete(instance.getUri() + "/cloudinary/delete/" + imagen.idImag));
                await Promise.all(deletePromises);
                console.log("Imágenes eliminadas");
            } else {
                console.log("No hay imágenes para eliminar");
            }

            // 5. Finalmente, eliminar el plan
            await axios.post(instance.getUri() + "/plan/borrarporid/"+ planSeleccionado.idPlan);

            console.log("Plan eliminado correctamente");
            handleClose();
        } catch (error) {
            console.error('Error deleting plan:', error);
        }
    };

    return (
        <Box h="100vh" display="flex" justifyContent="center" alignItems="center">
            <Box>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead bgColor={"gray.100"}>
                            <Tr>
                                <Th textAlign="center">{header1}</Th>
                                <Th textAlign="center">{header2}</Th>
                                <Th textAlign="center">{header3}</Th>
                                <Th textAlign="center">{header4}</Th>
                                <Th textAlign="center">{header5}</Th>
                                <Th textAlign="center">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((item, index) => (
                                <Tr key={index}>
                                    <Td textAlign="center">{item.nombre}</Td>
                                    <Td textAlign="center">{formatDate(item.fechaInicioViaje)}</Td>
                                    <Td textAlign="center">{formatDate(item.fechaFinViaje)}</Td>
                                    <Td textAlign="center">{item.valorTotal}</Td>
                                    <Td textAlign="center">{item.cantidadPersonas}</Td>
                                    <Td textAlign="center">
                                        <ButtonGroup variant="outline" spacing="2">
                                            <IconButton colorScheme='blue' icon={<FaPen />} onClick={() => handleEditClick(item)}/>
                                            <IconButton colorScheme='red' icon={<FaTrashAlt />} onClick={() => handleOpen(item)} />
                                        </ButtonGroup>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                        <Tfoot>

                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar eliminación</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        ¿Seguro que quiere eliminar el plan {planSeleccionado && planSeleccionado.nombre}?
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={handleDelete}>Eliminar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
