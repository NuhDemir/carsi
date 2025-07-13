// src/pages/Home.jsx
import { useEffect } from 'react';
import { Box, SimpleGrid, Text, Alert, AlertIcon, Heading, VStack, Flex, Button } from '@chakra-ui/react';
import { FiGrid, FiList } from 'react-icons/fi';
import { useProductContext } from '../context/ProductContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Home = () => {
  const { products, loading, error, fetchProducts } = useProductContext();

  useEffect(() => {
    // Component yüklendiğinde ve products boşsa ürünleri çek
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  if (loading && products.length === 0) {
    return <LoadingSpinner text="Ürünler yükleniyor..." />;
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <Text>{error}</Text>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Sayfa Başlığı ve Kontroller */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={{ base: 6, md: 8 }}
        wrap="wrap"
        gap={4}
      >
        <VStack align="start" spacing={1}>
          <Heading as="h1" size="lg" fontWeight="semibold">
            Tüm Ürünler
          </Heading>
          <Text color={{ base: 'gray.600', _dark: { color: 'gray.400' } }}>
            {products.length} ürün bulundu
          </Text>
        </VStack>
        {/* Opsiyonel: Grid/Liste görünümü butonu eklenebilir */}
        <Flex gap={2}>
            <Button leftIcon={<FiGrid />} variant="outline">Grid</Button>
            <Button leftIcon={<FiList />} variant="ghost">Liste</Button>
        </Flex>
      </Flex>

      {products.length > 0 ? (
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          spacing={{ base: 6, md: 8 }}
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>
      ) : (
        <Text
          textAlign="center"
          py={20}
          color={{ base: 'gray.600', _dark: { color: 'gray.400' } }}
        >
          Gösterilecek ürün bulunamadı.
        </Text>
      )}
    </Box>
  );
};

export default Home;