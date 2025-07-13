// src/pages/ProductDetail.jsx
import { useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Container, Stack, Text, Image, Flex, VStack, Button, Heading,
  SimpleGrid, Alert, AlertIcon, Breadcrumb, BreadcrumbItem,
  BreadcrumbLink, HStack, Tag, useToast
} from '@chakra-ui/react';
import { FiChevronRight, FiEdit, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useProductContext } from '../context/ProductContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentProduct, loading, error, fetchProduct, deleteProduct } = useProductContext();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  const handleDelete = async () => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      const success = await deleteProduct(id);
      if (success) {
        toast({
          title: 'Ürün Silindi',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      }
    }
  };

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
    return null; // Yükleme bitti ama ürün yoksa boş döneriz.
  }

  return (
    <Container maxW="container.xl" py={6}>
      <Breadcrumb spacing="8px" separator={<FiChevronRight color="gray.500" />}>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/">Ana Sayfa</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/categories">Kategoriler</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Text noOfLines={1}>{currentProduct.name}</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 8, md: 12 }}
      >
        <Flex>
          <Image
            rounded="xl"
            alt={currentProduct.name}
            src={currentProduct.image}
            fit="cover"
            align="center"
            w="100%"
            bg={{ base: 'gray.100', _dark: 'gray.700' }}
            boxShadow="lg"
          />
        </Flex>
        <VStack spacing={4} align="stretch">
          <Heading as="h1" fontWeight={600} fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}>
            {currentProduct.name}
          </Heading>
          
          <HStack>
            <Tag size="lg" variant="subtle" colorScheme="blue">
                {currentProduct.category.name}
            </Tag>
            {currentProduct.stock > 0 ? (
                <Tag size="lg" variant="subtle" colorScheme="green">Stokta</Tag>
            ) : (
                <Tag size="lg" variant="subtle" colorScheme="red">Tükendi</Tag>
            )}
          </HStack>

          <Text fontSize={{ base: '3xl', lg: '4xl' }} fontWeight="bold" color={{ base: 'blue.500', _dark: 'blue.300' }}>
            ₺{currentProduct.price.toFixed(2)}
          </Text>

          <VStack align="start" spacing={3} pt={4}>
             <Text fontSize="lg" fontWeight="semibold">Açıklama</Text>
             <Text color={{ base: 'gray.600', _dark: { color: 'gray.400' } }} fontSize="md">
                {currentProduct.description}
             </Text>
          </VStack>

          <Stack pt={6} spacing={4}>
            <Button
              leftIcon={<FiShoppingCart />}
              size="lg"
              colorScheme="blue"
              isDisabled={currentProduct.stock === 0}
            >
              Sepete Ekle
            </Button>
            <HStack>
              <Button leftIcon={<FiEdit />} flex={1} variant="outline">
                Düzenle
              </Button>
              <Button
                leftIcon={<FiTrash2 />}
                flex={1}
                variant="ghost"
                colorScheme="red"
                onClick={handleDelete}
              >
                Sil
              </Button>
            </HStack>
          </Stack>
        </VStack>
      </SimpleGrid>
    </Container>
  );
};

export default ProductDetail;