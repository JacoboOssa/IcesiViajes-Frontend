import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepSeparator,
  StepTitle,
  StepDescription,
  useSteps,
  Checkbox,
  Select
} from '@chakra-ui/react';
import {jwtDecode} from "jwt-decode";
import instance from "../axios.js";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/SideBar';

const ActualizarPlanes = () => {
    const [codigoPlan, setCodigoPlan] = useState("");
    const [descripcionPlan, setDescripcionPlan] = useState("");
    const [nombrePlan, setNombrePlan] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState();
    const [fechaInicio, setFechaInicio] = useState();
    const [fechaFin, setFechaFin] = useState();
    const [valor, setValor] = useState();
    const [user, setUser] = useState("");
    const [role, setRole] = useState("");
    const [planId, setPlanId] = useState(null);
    const [idDepl,setIdDepl] = useState(null)

    const [destinos, setDestinos] = useState([]);
    const [selectedDestino, setSelectedDestino] = useState("");
    const [alimentacion, setAlimentacion] = useState(false);
    const [hospedaje, setHospedaje] = useState(false);
    const [transporte, setTransporte] = useState(false);
    const [traslados, setTraslados] = useState(false);
    const [cantidadNoches, setCantidadNoches] = useState(0);
    const [cantidadDias, setCantidadDias] = useState(0);
    const { idPlan } = useParams(); 

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
        const fetchDestinos = async () => {
            try {
                const response = await axios.get(instance.getUri() + "/destino/consultarNombre");
                setDestinos(response.data);
            } catch (error) {
                console.error("Error fetching destinos:", error);
            }
        };
        fetchDestinos();
    }, []);

    useEffect(() => {
        const fetchPlanData = async () => {
            try {
                const response = await axios.get(instance.getUri() + "/plan/consultarid/" + idPlan);
                const plan = response.data;
                setCodigoPlan(plan.codigo);
                setDescripcionPlan(plan.descripcionSolicitud);
                setNombrePlan(plan.nombre);
                setCantidadPersonas(plan.cantidadPersonas);
                setFechaInicio(formatDate(plan.fechaInicioViaje));
                setFechaFin(formatDate(plan.fechaFinViaje));
                setValor(plan.valorTotal);
                setPlanId(plan.idPlan);

                const detalleResponse = await axios.get(instance.getUri() + "/detalleplan/consultarporidplan/" +idPlan);
                const detallePlan = detalleResponse.data;
                setIdDepl(detallePlan.idDepl);
                setAlimentacion(detallePlan.alimentacion === 's');
                setHospedaje(detallePlan.hospedaje === 's');
                setTransporte(detallePlan.transporte === 's');
                setTraslados(detallePlan.traslados === 's');
                setCantidadNoches(detallePlan.cantidadNoches);
                setCantidadDias(detallePlan.cantidadDias);
                setSelectedDestino(detallePlan.idDest);
            } catch (error) {
                console.error("Error fetching plan data:", error);
            }
        };

        fetchPlanData();
    }, [idPlan]);

    const steps = [
        { title: 'Primero', description: 'Editar Plan' },
        { title: 'Segundo', description: 'Editar Detalle Plan' },
    ];

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <Form1 
                    codigoPlan={codigoPlan}
                    setCodigoPlan={setCodigoPlan}
                    descripcionPlan={descripcionPlan}
                    setDescripcionPlan={setDescripcionPlan}
                    nombrePlan={nombrePlan}
                    setNombrePlan={setNombrePlan}
                    cantidadPersonas={cantidadPersonas}
                    setCantidadPersonas={setCantidadPersonas}
                    fechaInicio={fechaInicio}
                    setFechaInicio={setFechaInicio}
                    fechaFin={fechaFin}
                    setFechaFin={setFechaFin}
                    valor={valor}
                    setValor={setValor}/>;
            case 1:
                return <Form2 
                    alimentacion={alimentacion}
                    setAlimentacion={setAlimentacion}
                    hospedaje={hospedaje}
                    setHospedaje={setHospedaje}
                    transporte={transporte}
                    setTransporte={setTransporte}
                    traslados={traslados}
                    setTraslados={setTraslados}
                    cantidadNoches={cantidadNoches}
                    setCantidadNoches={setCantidadNoches}
                    cantidadDias={cantidadDias}
                    setCantidadDias={setCantidadDias}
                    destinos={destinos}
                    selectedDestino={selectedDestino}
                    setSelectedDestino={setSelectedDestino}
                    planId={planId} />;
            default:
                return null;
        }
    };

    const handleNextStep = async () => {
        if (activeStep === 0) {
            await handleUpdatePlan();
        } else if (activeStep === 1) {
        }
        setActiveStep(activeStep + 1);
    };

    const handlePrevStep = () => {
        setActiveStep(activeStep - 1);
    };

    const searchUser = async () => {
        try {
            const response = await axios.get(`${instance.getUri()}/usuario/buscar`, {
                params: { login: "darpa" }
            });
            return response.data;
        } catch (error) {
            console.error("Error searching user:", error);
        }
    };

    const handleUpdatePlan = async () => {
        try {
            const searchedUser = await searchUser();
            if (!searchedUser) {
                console.error("Usuario no encontrado.");
                return;
            }
    
            const updatedPlan = {
                idPlan: planId,
                codigo: codigoPlan,
                descripcionSolicitud: descripcionPlan,
                nombre: nombrePlan,
                cantidadPersonas: cantidadPersonas,
                fechaInicioViaje: fechaInicio,
                fechaFinViaje: fechaFin,
                valorTotal: valor,
                fechaCreacion: new Date(),
                fechaModificacion: new Date(),
                usuModificador:user,
                usuCreador: user,
                estado: "A",
                usuario: searchedUser
            };
    
            await axios.post(instance.getUri() + "/plan/actualizar", updatedPlan);
        } catch (error) {
            console.error("Error actualizando plan:", error);
        }
    };
    
    const handleUpdateDetallePlan = async () => {
        try {
            const updatedDetallePlan = {
                idDepl: idDepl,
                alimentacion: alimentacion ? 's' : 'n',
                hospedaje: hospedaje ? 's' : 'n',
                transporte: transporte ? 's' : 'n',
                traslados: traslados ? 's' : 'n',
                cantidadNoches: cantidadNoches,
                cantidadDias: cantidadDias,
                idDest: selectedDestino,
                idPlan: planId,
                fechaCreacion: new Date(),
                fechaModificacion: new Date(),
                usuModificador:user,
                usuCreador: user,
                estado: "A",
            };
            await axios.post(instance.getUri() + "/detalleplan/actualizar", updatedDetallePlan);
        } catch (error) {
            console.error("Error actualizando detalle del plan:", error);
        }
    };

    return (
        <Flex>
        <Sidebar roleName={role} username={user} />
        <Box margin="0 auto" mt={12} mb={20} width="80%">
                <Stepper index={activeStep} size="lg">
                    {steps.map((step, index) => (
                        <Step key={index} onClick={() => setActiveStep(index)}>
                            <StepIndicator>
                                <StepStatus
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
                                />
                            </StepIndicator>
                            <Box flexShrink='0'>
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
                <Box>
                    {renderStepContent()}
                    <Flex justifyContent="flex-end" mt={4}>
                        {activeStep > 0 && (
                            <Button onClick={handlePrevStep} ml={4}>Anterior</Button>
                        )}
                        {activeStep < steps.length - 1 && (
                            <Button colorScheme="blue" onClick={handleNextStep} ml={4}>Siguiente</Button>
                        )}
                        {activeStep === steps.length - 1 && (
                            <Button colorScheme="blue" ml={4}onClick={handleUpdateDetallePlan}>Guardar</Button>
                        )}
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

const Form1 = ({
    codigoPlan,
    setCodigoPlan,
    descripcionPlan,
    setDescripcionPlan,
    nombrePlan,
    setNombrePlan,
    cantidadPersonas,
    setCantidadPersonas,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    valor,
    setValor
}) => {
    return (
        <Box>
      <Flex mb={4} mt={10}>
        <FormControl mr={4}>
          <FormLabel>Código del Plan</FormLabel>
          <Input placeholder="Código del Plan" 
          value={codigoPlan}
          onChange={(e) => setCodigoPlan(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Nombre del Plan</FormLabel>
          <Input placeholder="Nombre del Plan" 
          value={nombrePlan}
          onChange={(e) => setNombrePlan(e.target.value)}
          />
        </FormControl>
      </Flex>
      <FormControl mb={4}>
        <FormLabel>Cantidad de Personas</FormLabel>
        <NumberInput defaultValue={0} min={1} value={cantidadPersonas} onChange={setCantidadPersonas}>
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <Flex mb={4}>
        <FormControl mr={4}>
          <FormLabel>Fecha Inicio Viaje</FormLabel>
          <Input type="date" 
          value={fechaInicio} 
          onChange={(e) => setFechaInicio(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Fecha Fin Viaje</FormLabel>
          <Input type="date" 
          value={fechaFin} 
          onChange={(e) => setFechaFin(e.target.value)}
          />
        </FormControl>
      </Flex>
      <FormControl mb={4}>
        <FormLabel>Valor Total</FormLabel>
        <Input type="number" placeholder="Valor Total" 
        value={valor} 
        onChange={(e) => setValor(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Descripción del Plan</FormLabel>
        <Textarea placeholder="Descripción del Plan" 
        value={descripcionPlan} 
        onChange={(e) => setDescripcionPlan(e.target.value)}
        />
      </FormControl>
    </Box>
    );
};

const Form2 = ({
    alimentacion,
    setAlimentacion,
    hospedaje,
    setHospedaje,
    transporte,
    setTransporte,
    traslados,
    setTraslados,
    cantidadNoches,
    setCantidadNoches,
    cantidadDias,
    setCantidadDias,
    destinos,
    selectedDestino,
    setSelectedDestino,
    planId
}) => {
    return (
        <Box>
        <Flex mb={4} mt={10} alignItems="center">
          <FormLabel mb={0} mr={20}>Incluye:</FormLabel>
          <Checkbox mr={20} isChecked={alimentacion} onChange={(e) => setAlimentacion(e.target.checked)}>Alimentación</Checkbox>
          <Checkbox mr={20} isChecked={hospedaje} onChange={(e) => setHospedaje(e.target.checked)}>Hospedaje</Checkbox>
          <Checkbox mr={20} isChecked={transporte} onChange={(e) => setTransporte(e.target.checked)}>Transporte</Checkbox>
          <Checkbox mr={20} isChecked={traslados} onChange={(e) => setTraslados(e.target.checked)}>Traslados</Checkbox>
        </Flex>
        <Flex mb={4}>
          <FormControl mr={4}>
            <FormLabel>Cantidad de Noches</FormLabel>
              <NumberInput value={cantidadNoches} onChange={(valueString) => setCantidadNoches(parseInt(valueString))}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>Cantidad de Días</FormLabel>
              <NumberInput value={cantidadDias} onChange={(valueString) => setCantidadDias(parseInt(valueString))}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </Flex>
        <FormControl mb={4}>
                 <FormLabel>Destino</FormLabel>
                 <Select placeholder="Seleccione un destino" value={selectedDestino} onChange={(e) => setSelectedDestino(e.target.value)}>
                     {destinos.map((destino) => (
                        <option key={destino.idDest} value={destino.idDest}>{destino.nombre}</option>
                     ))}
                 </Select>
        </FormControl>
      {/* 
      {selectedDestino && (
        <Box>
          <Text mt={4}>Destino seleccionado: {selectedDestino}</Text>
        </Box>
      )}*/}
      </Box>
    );
};


export default ActualizarPlanes;