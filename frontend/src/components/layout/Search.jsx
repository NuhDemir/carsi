// src/components/layout/Search.jsx
import { useState, useEffect, useCallback, memo } from 'react';
import {
  IconButton, Tooltip, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, InputGroup, InputLeftElement, Input,
  VStack, Box, Text, Kbd, useToast
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import LoadingSpinner from '../LoadingSpinner';

const Search = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // ... (Geri kalan tüm mantık aynı kalır)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchProducts } = useProductContext();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => { /* ... */ }, [onOpen]);
  const handleSearch = useCallback(async (term) => { /* ... */ }, [searchProducts, toast]);
  useEffect(() => { /* ... */ }, [searchTerm, handleSearch]);
  const handleProductClick = (productId) => { /* ... */ };


  return (
    <>
      <Tooltip label="Ara (Ctrl+K)" hasArrow placement="bottom">
        <IconButton
          icon={<FiSearch />}
          variant="ghost"
          aria-label="Arama Yap"
          onClick={onOpen}
          borderRadius="lg"
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader>Ürün Ara</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <InputGroup>
              <InputLeftElement pointerEvents="none"><FiSearch color="gray.300" /></InputLeftElement>
              <Input placeholder="Aranacak ürün..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
            </InputGroup>
            
            {isLoading && <LoadingSpinner text="Aranıyor..." />}
            
            {!isLoading && searchResults.length > 0 && (
              <VStack mt={4} spacing={2} align="stretch" maxH="40vh" overflowY="auto">
                {searchResults.map((product) => (
                  <Box 
                    key={product._id} 
                    p={3} 
                    borderRadius="md" 
                    cursor="pointer" 
                    // DEĞİŞİKLİK: Stil nesnesi sözdizimi kullanıldı.
                    _hover={{ bg: { base: 'gray.100', _dark: 'gray.700' } }} 
                    onClick={() => handleProductClick(product._id)}
                  >
                    <Text fontWeight="medium">{product.name}</Text>
                    <Text fontSize="sm" color="gray.500">₺{product.price}</Text>
                  </Box>
                ))}
              </VStack>
            )}

            {!isLoading && searchTerm && searchResults.length === 0 && (
              <Text mt={4} textAlign="center" color="gray.500">Sonuç bulunamadı.</Text>
            )}
            <Text mt={4} textAlign="center" color="gray.500" fontSize="sm">
                Açmak için <Kbd>ctrl</Kbd> + <Kbd>K</Kbd>
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

Search.displayName = 'Search';
export default Search;