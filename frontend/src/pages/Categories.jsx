// frontend/src/pages/Categories.jsx
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  VStack,
  Icon,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaTags, FaSearch } from 'react-icons/fa';
import { useProductContext } from '../context/ProductContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

// Her bir kategori kartını temsil eden bileşen
const CategoryCard = ({ category }) => {
  return (
    <Box
      as={RouterLink}
      to={`/category/${category._id}`}
      p={6}
      bg={{ base: 'white', _dark: { bg: 'gray.800' } }}
      borderRadius="xl"
      boxShadow="lg"
      transition="all 0.3s"
      position="relative" // Badge konumlandırması için
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '2xl',
        bg: { base: 'gray.50', _dark: { bg: 'gray.700' } },
      }}
    >
      <VStack spacing={4} align="center">
        <Icon as={FaTags} w={12} h={12} color="teal.400" />
        <Heading as="h3" size="md" textAlign="center" noOfLines={2}>
          {category.name}
        </Heading>
      </VStack>
      <Badge
        colorScheme="teal"
        variant="solid"
        position="absolute"
        top="1rem"
        right="1rem"
        borderRadius="full"
        px={3}
        py={1}
      >
        {category.productCount} Ürün
      </Badge>
    </Box>
  );
};

const Categories = () => {
  const { categories, loading, fetchCategories } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      return categories;
    }
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const popularCategories = useMemo(() => {
    // Backend zaten sıralı gönderiyor, ilk 4'ünü alalım.
    return categories.slice(0, 4);
  }, [categories]);

  if (loading && categories.length === 0) {
    return <LoadingSpinner text="Kategoriler yükleniyor..." />;
  }

  return (
    <Box>
      <VStack spacing={4} mb={10} align="center">
        <Heading as="h1" size="2xl">
          Tüm Kategoriler
        </Heading>
        <Text fontSize="lg" color={{ base: 'gray.600', _dark: { color: 'gray.400' } }}>
          Aradığınızı bulmak için kategorilere göz atın veya arama yapın.
        </Text>
        <InputGroup maxW="lg">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="full"
            boxShadow="md"
          />
        </InputGroup>
      </VStack>

      {/* Popüler Kategoriler Bölümü */}
      {popularCategories.length > 0 && !searchTerm && (
        <Box mb={12}>
            <Heading size="lg" mb={6}>Popüler Kategoriler</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                {popularCategories.map((category) => (
                    <CategoryCard key={`pop-${category._id}`} category={category} />
                ))}
            </SimpleGrid>
            <Divider my={10} />
        </Box>
      )}

      {/* Tüm Kategoriler (Filtrelenmiş) */}
      <Heading size="lg" mb={6}>
        {searchTerm ? 'Arama Sonuçları' : 'Tüm Kategoriler'}
      </Heading>
      {filteredCategories.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
          {filteredCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>
          {searchTerm
            ? 'Aramanızla eşleşen kategori bulunamadı.'
            : 'Gösterilecek kategori yok.'}
        </Text>
      )}
    </Box>
  );
};

export default Categories;