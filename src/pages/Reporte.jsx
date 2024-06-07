import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import { Box, Flex,Text,Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import DashboardCard from "../components/DashboardCard.jsx";
import { MdOutlineQueryStats } from "react-icons/md";
import { FaMoneyCheckAlt } from "react-icons/fa";
import instance from "../axios.js";
import axios from "axios";
import {
    FaPenSquare,
    FaUsers,
} from 'react-icons/fa'
import { IoAirplane } from "react-icons/io5";

const Reporte = () => {
    const [numberDestinations, setNumberDestinations] = useState(0);
    const [numberClients, setNumberClients] = useState(0);
    const [numberPlanes, setNumberPlanes] = useState(0);
    const [createdPlanes, setCreatedPlanes] = useState([]);
    const [valorTotal, setValorTotal] = useState([]);
    const [ventaTotal, setVentaTotal] = useState([]);

    useEffect(() => {
        const fetchDestinos = async () => {
            try {
                const response = await axios.get(instance.getUri() + "/destino/contar");
                setNumberDestinations(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchDestinos();

    }, []);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get(instance.getUri() + "/cliente/contar");
                setNumberClients(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchClientes();

    }, []);

    useEffect(() => {
        const fetchPlanes = async () => {
            try {
                const response = await axios.get(instance.getUri() + "/plan/contar");
                setNumberPlanes(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchPlanes();

    }, []);

    useEffect(() => {
        const fetchCreatedPlans = async () => {
            try {
                const response = await axios.get(instance.getUri() + "/plan/consultarpotencial");
                setCreatedPlanes(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchCreatedPlans();

    }, []);

    useEffect(() => {
        const fetchValorPotencial = async () => {
            try {
                const response = await axios.get(instance.getUri() + "/plan/consultartotalventas");
                setValorTotal(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchValorPotencial();

    }, []);

    useEffect(() => {
        const fetchVentaReal = async () => {
            try {
                const response = await axios.get(instance.getUri() + "/plan/consultarventasreales");
                setVentaTotal(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchVentaReal();

    }, []);

    return (
        <Box display="flex">
            <Sidebar />
            <Flex
                flexDirection="column"
                flex="1"
                ml="5%"
                mr="5%"
            >
                <Flex p={10}>
                    <DashboardCard
                        icon={FaPenSquare}
                        title="Planes"
                        value={numberPlanes}
                    />
                    <DashboardCard
                        icon={FaUsers}
                        title="Clientes"
                        value={numberClients}
                    />
                    <DashboardCard
                        icon={IoAirplane}
                        title="Destinos"
                        value={numberDestinations}
                    />
                </Flex>
                <Flex justifyContent="center" mb="4">
                    <DashboardCard
                        icon={MdOutlineQueryStats}
                        title="Potencial Ventas"
                        value={valorTotal.total_ventas}
                    />
                    <DashboardCard
                        icon={FaMoneyCheckAlt}
                        title="Ventas Reales"
                        value={ventaTotal.total_ventas}
                    />
                </Flex>
                <Text fontSize="xl" fontWeight="bold" mb="4">Resumen por Asesor</Text>
                <Table variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>Nombre del Asesor</Th>
                            <Th>Planes Creados</Th>
                            <Th>Ventas Potenciales</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {createdPlanes.map((asesor, index) => (
                            <Tr key={index}>
                                <Td>{asesor.usuCreador}</Td>
                                <Td>{asesor.cantidad_planes}</Td>
                                <Td>{asesor.potencial_ventas}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Flex>
        </Box>
    );
    
}

export default Reporte;
