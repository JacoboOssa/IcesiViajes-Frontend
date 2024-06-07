import React from 'react';
import {
  Box,
  Image,
  Text,
  Stack,
  Card,
  CardBody,
  Divider,
  ButtonGroup,
  Button,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación


export default function TripCard({ imageSrc, name, planId }) {
  const cardShadowColor = useColorModeValue('gray.200', 'gray.700');
  const navigate = useNavigate(); // Obtenemos la función navigate de useNavigate


  const handleCardClick = () => {
    // Navegamos a la página de detalles del plan con el planId
    navigate(`/plan/${planId}`);
  };

  return (
    <Card
      maxW='sm'
      boxShadow={`0 4px 12px 0 ${cardShadowColor}`}
      borderRadius='xl'
      onClick={handleCardClick} // Añadimos el evento onClick
      cursor='pointer' // Cambiamos el cursor al hacer hover para indicar que es interactivo
    >
      <CardBody>
        <Image
          src={imageSrc}
          alt={name}
          borderRadius='lg'
          objectFit='cover'
          h='180px'
        />
        <Stack mt='4' spacing='5'>
          <Heading size='md'>{name}</Heading>
        </Stack>
      </CardBody>
    </Card>
  );
}
