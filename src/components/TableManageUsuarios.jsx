import React, { useState } from 'react';
import { Table,Tfoot, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Box, Flex, Button, ButtonGroup, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { FaPen, FaTrashAlt } from "react-icons/fa";
import instance from "../axios.js";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 


export default function TableManageUsuarios({ data, header1, header2, header3, header4, header5 }) {
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();


    const handleClose = () => setIsOpen(false);
    const handleOpen = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setIsOpen(true);
    };

    const handleEditClick = (usuario) => {
        setUsuarioSeleccionado(usuario);
        navigate(`/actualizarusuario/${usuario.idUsua}`);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.post(instance.getUri()+"/usuario/borrarporid/"+usuarioSeleccionado.idUsua);
            console.log(response.data);
            // Perform any necessary actions after deleting the client, such as updating the client list
            handleClose();
        } catch (error) {
            console.error('Error deleting usuario:', error);
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
                                    <Td textAlign="center">{item.username}</Td>
                                    <Td textAlign="center">{item.nombre}</Td>
                                    <Td textAlign="center">{item.identificacion}</Td>
                                    <Td textAlign="center">{item.rol}</Td>
                                    <Td textAlign="center">{item.estado}</Td>
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
                        Seguro que quiere eliminar a {usuarioSeleccionado && `${usuarioSeleccionado.nombre}`}?
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
