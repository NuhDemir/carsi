// src/pages/Explore.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Heading, VStack, SimpleGrid, Text, Grid, GridItem,
  Input, InputGroup, InputLeftElement, Select, Button,
  Flex, Stack, NumberInput, NumberInputField, Radio, RadioGroup, Icon
} from '@chakra-ui/react';
import { useProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard.jsx'; // Güncellenmiş ProductCard'ı import ettiğinizden emin olun
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { FiSearch, FiStar } from 'react-icons/fi';

const Explore = () => {
  const { products, categories, loading, fetchProducts, fetchCategories } = useProductContext();

  // Filtre durumları (state)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  // Sayfa yüklendiğinde verileri çek
  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (categories.length === 0) fetchCategories();
  }, [products.length, categories.length, fetchProducts, fetchCategories]);

  // Filtreleri sıfırlama fonksiyonu
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setMinRating(0);
    setSortBy('newest');
  }, []);

  // Ürünleri filtrele ve sırala
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Arama terimine göre filtrele
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Kategoriye göre filtrele
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category?._id === selectedCategory);
    }
    // Fiyat aralığına göre filtrele
    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= Number(priceRange.max));
    }
    // Puana göre filtrele
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    // Sırala
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.numReviews - a.numReviews);
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, minRating, sortBy]);

  // Yüklenme durumu
  if (loading && products.length === 0) {
    return <LoadingSpinner text="Ürünler yükleniyor..." />;
  }

  return (
    <Grid templateColumns={{ base: '1fr', lg: '280px 1fr' }} gap={10}>
      {/* --- Filtreleme Kenar Çubuğu --- */}
      <GridItem as="aside">
        <VStack as="form" spacing={6} align="stretch" position="sticky" top="80px">
          <Heading as="h3" size="md">Filtreler</Heading>
          
          {/* Arama */}
          <InputGroup>
            <InputLeftElement pointerEvents="none"><FiSearch color="gray.400" /></InputLeftElement>
            <Input placeholder="Ürün ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>

          {/* Kategori */}
          <Select placeholder="Tüm Kategoriler" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </Select>

          {/* Fiyat Aralığı */}
          <VStack align="stretch">
            <Text fontWeight="medium">Fiyat Aralığı (₺)</Text>
            <Flex gap={2}>
              <NumberInput value={priceRange.min} onChange={(val) => setPriceRange(p => ({ ...p, min: val }))}>
                <NumberInputField placeholder="Min" />
              </NumberInput>
              <NumberInput value={priceRange.max} onChange={(val) => setPriceRange(p => ({ ...p, max: val }))}>
                <NumberInputField placeholder="Max" />
              </NumberInput>
            </Flex>
          </VStack>

          {/* Değerlendirme */}
          <VStack align="stretch">
            <Text fontWeight="medium">Değerlendirme</Text>
            <RadioGroup onChange={setMinRating} value={minRating}>
              <Stack>
                {[4, 3, 2, 1].map(star => (
                  <Radio key={star} value={star}>
                    <Flex align="center">
                      {star} <Icon as={FiStar} color="yellow.400" ml={1} mr={1} /> ve üzeri
                    </Flex>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </VStack>

          <Button colorScheme="red" variant="outline" onClick={resetFilters}>Filtreleri Temizle</Button>
        </VStack>
      </GridItem>

      {/* --- Ürün Listesi --- */}
      <GridItem as="main">
        <VStack align="stretch" spacing={6}>
          {/* Başlık ve Sıralama */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading as="h2" size="lg">
              Keşfet
              <Text as="span" color="gray.500" fontWeight="normal" fontSize="lg" ml={2}>
                ({filteredAndSortedProducts.length} ürün)
              </Text>
            </Heading>
            <Select w="auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Yeni Eklenenler</option>
              <option value="popular">Popülerlik</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            </Select>
          </Flex>

          {/* Ürün Kartları */}
          {filteredAndSortedProducts.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8}>
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" p={10} borderWidth="1px" borderRadius="md" borderStyle="dashed">
              <Heading as="h4" size="md" mb={2}>Sonuç Bulunamadı</Heading>
              <Text color="gray.600">Lütfen filtrelerinizi değiştirerek tekrar deneyin.</Text>
            </Box>
          )}
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default Explore;