import { Box, Heading, VStack, Text, List, ListItem } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.jsx";

const Orders = () => {
  const { user } = useAuth();

  return (
    <Box
      maxW="3xl"
      mx="auto"
      mt={8}
      p={6}
      bg={{ base: "white", _dark: "gray.800" }}
      borderRadius="xl"
      border="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
    >
      <VStack align="start" spacing={4}>
        <Heading size="lg">Siparişlerim</Heading>
        {!user && <Text>Görünüm için giriş yapmalısınız.</Text>}
        {user && (
          <>
            <Text>
              Henüz sipariş verisi yok — bu sayfa daha sonra entegre edilecek.
            </Text>
            <List spacing={3} mt={4}>
              <ListItem>Örnek sipariş yok</ListItem>
            </List>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default Orders;
