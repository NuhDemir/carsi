import { useState, useEffect } from "react";
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputLeftElement,
  Input,
  VStack,
  Box,
  Text,
  Kbd,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import LoadingSpinner from "../LoadingSpinner";

const MobileSearchModal = ({ size = "full" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchProducts } = useProductContext();
  const navigate = useNavigate();

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (searchTerm.trim().length < 2) return setSearchResults([]);
      setIsLoading(true);
      const results = await searchProducts(searchTerm);
      setSearchResults(results || []);
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(debounce);
  }, [searchTerm, searchProducts]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
    onClose();
  };

  const bg = useColorModeValue("white", "gray.800");

  return (
    <>
      <IconButton
        aria-label="Ara"
        icon={<FiSearch />}
        onClick={onOpen}
        variant="solid"
        colorScheme="blue"
        isRound
        size="lg"
      />

      <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent bg={bg} borderRadius="md" p={0}>
          <ModalHeader>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Ürün, kategori veya marka ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </InputGroup>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {isLoading && <LoadingSpinner text="Aranıyor..." />}

            {!isLoading && searchResults.length > 0 && (
              <VStack spacing={2} align="stretch">
                {searchResults.map((p) => (
                  <Box
                    key={p._id}
                    p={3}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => handleProductClick(p._id)}
                  >
                    <Text fontWeight="medium">{p.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      ₺{p.price}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}

            {!isLoading &&
              searchTerm.length > 1 &&
              searchResults.length === 0 && (
                <Text mt={4} textAlign="center" color="gray.500">
                  Sonuç bulunamadı.
                </Text>
              )}

            <Text mt={4} textAlign="center" color="gray.500" fontSize="sm">
              Kısayol: <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MobileSearchModal;
