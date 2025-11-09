import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  Heading,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      as="footer"
      bg={{ base: "gray.50", _dark: "gray.900" }}
      borderTop="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      mt={12}
      py={10}
    >
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <VStack align="start">
            <Heading size="sm">Çarşı</Heading>
            <Text fontSize="sm">
              Kimse sizin hikayenizi (henüz) umursamıyor. Onlar ürün almak için
              oradalar.
            </Text>
          </VStack>

          <VStack align="start">
            <Heading size="sm">Hızlı Erişim</Heading>
            <ChakraLink as={RouterLink} to="/about">
              Hakkımızda
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/contact">
              İletişim
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/blog">
              Blog
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/faq">
              S.S.S.
            </ChakraLink>
          </VStack>

          <VStack align="start">
            <Heading size="sm">Müşteri Hizmetleri</Heading>
            <ChakraLink as={RouterLink} to="/faq">
              S.S.S.
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/contact">
              İletişim
            </ChakraLink>
          </VStack>

          <VStack align="start">
            <Heading size="sm">İçerik</Heading>
            <ChakraLink as={RouterLink} to="/blog">
              Blog
            </ChakraLink>
            <Text fontSize="sm" color="gray.500">
              İçerik pazarlaması ile trafik çekin; blogdan ürünlere bağlantılar
              verin.
            </Text>
          </VStack>
        </SimpleGrid>

        <Box mt={8} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} Çarşı. Tüm hakları saklıdır.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
