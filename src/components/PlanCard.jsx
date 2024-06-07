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
  CardFooter
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate


export default function PlanCard({ name, destination, initialDate,endDate, people, price, imageSrc, idPlan }) {
  const navigate = useNavigate(); 


  const handleViewPlan = (planId) => {
    navigate(`/plan/${planId}`);
  };

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='elevated'
      size={"sm"}
      mt={10}

    >
      <Image
        borderRadius={4}
        objectFit='cover'
        h="240px" // Ajusta la altura de la imagen según sea necesario
        w="230px" // Ancho de la imagen
        src={imageSrc}
      />

      <Stack flex="1" p={4}>
        <CardBody>
          <Heading size='md'>{name}</Heading>
          <Stack flexDirection={"row"}>
            <Text mt={3} as={"b"}>Destino:</Text>
            <Text mt={3}>{destination}</Text>
          </Stack>
          <Stack flexDirection={"row"}>
          <Text mt={3} as={"b"}>Fecha:</Text>
          <Text mt={3}>{initialDate}</Text> <Text mt={3} as={"b"}>-</Text><Text mt={3}>{endDate}</Text>
          </Stack>
        </CardBody>

        <CardFooter justify="space-between" display="flex">
          <Stack flexDirection="row">
            <Button variant='solid' colorScheme='blue' onClick={() => handleViewPlan(idPlan)}>
              Ver Plan
            </Button>
          </Stack>
          <Stack flexDirection="column">
          <Text ml={300} mt={-2} as={"i"}>{people} personas</Text>

          <Text ml={300} as={"b"} align={"center"}>{price}</Text>

          </Stack>
        </CardFooter>
      </Stack>
    </Card>
  );
}
