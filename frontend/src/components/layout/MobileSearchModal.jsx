import { useState, useEffect } from "react";
import {
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
  Image,
  HStack,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import LoadingSpinner from "../LoadingSpinner";
import PropTypes from "prop-types";

/**
 * Full-screen mobile search modal
 * Triggered from MobileBottomNav
 */
const MobileSearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchProducts } = useProductContext();
  const navigate = useNavigate();

  const bg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Debounced search
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchProducts(searchTerm);
        setSearchResults(results || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, searchProducts, isOpen]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
    onClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    setSearchResults([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="full"
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent bg={bg} m={0} borderRadius={0}>
        <ModalHeader pt={4} pb={3}>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none" h="full">
              <FiSearch color="gray.400" size={20} />
            </InputLeftElement>
            <Input
              placeholder="Ürün, kategori veya marka ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              fontSize="md"
              variant="filled"
              _focus={{
                bg: useColorModeValue("white", "gray.700"),
                borderColor: "blue.500",
              }}
            />
          </InputGroup>
        </ModalHeader>

        <ModalCloseButton size="lg" top={4} />

        <Divider />

        <ModalBody pb={4} px={4} overflowY="auto" maxH="calc(100vh - 100px)">
          {isLoading && (
            <Box py={8}>
              <LoadingSpinner text="Aranıyor..." />
            </Box>
          )}

          {!isLoading && searchResults.length > 0 && (
            <VStack spacing={3} align="stretch" mt={3}>
              {searchResults.slice(0, 20).map((product) => (
                <Box
                  key={product._id}
                  p={3}
                  borderRadius="lg"
                  cursor="pointer"
                  border="1px solid"
                  borderColor={borderColor}
                  _hover={{
                    bg: hoverBg,
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                  onClick={() => handleProductClick(product._id)}
                >
                  <HStack spacing={3} align="center">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/50"
                      />
                    )}
                    <Box flex={1}>
                      <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
                        {product.name}
                      </Text>
                      <HStack spacing={2} mt={1}>
                        <Text fontSize="lg" fontWeight="bold" color="blue.500">
                          ₺{product.price?.toFixed(2) || "0.00"}
                        </Text>
                        {product.category && (
                          <Text fontSize="xs" color="gray.500">
                            • {product.category.name}
                          </Text>
                        )}
                      </HStack>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}

          {!isLoading &&
            searchTerm.length > 1 &&
            searchResults.length === 0 && (
              <Box py={12} textAlign="center">
                <FiSearch size={48} color="gray" style={{ margin: "0 auto" }} />
                <Text mt={4} fontSize="lg" color="gray.500">
                  Sonuç bulunamadı
                </Text>
                <Text fontSize="sm" color="gray.400" mt={1}>
                  &quot;{searchTerm}&quot; için hiçbir ürün bulunamadı
                </Text>
              </Box>
            )}

          {!isLoading && searchTerm.length === 0 && (
            <Box py={12} textAlign="center">
              <FiSearch size={48} color="gray" style={{ margin: "0 auto" }} />
              <Text mt={4} fontSize="lg" color="gray.500">
                Aramaya başlayın
              </Text>
              <Text fontSize="sm" color="gray.400" mt={1}>
                En az 2 karakter girin
              </Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

MobileSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileSearchModal;
