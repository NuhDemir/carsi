// src/components/LoadingSpinner.jsx
import { Box, Spinner, VStack, Text, useColorModeValue } from "@chakra-ui/react";

const LoadingSpinner = ({ text = "Yükleniyor..." }) => {
  // DEĞİŞİKLİK: Yeni tasarım sistemine uygun renkler kullanıldı.
  const spinnerColor = useColorModeValue("blue.500", "blue.300");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minH="200px" // Sayfanın ortasında daha iyi görünmesi için minH artırılabilir.
      w="full"
      py={10} // Dikey boşluk eklendi.
    >
      <VStack spacing={4}>
        <Spinner
          thickness="3px" // Daha zarif bir görünüm için inceltildi.
          speed="0.65s"
          emptyColor="gray.200"
          color={spinnerColor}
          size="lg" // Boyut biraz küçültüldü.
        />
        <Text color={textColor} fontSize="md">
          {text}
        </Text>
      </VStack>
    </Box>
  );
};

export default LoadingSpinner;