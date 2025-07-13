// src/pages/Create.jsx
import { useState, useEffect } from 'react';
import {
  Box, Heading, FormControl, FormLabel, Input, Button, VStack,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Textarea, Select, FormHelperText, Center,
  Text, SimpleGrid
} from '@chakra-ui/react';
import { FiPlusCircle } from 'react-icons/fi';
import { useProductContext } from '../context/ProductContext.jsx';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Create = () => {
  const [formData, setFormData] = useState({
    name: '', price: '', image: '', description: '', category: '', stock: '',
  });

  const { createProduct, fetchCategories, categories, loading, error } = useProductContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
    };
    const newProduct = await createProduct(productData);
    if (newProduct) {
      navigate(`/product/${newProduct._id}`); // Kullanıcıyı yeni oluşturduğu ürünün sayfasına yönlendirelim.
    }
  };

  return (
    <Box
      maxW="3xl" // Formu biraz daha genişlettik
      mx="auto"
      p={{ base: 6, md: 8 }}
      bg={{ base: 'white', _dark: 'gray.800' }}
      borderRadius="xl"
      border="1px solid"
      borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
    >
      <VStack as="form" onSubmit={handleSubmit} spacing={6}>
        <Heading as="h1" size="lg" fontWeight="semibold">
          Yeni Ürün Ekle
        </Heading>
        
        <FormControl isRequired>
          <FormLabel>Ürün Adı</FormLabel>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Örn: Akıllı Saat" variant="filled" size="lg"/>
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <FormControl isRequired>
            <FormLabel>Fiyat (₺)</FormLabel>
            <NumberInput min={0} value={formData.price} onChange={(val) => handleNumberChange(val, 'price')} variant="filled" size="lg">
              <NumberInputField placeholder="Örn: 1500" name="price" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Stok Adedi</FormLabel>
            <NumberInput min={0} value={formData.stock} onChange={(val) => handleNumberChange(val, 'stock')} variant="filled" size="lg">
              <NumberInputField placeholder="Örn: 50" name="stock" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </SimpleGrid>
        
        <FormControl isRequired>
          <FormLabel>Kategori</FormLabel>
          {loading && categories.length === 0 ? (
            <Center p={4} borderWidth="1px" borderRadius="md" bg={{ base: 'gray.50', _dark: { bg: 'gray.800' } }}>
                <LoadingSpinner text="Kategoriler yükleniyor..."/>
            </Center>
          ) : (
            <Select name="category" placeholder="Bir kategori seçin" value={formData.category} onChange={handleChange} variant="filled" size="lg">
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </Select>
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Açıklama</FormLabel>
          <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Ürünün özelliklerini ve detaylarını yazın" variant="filled" size="lg" rows={5}/>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Görsel URL</FormLabel>
          <Input name="image" value={formData.image} onChange={handleChange} placeholder="https://ornek.com/gorsel.jpg" variant="filled" size="lg"/>
          <FormHelperText>Lütfen geçerli ve erişilebilir bir görsel linki girin.</FormHelperText>
        </FormControl>

        {error && (
            <Text color="red.500" textAlign="center">{error}</Text>
        )}
        
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
          leftIcon={<FiPlusCircle />}
          isLoading={loading}
          loadingText="Ekleniyor..."
          isDisabled={loading || categories.length === 0}
        >
          Ürünü Oluştur
        </Button>
      </VStack>
    </Box>
  );
};

export default Create;