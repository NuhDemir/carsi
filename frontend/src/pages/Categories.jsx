// src/pages/Categories.jsx
import { useState, useEffect, useMemo } from "react";
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
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiSearch, FiTag } from "react-icons/fi";
import { useProductContext } from "../context/ProductContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

// Kategori Kartı Bileşeni (Sayfa içinde veya ayrı bir component olarak tanımlanabilir)
const CategoryCard = ({ category }) => {
  return (
    <Box
      as={RouterLink}
      to={`/category/${category._id}`}
      p={6}
      bg={{ base: "white", _dark: "gray.800" }}
      borderRadius="xl"
      border="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      transition="all 0.2s ease-in-out"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "md",
        borderColor: { base: "blue.300", _dark: "blue.500" },
      }}
    >
      <VStack spacing={4}>
        <Icon
          as={FiTag}
          w={10}
          h={10}
          color={{ base: "blue.500", _dark: "blue.300" }}
        />
        <Heading as="h3" size="md" textAlign="center" noOfLines={2}>
          {category.name}
        </Heading>
        <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.400" }}>
          {category.productCount} ürün
        </Text>
      </VStack>
    </Box>
  );
};

const Categories = () => {
  const { categories, loading, fetchCategories } = useProductContext();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Sadece kategoriler boşsa yükle
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      return categories;
    }
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  if (loading && categories.length === 0) {
    return <LoadingSpinner text="Kategoriler yükleniyor..." />;
  }

  return (
    <Box>
      <VStack spacing={4} mb={10} align="center">
        <Heading as="h1" size="xl" fontWeight="semibold">
          Kategoriler
        </Heading>
        <Text
          fontSize="lg"
          color={{ base: "gray.600", _dark: "gray.400" }}
          textAlign="center"
        >
          İlginizi çeken kategoriyi bulun veya arama yapın.
        </Text>
        <InputGroup maxW="lg" size="lg">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="full"
            variant="filled"
          />
        </InputGroup>
      </VStack>

      {filteredCategories.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
          {filteredCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </SimpleGrid>
      ) : (
        <Text
          textAlign="center"
          py={20}
          color={{ base: "gray.600", _dark: "gray.400" }}
        >
          {searchTerm
            ? "Aramanızla eşleşen kategori bulunamadı."
            : "Gösterilecek kategori yok."}
        </Text>
      )}
    </Box>
  );
};

export default Categories;
