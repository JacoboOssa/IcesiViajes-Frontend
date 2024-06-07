import React, { useState, useEffect } from 'react';
import {
    Flex,
    Text,
    IconButton,
    Divider,
    Avatar,
    Heading
} from '@chakra-ui/react'
import {
    FiMenu,
    FiHome,
    FiLogOut 
} from 'react-icons/fi'
import{
    FaPenSquare ,
    FaUsers ,
    FaUsersCog
} from 'react-icons/fa'
import { GiCommercialAirplane } from "react-icons/gi";
import { IoIosStats } from 'react-icons/io';
import NavItem from './NavItem'
import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate


export default function Sidebar({roleName,username}) {
    const [navSize, changeNavSize] = useState("large")
    const { logout } = useAuthContext(); 
    const navigate = useNavigate(); // Para redireccionar al usuario
    const [activeItem, setActiveItem] = useState();
    const [role, setRole] = useState("");
    const [user, setUser] = useState("");

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

    const handleItemClick = (title, path) => {
        setActiveItem(title);
        navigate(path); // Redireccionar a la ruta específica
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent="space-between"
            position="sticky"
            top="0"
            height="100vh"
            overflowY="auto"
            width={navSize === "small" ? "75px" : "200px"}
            boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
            borderRadius={navSize === "small" ? "15px" : "30px"}
        >
            <Flex
                p="5%"
                flexDirection="column"
                alignItems={navSize === "small" ? "center" : "flex-start"}
                as="nav"
            >
                <IconButton
                    background="none"
                    mt={5}
                    _hover={{ background: 'none' }}
                    icon={<FiMenu />}
                    onClick={() => {
                        if (navSize === "small") {
                            changeNavSize("large");
                        } else {
                            changeNavSize("small");
                        }
                    }}
                />
                <NavItem
                    navSize={navSize}
                    icon={FiHome}
                    title="Inicio"
                    active={activeItem === "Inicio"}
                    onClick={() => handleItemClick("Inicio", "/home")}
                />
                <NavItem
                    navSize={navSize}
                    icon={FaPenSquare}
                    title="Paquetes"
                    active={activeItem === "Paquetes"}
                    onClick={() => handleItemClick("Paquetes", "/adminplanes")}
                />
                <NavItem
                    navSize={navSize}
                    icon={FaUsers}
                    title="Clientes"
                    active={activeItem === "Clientes"}
                    onClick={() => handleItemClick("Clientes", "/adminclientes")}
                />
                {roleName === "ADMIN" && (
                    <NavItem
                        key="usuarios"
                        navSize={navSize}
                        icon={FaUsersCog}
                        title="Usuarios"
                        active={activeItem === "Usuarios"}
                        onClick={() => handleItemClick("Usuarios", "/adminusuarios")}
                    />
                )}
                {roleName === "ADMIN" && (
                    <NavItem
                        navSize={navSize}
                        icon={IoIosStats}
                        title="Reportes"
                        active={activeItem === "Reportes"}
                        onClick={() => handleItemClick("Reportes", "/reporte")}
                    />
                )}
                
            </Flex>

            <Flex
                p="5%"
                flexDirection="column"
                alignItems={navSize === "small" ? "center" : "flex-start"}
            >
                <Divider display={navSize === "small" ? "none" : "flex"} />
                <IconButton
                    mt={2}
                    icon={<FiLogOut />}
                    onClick={() => {
                        logout();
                    }}
                />
                <Flex mt={4} align="center">
                    <Avatar size="sm" src="avatar-1.jpg" />
                    <Flex flexDir="column" ml={4} display={navSize === "small" ? "none" : "flex"}>
                        <Heading as="h3" size="sm">
                            {user}
                        </Heading>
                        <Text color="gray">{role}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
