// frontend/src/pages/Create.jsx

import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Stack, // <<< EKSİK OLAN BUYDU, EKLENDİ
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Select,
  FormHelperText,
  Spinner,
  Center,
  Text,
} from '@chakra-ui/react';
import { useProductContext } from '../context/ProductContext.jsx';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
    stock: '',
  });

  const {
    createProduct,
    fetchCategories,
    categories,
    loading,
    error,
  } = useProductContext();
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
      navigate('/');
    }
  };

  return (
    <Box
      maxW="2xl"
      mx="auto"
      mt={10}
      p={8}
      // useColorModeValue yerine doğrudan stil objesi kullanıyoruz.
      // Chakra UI, _light ve _dark pseudo prop'larını destekler.
      bg={{ base: 'white', _dark: { bg: 'gray.700' } }}
      borderRadius="xl"
      boxShadow="lg"
    >
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading as="h1" size="xl">
          Yeni Ürün Ekle
        </Heading>
        
        <FormControl isRequired>
          <FormLabel>Ürün Adı</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Örn: Kablosuz Kulaklık"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Açıklama</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ürünün özelliklerini ve detaylarını yazın"
          />
        </FormControl>

        <Stack direction={{ base: 'column', md: 'row' }} w="full" spacing={4}>
          <FormControl isRequired>
            <FormLabel>Fiyat (₺)</FormLabel>
            <NumberInput 
              min={0}
              value={formData.price}
              onChange={(val) => handleNumberChange(val, 'price')}
            >
              <NumberInputField placeholder="Örn: 1500" name="price" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Stok Adedi</FormLabel>
            <NumberInput 
              min={0}
              value={formData.stock}
              onChange={(val) => handleNumberChange(val, 'stock')}
            >
              <NumberInputField placeholder="Örn: 50" name="stock" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Stack>

        <FormControl isRequired>
          <FormLabel>Kategori</FormLabel>
          {loading && categories.length === 0 ? (
            <Center p={4} borderWidth="1px" borderRadius="md" bg={{ base: 'gray.50', _dark: { bg: 'gray.800' } }}>
                <Spinner size="sm" mr={3} />
                <Text>Kategoriler yükleniyor...</Text>
            </Center>
          ) : (
            <Select
              name="category"
              placeholder="Bir kategori seçin"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          )}
          <FormHelperText>
            Eğer kategori listesi boşsa, önce backend'den bir kategori ekleyin.
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Görsel URL</FormLabel>
          <Input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://ornek.com/gorsel.jpg"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          size="lg"
          width="full"
          isLoading={loading}
          loadingText="Ekleniyor..."
          isDisabled={loading || categories.length === 0}
        >
          Ürünü Ekle
        </Button>

        {error && (
            <Text color="red.500" textAlign="center">{error}</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Create;