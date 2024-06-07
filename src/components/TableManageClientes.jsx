import React, { useState, useEffect } from 'react';
import { Table, Tfoot, Thead, Tbody, Tr, Th, Td, TableContainer, Box, ButtonGroup, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button,Link } from '@chakra-ui/react';
import { FaPen, FaTrashAlt, FaEye } from "react-icons/fa";
import { IoMdAirplane } from "react-icons/io";
import instance from "../axios.js";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function TableManageClientes({ data, header1, header2, header3, header4, header5 }) {
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isReservationsOpen, setIsReservationsOpen] = useState(false);
    const [reservas, setReservas] = useState([]);

    const handleDeleteClose = () => setIsDeleteOpen(false);
    const handleDeleteOpen = (cliente) => {
        setClienteSeleccionado(cliente);
        setIsDeleteOpen(true);
    };

    const handleReservationsClose = () => {
        setIsReservationsOpen(false);
        setReservas([]);
    };

    const handleReservationsOpen = async (cliente) => {
        setClienteSeleccionado(cliente);
        try {
            const response = await axios.get(instance.getUri() + "/plancliente/consultarplanesscliente/" + cliente.idClie);
            setReservas(response.data);
            setIsReservationsOpen(true);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const navigate = useNavigate();

    const handleEditClick = (cliente) => {
        setClienteSeleccionado(cliente);
        navigate(`/actualizarcliente/${cliente.idClie}`);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.post(instance.getUri() + "/cliente/borrarporid/" + clienteSeleccionado.idClie);
            handleDeleteClose();
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const handleViewPlan = (planId) => {
        navigate(`/plan/${planId}`);
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
                                <Th textAlign="center">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((item, index) => (
                                <Tr key={index}>
                                    <Td textAlign="center">{item.nombre} {item.primerApellido} {item.segundoApellido}</Td>
                                    <Td textAlign="center">{item.correo}</Td>
                                    <Td textAlign="center">{item.telefono1}</Td>
                                    <Td textAlign="center">{item.estado}</Td>
                                    <Td textAlign="center">
                                        <ButtonGroup variant="outline" spacing="2">
                                            <IconButton colorScheme='blue' icon={<FaPen />} onClick={() => handleEditClick(item)} />
                                            <IconButton colorScheme='red' icon={<FaTrashAlt />} onClick={() => handleDeleteOpen(item)} />
                                            <IconButton colorScheme='green' icon={<IoMdAirplane />} onClick={() => handleReservationsOpen(item)} />
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

            <Modal isOpen={isDeleteOpen} onClose={handleDeleteClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar eliminación</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Seguro que quiere eliminar a {clienteSeleccionado && `${clienteSeleccionado.nombre} ${clienteSeleccionado.primerApellido} ${clienteSeleccionado.segundoApellido}`}?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleDeleteClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={handleDelete}>Eliminar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isReservationsOpen} onClose={handleReservationsClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reservas de {clienteSeleccionado && `${clienteSeleccionado.nombre} ${clienteSeleccionado.primerApellido} ${clienteSeleccionado.segundoApellido}`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {reservas.length > 0 ? (
                            <ul>
                                {reservas.map((reserva, index) => (
                                    <li key={index}>
                                        <Link color="blue" cursor="pointer" onClick={() => handleViewPlan(reserva.idPlan)}>
                                            {reserva.nombre}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay reservas para este cliente.</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleReservationsClose}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    );
}
