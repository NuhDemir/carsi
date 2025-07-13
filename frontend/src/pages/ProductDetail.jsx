// frontend/src/pages/ProductDetail.jsx

import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  List,
  ListItem,
  Badge,
  Alert,
  AlertIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useProductContext } from '../context/ProductContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const { currentProduct, loading, error, fetchProduct } = useProductContext();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  if (loading) {
    return <LoadingSpinner text="Ürün detayları yükleniyor..." />;
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={12}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      </Container>
    );
  }

  if (!currentProduct) {
    return (
      <Container maxW="container.lg" py={12}>
        <Text>Ürün bulunamadı veya yükleniyor...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={12}>
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/">Ana Sayfa</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/categories">Kategoriler</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">{currentProduct.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 8, md: 12 }}
      >
        <Flex>
          <Image
            rounded="xl"
            shadow="2xl"
            alt={currentProduct.name}
            src={currentProduct.image}
            fit="cover"
            align="center"
            w="100%"
            h={{ base: '100%', sm: '400px', lg: '500px' }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as="header">
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}
              color={{ base: 'gray.900', _dark: { color: 'gray.50' } }}
            >
              {currentProduct.name}
            </Heading>
            <Text
              color={{ base: 'teal.500', _dark: { color: 'teal.300' } }}
              fontWeight={700}
              fontSize="4xl"
              mt={4}
            >
              ₺{currentProduct.price.toFixed(2)}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction="column"
            divider={<StackDivider borderColor={{ base: 'gray.200', _dark: { borderColor: 'gray.600' } }} />}
          >
            <VStack spacing={{ base: 4, sm: 6 }} align="start">
              <Text
                color={{ base: 'gray.600', _dark: { color: 'gray.400' } }}
                fontSize="2xl"
                fontWeight="300"
              >
                Ürün Açıklaması
              </Text>
              <Text fontSize="lg" color={{ base: 'gray.600', _dark: { color: 'gray.400' } }}>
                {currentProduct.description}
              </Text>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={{ base: 'teal.500', _dark: { color: 'teal.300' } }}
                fontWeight="500"
                textTransform="uppercase"
                mb="4"
              >
                Ürün Detayları
              </Text>

              <List spacing={3}>
                <ListItem>
                  <Text as="span" fontWeight="bold">
                    Kategori:
                  </Text>{' '}
                  <Badge colorScheme="purple" fontSize="md" px={2} py={1} borderRadius="md">
                    {currentProduct.category.name}
                  </Badge>
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">
                    Stok Durumu:
                  </Text>{' '}
                  {currentProduct.stock > 0 ? (
                    <Badge colorScheme="green" fontSize="md" px={2} py={1} borderRadius="md">
                      {currentProduct.stock} Adet Stokta
                    </Badge>
                  ) : (
                    <Badge colorScheme="red" fontSize="md" px={2} py={1} borderRadius="md">
                      Stok Tükendi
                    </Badge>
                  )}
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">
                    Değerlendirme:
                  </Text>{' '}
                  {currentProduct.rating} / 5 ({currentProduct.numReviews} inceleme)
                </ListItem>
              </List>
            </Box>
          </Stack>

          <Button
            rounded="lg"
            size="lg"
            py="7"
            bg={{ base: 'gray.900', _dark: { bg: 'gray.50' } }}
            color={{ base: 'white', _dark: { color: 'gray.900' } }}
            textTransform="uppercase"
            _hover={{
              transform: 'translateY(2px)',
              boxShadow: 'lg',
            }}
            isDisabled={currentProduct.stock === 0}
          >
            Sepete Ekle
          </Button>

          <Stack direction="row" alignItems="center" justifyContent="center">
            <Button colorScheme="blue" variant="outline">
              Ürünü Düzenle
            </Button>
            <Button colorScheme="red" variant="solid">
              Ürünü Sil
            </Button>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default ProductDetail;