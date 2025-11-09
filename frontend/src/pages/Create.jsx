// src/pages/Create.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Select,
  FormHelperText,
  Center,
  Text,
  SimpleGrid,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";
import { useProductContext } from "../context/ProductContext.jsx";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    stock: "",
  });

  // Client-side alan hataları
  const [fieldErrors, setFieldErrors] = useState({});

  const { createProduct, fetchCategories, categories, loading, error } =
    useProductContext();
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

    // Basit client-side doğrulama
    const errors = {};
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = "Ürün adı en az 3 karakter olmalı.";
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = "Fiyat 0'dan büyük bir sayı olmalı.";
    }
    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      errors.stock = "Stok 0 veya daha büyük bir tam sayı olmalı.";
    }
    if (!formData.category) errors.category = "Lütfen bir kategori seçin.";
    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = "Açıklama en az 10 karakter olmalı.";
    }
    try {
      // Basit URL doğrulaması
      new URL(formData.image);
    } catch {
      errors.image = "Geçerli bir görsel URLsi girin.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    const productData = {
      ...formData,
      price: priceNum,
      stock: stockNum,
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
      bg={{ base: "white", _dark: "gray.800" }}
      borderRadius="xl"
      border="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
    >
      <VStack as="form" onSubmit={handleSubmit} spacing={6}>
        <Heading as="h1" size="lg" fontWeight="semibold">
          Yeni Ürün Ekle
        </Heading>

        <FormControl isRequired isInvalid={!!fieldErrors.name}>
          <FormLabel>Ürün Adı</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Örn: Akıllı Saat"
            variant="filled"
            size="lg"
          />
          {fieldErrors.name && (
            <FormErrorMessage>{fieldErrors.name}</FormErrorMessage>
          )}
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <FormControl isRequired isInvalid={!!fieldErrors.price}>
            <FormLabel>Fiyat (₺)</FormLabel>
            <NumberInput
              min={0}
              value={formData.price}
              onChange={(val) => handleNumberChange(val, "price")}
              variant="filled"
              size="lg"
            >
              <NumberInputField placeholder="Örn: 1500" name="price" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {fieldErrors.price && (
              <FormErrorMessage>{fieldErrors.price}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={!!fieldErrors.stock}>
            <FormLabel>Stok Adedi</FormLabel>
            <NumberInput
              min={0}
              value={formData.stock}
              onChange={(val) => handleNumberChange(val, "stock")}
              variant="filled"
              size="lg"
            >
              <NumberInputField placeholder="Örn: 50" name="stock" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {fieldErrors.stock && (
              <FormErrorMessage>{fieldErrors.stock}</FormErrorMessage>
            )}
          </FormControl>
        </SimpleGrid>

        <FormControl isRequired isInvalid={!!fieldErrors.category}>
          <FormLabel>Kategori</FormLabel>
          {loading && categories.length === 0 ? (
            <Center
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg={{ base: "gray.50", _dark: "gray.800" }}
            >
              <LoadingSpinner text="Kategoriler yükleniyor..." />
            </Center>
          ) : (
            <Select
              name="category"
              placeholder="Bir kategori seçin"
              value={formData.category}
              onChange={handleChange}
              variant="filled"
              size="lg"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          )}
          {fieldErrors.category && (
            <FormErrorMessage>{fieldErrors.category}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isRequired isInvalid={!!fieldErrors.description}>
          <FormLabel>Açıklama</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ürünün özelliklerini ve detaylarını yazın"
            variant="filled"
            size="lg"
            rows={5}
          />
          {fieldErrors.description && (
            <FormErrorMessage>{fieldErrors.description}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isRequired isInvalid={!!fieldErrors.image}>
          <FormLabel>Görsel URL</FormLabel>
          <Input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://ornek.com/gorsel.jpg"
            variant="filled"
            size="lg"
          />
          <FormHelperText>
            Lütfen geçerli ve erişilebilir bir görsel linki girin.
          </FormHelperText>
          {fieldErrors.image && (
            <FormErrorMessage>{fieldErrors.image}</FormErrorMessage>
          )}
        </FormControl>

        {error && (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
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
