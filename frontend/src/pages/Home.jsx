import { useEffect } from 'react';
import { Box, SimpleGrid, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { useProductContext } from '../context/ProductContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Home = () => {
  const { products, loading, error, fetchProducts } = useProductContext();

  useEffect(() => {
    // Component yüklendiğinde ürünleri çek
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  if (loading) {
    return <LoadingSpinner text="Ürünler yükleniyor..." />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Text>{error}</Text>
      </Alert>
    );
  }

  return (
    <Box>
      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        Tüm Ürünler
      </Text>
      {products.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>Gösterilecek ürün bulunamadı.</Text>
      )}
    </Box>
  );
};

export default Home;