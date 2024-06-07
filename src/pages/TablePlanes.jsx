import React, { useEffect, useState } from "react";
import TableManagePlanes from "../components/TableManagePlanes";
import Sidebar from '../components/SideBar';
import { 
    Flex, 
    Box, 
    Text, 
    Button, 
    ButtonGroup, 
    InputGroup, 
    InputLeftElement, 
    Input,
    FormControl,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormLabel,
    Textarea,
    Select,
    useToast 
} from '@chakra-ui/react';
import { IoMdAdd } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import { IoSearch } from "react-icons/io5";
import instance from "../axios.js";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

// Esquema de validación
const validationSchema = Yup.object().shape({
    nombreDestino: Yup.string().required('El nombre del destino es obligatorio'),
    codigo: Yup.string().required('El código es obligatorio').max(5,"El codigo es de maximo 5 caracteres"),
    descripcion: Yup.string().required('La descripción es obligatoria').max(300, "La descripcion es superior a 300 caracteres"),
    tipoDestino: Yup.object().shape({
        nombre: Yup.string().required('El tipo de destino es obligatorio')
    }).nullable().required('El tipo de destino es obligatorio')
});

export default function TablePlanes() {
    const [role, setRole] = useState("");
    const [user, setUser] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [plansPerPage] = useState(4);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [planes, setPlanes] = useState([]);
    const [tiposDestinos, setTiposDestinos] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [nombreDestino, setNombreDestino] = useState("");
    const [codigo, setCodigo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipoDestino, setTipoDestino] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const toast = useToast();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
                const response = await axios.get(instance.getUri() + "/plan/consultar");
                setPlanes(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSaveDestino = async () => {
        try {
            // Validar datos usando Yup
            await validationSchema.validate({
                nombreDestino,
                codigo,
                descripcion,
                tipoDestino
            }, { abortEarly: false });

            // Si la validación es exitosa, continuar con la lógica para guardar el destino
            const newDestino = {
                nombre: nombreDestino,
                codigo: codigo,
                descripcion: descripcion,
                tipoDestino: tipoDestino,
                fechaCreacion: new Date(),
                fechaModificacion: null,
                usuCreador: user,
                usuModificador: null,
                estado: "A"
            };

            await axios.post(instance.getUri() + "/destino/crear", newDestino);
            setSuccessMessage("Destino creado correctamente");
            // Limpiar mensajes de error
            setErrorMessage("");
            setNombreDestino("");
            setCodigo("");
            setDescripcion("");
            setTipoDestino({});
            onClose();
            toast({
                title: "Destino creado correctamente",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errors = error.inner.reduce((acc, err) => {
                    acc[err.path] = err.message;
                    return acc;
                }, {});
                setErrorMessage("Error al crear el destino");
                // Limpiar mensaje de éxito
                setSuccessMessage("");
                setValidationErrors(errors);
                console.log(errors);
            } else {
                console.error("Error creating destino:", error);
                toast({
                    title: "Error al crear el destino",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    useEffect(() => {
        const fetchTiposDestino = async () => {
            try {
                const response = await axios.get(instance.getUri() + "/tipodestino/consultar");
                setTiposDestinos(response.data);
            } catch (error) {
                console.error("Error fetching destinos:", error);
            }
        };
        fetchTiposDestino();
    }, []);

    const filteredData = planes.filter((item) => item.nombre.toLowerCase().includes(searchPhrase.toLowerCase()));
    const totalPages = Math.ceil(filteredData.length / plansPerPage);
    const currentData = filteredData.slice(currentPage * plansPerPage, currentPage * plansPerPage + plansPerPage);

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
    };

    const handleSearchChange = (event) => {
        setSearchPhrase(event.target.value);
    };

    return (
        <Box display={"flex"} shadow={useColorModeValue('rgba(0, 0, 0, 0.25)')}>
            <Sidebar roleName={role} username={user} />
            <Box
                display="flex"
                flexDirection="column"
                flex="1"
                ml="5%"
                mr="5%"
                mt="3%"
                position="sticky">
                <Text fontSize="2xl" mb={"-3%"}>Planes</Text>
                <Flex mb={-5} mt={-5} flexDirection={"row"} justify="space-between">
                    <ButtonGroup>
                        <Button leftIcon={<IoMdAdd />} colorScheme="blue" onClick={() => navigate('/crearplanes')} mt={20} mb={-20}>Nuevo Plan</Button>
                        <>
                            {role === "ADMIN" && (<Button leftIcon={<IoMdAdd />} onClick={onOpen} colorScheme="blue" mt={20} mb={-20} ml={-30}>Nuevo Destino</Button>)}
                            {/* <Button leftIcon={<IoMdAdd />} onClick={onOpen} colorScheme="blue" mt={20} mb={-20} ml={-30}>Nuevo Destino</Button> */}
                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Crear Destino</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <Flex mb={4}>
                                            <FormControl id="nombre-destino" mr={2} isInvalid={!!validationErrors.nombreDestino}>
                                                <FormLabel>Nombre destino</FormLabel>
                                                <Input
                                                    placeholder="Nombre destino"
                                                    value={nombreDestino}
                                                    onChange={(e) => setNombreDestino(e.target.value)}
                                                />
                                                <Text color="red" mt={1}>{validationErrors.nombreDestino}</Text>
                                            </FormControl>
                                            <FormControl id="codigo" ml={2} isInvalid={!!validationErrors.codigo}>
                                                <FormLabel>Código</FormLabel>
                                                <Input
                                                    placeholder="Código"
                                                    value={codigo}
                                                    onChange={(e) => setCodigo(e.target.value)}
                                                />
                                                <Text color="red" mt={1}>{validationErrors.codigo}</Text>
                                            </FormControl>
                                        </Flex>
                                        <FormControl id="descripcion" mb={4} isInvalid={!!validationErrors.descripcion}>
                                            <FormLabel>Descripción</FormLabel>
                                            <Textarea
                                                placeholder="Descripción"
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                            />
                                            <Text color="red" mt={1}>{validationErrors.descripcion}</Text>
                                        </FormControl>
                                        <FormControl id="tipo-destino" mb={4} isInvalid={!!validationErrors.tipoDestino}>
                                            <FormLabel>Tipo destino</FormLabel>
                                            <Select
                                                placeholder="Seleccionar tipo destino"
                                                value={tipoDestino.nombre || ""}
                                                onChange={(e) => {
                                                    const selectedTipoDestino = tiposDestinos.find(td => td.nombre === e.target.value);
                                                    setTipoDestino(selectedTipoDestino);
                                                }}
                                            >
                                                {tiposDestinos.map((option) => (
                                                    <option key={option.nombre} value={option.nombre}>{option.nombre}</option>
                                                ))}
                                            </Select>
                                            <Text color="red" mt={1}>{validationErrors.tipoDestino}</Text>
                                        </FormControl>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
                                        <Button variant='ghost' onClick={handleSaveDestino}>Guardar Destino</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </>
                    </ButtonGroup>
                    
                    <InputGroup mt={20} mb={-20} width={"auto"}>
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
                <TableManagePlanes data={currentData} header1={"Plan"} header2={"Fecha Inicio"} header3={"Fecha Fin"} header4={"Valor Total"} header5={"Numero de personas"} />
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
                    Página {currentPage + 1} de {totalPages}, mostrando {currentData.length} de {planes.length} planes
                </Text>
            </Box>
        </Box>
    );
}
