import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import * as Yup from 'yup';
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
  Text,
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
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  ListItem,
  UnorderedList,
  Icon,
  useDisclosure
} from '@chakra-ui/react';
import { CiImageOn } from "react-icons/ci";
import {jwtDecode} from "jwt-decode";
import instance from "../axios.js";
import axios from 'axios';

const CrearPlan = () => {
    const [codigoPlan, setCodigoPlan] = useState("");
    const [descripcionPlan, setDescripcionPlan] = useState("");
    const [nombrePlan, setNombrePlan] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState();
    const [fechaInicio, setFechaInicio] = useState();
    const [fechaFin, setFechaFin] = useState();
    const [valor, setValor] = useState();
    const [role, setRole] = useState("");
    const [user, setUser] = useState("");    
    const [usuario, setUsuario] = useState({});
    const [planId, setPlanId] = useState(null);

    const [destinos, setDestinos] = useState([]);
    const [selectedDestino, setSelectedDestino] = useState("");
    const [alimentacion, setAlimentacion] = useState(false);
    const [hospedaje, setHospedaje] = useState(false);
    const [transporte, setTransporte] = useState(false);
    const [traslados, setTraslados] = useState(false);
    const [cantidadNoches, setCantidadNoches] = useState(0);
    const [cantidadDias, setCantidadDias] = useState(0);

    const validationSchema = Yup.object().shape({
        codigoPlan: Yup.string().required('El código del plan es obligatorio'),
        descripcionPlan: Yup.string().required('La descripción del plan es obligatoria'),
        nombrePlan: Yup.string().required('El nombre del plan es obligatorio'),
        cantidadPersonas: Yup.number().required('La cantidad de personas es obligatoria').min(1, 'Debe ser mínimo 1 persona'),
        fechaInicio: Yup.date().required('La fecha de inicio del viaje es obligatoria').min(new Date(), 'La fecha debe ser mayor o igual a la actual'),
        fechaFin: Yup.date().required('La fecha de fin del viaje es obligatoria').min(Yup.ref('fechaInicio'), 'La fecha de fin debe ser posterior a la de inicio'),
        valor: Yup.number().required('El valor total es obligatorio').min(1, 'El valor total debe ser mínimo 1'),
      });
      

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

    const steps = [
        { title: 'Primero', description: 'Agregar Plan' },
        { title: 'Segundo', description: 'Agregar Detalle Plan' },
        { title: 'Tercera', description: 'Agregar Imágenes' },
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
            case 2:
                return <Form3 planId={planId} />;
            default:
                return null;
        }
    };

    const handleNextStep = async () => {
        if (activeStep === 0) {
            await handleSavePlan();
        } else if (activeStep === 1) {
            await handleSaveDetallePlan();
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

    const handleSavePlan = async () => {
        try {
            // Validar los datos con Yup
            await validationSchema.validate({
                codigoPlan,
                descripcionPlan,
                nombrePlan,
                cantidadPersonas,
                fechaInicio,
                fechaFin,
                valor,
            }, { abortEarly: false });
    
            // Si la validación es exitosa, continuar con la lógica para guardar el plan
            const searchedUser = await searchUser();
            if (!searchedUser) {
                console.error("Usuario no encontrado.");
                return;
            }
    
            const newPlan = {
                codigo: codigoPlan,
                descripcionSolicitud: descripcionPlan,
                nombre: nombrePlan,
                cantidadPersonas: cantidadPersonas,
                fechaSolicitud: new Date(),
                fechaInicioViaje: fechaInicio,
                fechaFinViaje: fechaFin,
                valorTotal: valor,
                fechaCreacion: new Date(),
                usuCreador: user,
                estado: "A",
                usuario: searchedUser
            };
    
            const response = await axios.post(instance.getUri() + "/plan/crear", newPlan);
            setPlanId(response.data.idPlan); // Set the plan ID from the created plan
            console.log(planId);
        } catch (error) {
            // Si hay errores de validación, manejarlos aquí
            if (error.name === 'ValidationError') {
                // Puedes acceder a los errores de validación de esta manera:
                console.log(error.errors);
            } else {
                console.error("Error creando plan:", error);
            }
        }
    };

    

    const handleSaveDetallePlan = async () => {
        console.log(selectedDestino)
        try {
            const newDetallePlan = {
                alimentacion: alimentacion ? 's' : 'n',
                hospedaje: hospedaje ? 's' : 'n',
                transporte: transporte ? 's' : 'n',
                traslados: traslados ? 's' : 'n',
                cantidadNoches: cantidadNoches,
                cantidadDias: cantidadDias,
                idDest: selectedDestino,
                idPlan: planId,
                fechaCreacion: new Date(),
                usuCreador: user,
                estado: "A",
            };
            await axios.post(instance.getUri() + "/detalleplan/crear", newDetallePlan);
        } catch (error) {
            console.error("Error creando detalle del plan:", error);
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
                            <Button colorScheme="blue" ml={4}>Guardar</Button>
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

const Form3 = ({planId}) => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleDrop = (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      setImages([...images, ...files]);
    };
  
    const handleFileSelect = (e) => {
      const files = Array.from(e.target.files);
      setImages([...images, ...files]);
    };
  
    const removeImage = (index) => {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
      setModalIsOpen(false); // Cerrar el modal al eliminar la imagen
    };
  
    const handleSaveImages = async () => {
        try {
            const formData = new FormData();
            // Agregar el ID del plan al FormData (fuera del bucle forEach)
            formData.append('planId', planId);
            // Agregar todas las imágenes al FormData
            images.forEach((image) => formData.append('multipartFile', image));

            // Llamar al backend para subir las imágenes
            const response = await axios.post(instance.getUri() + '/cloudinary/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Imágenes subidas correctamente:', response.data);
        } catch (error) {
            console.error('Error al subir imágenes:', error);
        }
    };
  
    return (
        <Box
            border="2px dashed #ccc"
            borderRadius="8px"
            padding="20px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            mt={10}
        >
            <Text mb={2}>Arrastra y suelta imágenes aquí</Text>
            <Text mb={2}>O selecciona archivos</Text>
            <Input
                type="file"
                onChange={handleFileSelect}
                multiple
                display="none"
            />
            <Button onClick={() => document.querySelector('input[type="file"]').click()} mb={2}>
                Seleccionar archivos
            </Button>
            <Box>
                {images.map((image, index) => (
                    <Box key={index} m={2} position="relative">
                        <img
                            src={URL.createObjectURL(image)}
                            alt={`Imagen ${index}`}
                            style={{ width: '100px', height: 'auto' }}
                        />
                        <Button
                            onClick={() => removeImage(index)}
                            position="absolute"
                            top="5px"
                            right="5px"
                            colorScheme="red"
                            size="sm"
                        >
                            Eliminar
                        </Button>
                    </Box>
                ))}
            </Box>
            <Button onClick={handleSaveImages}>Guardar imágenes</Button>
        </Box>
    );
};

export default CrearPlan;
