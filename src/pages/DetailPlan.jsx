import React, { useState,useEffect } from 'react';
import Sidebar from '../components/SideBar';
import Detail from '../components/Detail';
import { Box,useColorModeValue,Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import instance from "../axios.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


export default function DetailPlan(){
    const [role, setRole] = useState("");
    const [user, setUser] = useState("");
    const [planDetails, setPlanDetails] = useState([]); // Estado para almacenar los detalles del plan
    const { planId } = useParams(); // Obtener el planId de los parámetros de la URL

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const name = decoded.sub;
        setUser(name);
        const role = decoded.Rol[0].authority;
        setRole(role);
      }

      // Hacer la solicitud al backend para obtener los detalles del plan
      const fetchPlanDetails = async () => {
        try {
          const response = await axios.get(instance.getUri()+"/detalleplan/consultarporidplan/"+planId);
          setPlanDetails(response.data); // Actualizar el estado con los detalles del plan
        } catch (error) {
          console.error("Error fetching plan details:", error);
        }
      };
  
      fetchPlanDetails();
    }, [planId]);

    

      
    return(
      <Flex>
        <Sidebar roleName={role} username={user} />
        <Box flex="1">
          {planDetails && <Detail planDetails={planDetails} />}
        </Box>
      </Flex>
    )
}