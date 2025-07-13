// src/components/LoadingSpinner.jsx
import { Box, Spinner, VStack, Text } from "@chakra-ui/react";

const LoadingSpinner = ({ text = "Yükleniyor..." }) => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minH="200px"
      w="full"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
        />
        <Text color="gray.600" fontSize="md">
          {text}
        </Text>
      </VStack>
    </Box>
  );
};

export default LoadingSpinner;