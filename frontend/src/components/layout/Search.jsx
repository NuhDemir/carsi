import { useState, useEffect, useCallback, memo } from 'react';
import {
  IconButton, Tooltip, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, InputGroup, InputLeftElement, Input,
  VStack, Box, Text, Kbd
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import LoadingSpinner from '../LoadingSpinner'; // Bu bileşenin projenizde olduğundan emin olun

const Search = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchProducts } = useProductContext();
  const navigate = useNavigate();

  // Klavyeden Ctrl+K ile arama modalını açma
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);

  // Arama işlemini gerçekleştiren fonksiyon
  const handleSearch = useCallback(async (term) => {
    // Arama terimi 2 karakterden kısaysa arama yapma ve sonuçları temizle
    if (term.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    // Context'teki searchProducts fonksiyonu zaten hata durumunda toast gösterir.
    const results = await searchProducts(term);
    setSearchResults(results || []); // Sonuç null/undefined ise boş dizi ata
    setIsLoading(false);
  }, [searchProducts]);

  // Kullanıcı yazmayı bıraktıktan sonra aramayı tetikleyen effect (debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // 300ms gecikme

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, handleSearch]);
  
  // Modal kapandığında state'i temizleyen fonksiyon
  const handleModalClose = () => {
    onClose();
    setSearchTerm('');
    setSearchResults([]);
  };
  
  // Arama sonucundaki bir ürüne tıklandığında ilgili ürün sayfasına yönlendirme
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    handleModalClose(); 
  };


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

      <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader>Ürün Ara</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <InputGroup>
              <InputLeftElement pointerEvents="none"><FiSearch color="gray.300" /></InputLeftElement>
              <Input 
                placeholder="Aranacak ürün..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                autoFocus 
              />
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
                    // DÜZELTİLDİ: _hover stili doğru sözdizimi ile yazıldı ve _dark kaldırıldı.
                    _hover={{ bg: 'gray.100' }} 
                    onClick={() => handleProductClick(product._id)}
                  >
                    <Text fontWeight="medium">{product.name}</Text>
                    <Text fontSize="sm" color="gray.500">₺{product.price}</Text>
                  </Box>
                ))}
              </VStack>
            )}

            {!isLoading && searchTerm.length > 1 && searchResults.length === 0 && (
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