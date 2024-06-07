import { Box, Flex, Text, Icon } from "@chakra-ui/react";

function DashboardCard({ icon,title, value }) {
  return (
    <Box
      w="full"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minH="70px"
      maxW={"260px"}
      py={5}
      px={3}
      borderRadius="8px"
      borderWidth="2px"
      borderColor="rgba(0,0,0,0.10)"
      boxShadow="lg"
      _hover={{ transform: "scale(1.02)" }}
      m={4} // Agrega un margen alrededor de la tarjeta
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Icon as={icon} w={10} h={10} /> 
        <Flex flexDirection="column" alignItems="end">
          <Text fontSize="xl" fontWeight="semibold">{title}</Text>
          <Text fontSize="2xl" fontWeight="bold" color="teal.500">{value}</Text>
        </Flex>
      </Flex>
    </Box>
  );
}

export default DashboardCard;
