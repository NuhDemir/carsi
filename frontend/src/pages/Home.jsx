// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, SimpleGrid, Text, Alert, AlertIcon, Heading, VStack, Flex } from '@chakra-ui/react';
import { useProductContext } from '../context/ProductContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Home = () => {
  // 1. URL'den categoryId'yi alıyoruz. Eğer yoksa undefined olacak.
  const { categoryId } = useParams();
  const { 
    products, 
    categories,
    loading, 
    error, 
    fetchProducts, 
    filterByCategory,
    fetchCategories // Kategori adını bulmak için kategorilere ihtiyacımız var
  } = useProductContext();

  // 2. Sayfa başlığını tutmak için bir state oluşturuyoruz.
  const [pageTitle, setPageTitle] = useState('Tüm Ürünler');
  const [pageDescription, setPageDescription] = useState('');

  // 3. Kategori verilerini çekmek için (eğer henüz çekilmediyse)
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  // 4. categoryId değiştiğinde veya bileşen ilk yüklendiğinde çalışacak ana effect
  useEffect(() => {
    if (categoryId) {
      // Eğer bir kategori ID'si varsa, o kategoriye göre filtrele
      filterByCategory(categoryId);
      
      // Başlığı güncellemek için ilgili kategoriyi bul
      const category = categories.find(cat => cat._id === categoryId);
      if (category) {
        setPageTitle(category.name);
        setPageDescription(`${category.productCount} ürün bulundu`);
      } else {
        setPageTitle('Kategori'); // Kategori yüklenene kadar geçici başlık
        setPageDescription('');
      }
    } else {
      // Eğer kategori ID'si yoksa, tüm ürünleri getir
      fetchProducts();
      setPageTitle('Tüm Ürünler');
      setPageDescription(''); // Ana sayfada ürün sayısını göstermeyebiliriz veya products.length kullanabiliriz
    }
    // Bağımlılıklar: categoryId değiştiğinde bu effect yeniden çalışmalı.
    // categories'i de ekliyoruz ki kategori bilgileri geldiğinde başlık güncellenebilsin.
  }, [categoryId, filterByCategory, fetchProducts, categories]);
  
  // products.length'i kullanarak ana sayfa açıklamasını güncelleyelim.
  useEffect(() => {
      if (!categoryId) {
          setPageDescription(`${products.length} ürün bulundu`);
      }
  }, [products.length, categoryId]);


  if (loading) {
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
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={{ base: 6, md: 8 }}
      >
        <VStack align="start" spacing={1}>
          {/* 5. Dinamik başlığı burada kullanıyoruz. */}
          <Heading as="h1" size="lg" fontWeight="semibold">
            {pageTitle}
          </Heading>
          {pageDescription && (
            <Text color={{ base: 'gray.600', _dark: { color: 'gray.400' } }}>
              {pageDescription}
            </Text>
          )}
        </VStack>
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
          Bu kategoride gösterilecek ürün bulunamadı.
        </Text>
      )}
    </Box>
  );
};

export default Home;