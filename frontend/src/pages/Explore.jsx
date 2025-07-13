// src/pages/Explore.jsx
import { useEffect, useMemo } from 'react';
import { Box, Heading, VStack, SimpleGrid, Text,Icon } from '@chakra-ui/react';
import { useProductContext } from '../context/ProductContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Link as RouterLink } from 'react-router-dom';
import { FiTag, FiArrowRight } from 'react-icons/fi';

// Categories.jsx'teki CategoryCard'a benzer bir kart
const MiniCategoryCard = ({ category }) => (
    <Box
      as={RouterLink}
      to={`/category/${category._id}`}
      p={4}
      bg={{ base: 'white', _dark: 'gray.800' }}
      borderRadius="lg"
      border="1px solid"
      borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
      display="flex"
      alignItems="center"
      gap={4}
      transition="all 0.2s"
      _hover={{ transform: 'translateX(4px)', bg: { base: 'gray.50', _dark: 'gray.700' } }}
    >
      <FiTag />
      <Text fontWeight="medium">{category.name}</Text>
      <Icon as={FiArrowRight} ml="auto" color="gray.400" />
    </Box>
)

const Explore = () => {
  const { products, categories, loading, fetchProducts, fetchCategories } = useProductContext();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (categories.length === 0) fetchCategories();
  }, [products.length, categories.length, fetchProducts, fetchCategories]);
  
  // Ürünleri eklenme tarihine göre sıralayıp en yeni 4 tanesini alalım
  // Not: Backend'den zaten sıralı geliyorsa bu adıma gerek yok.
  const newProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // createdAt alanı varsa
      .slice(0, 4);
  }, [products]);

  // En çok ürüne sahip 4 kategoriyi alalım
  const popularCategories = useMemo(() => {
      return [...categories]
        .sort((a,b) => b.productCount - a.productCount)
        .slice(0, 4);
  }, [categories]);

  if (loading && (products.length === 0 || categories.length === 0)) {
    return <LoadingSpinner text="Keşfet sayfası hazırlanıyor..." />;
  }

  return (
    <VStack spacing={12} align="stretch">
      {/* En Yeni Ürünler Bölümü */}
      <Box>
        <Heading as="h2" size="lg" mb={6}>
          Yeni Eklenenler
        </Heading>
        {newProducts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={8}>
            {newProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </SimpleGrid>
        ) : (
          <Text>Yeni ürün bulunamadı.</Text>
        )}
      </Box>

      {/* Popüler Kategoriler Bölümü */}
      <Box>
        <Heading as="h2" size="lg" mb={6}>
          Popüler Kategoriler
        </Heading>
        {popularCategories.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {popularCategories.map(category => (
                <MiniCategoryCard key={category._id} category={category} />
            ))}
          </SimpleGrid>
        ) : (
          <Text>Popüler kategori bulunamadı.</Text>
        )}
      </Box>
    </VStack>
  );
};

export default Explore;