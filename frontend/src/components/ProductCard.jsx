// src/components/ProductCard.jsx
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  AspectRatio,
  Tooltip,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi'; // DEĞİŞİKLİK: İkon paketi kullanıldı.

const ProductCard = ({ product }) => {
  // DEĞİŞİKLİK: Yeni tasarım sistemine uygun renkler ve stiller.
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const handleAddToCart = (e) => {
    e.preventDefault(); // Kartın linkine tıklamayı engelle.
    // Sepete ekleme mantığı burada olacak.
    console.log(`Sepete eklendi: ${product.name}`);
  };

  return (
    <Box
      as={RouterLink} // Kartın tamamı tıklanabilir.
      to={`/product/${product._id}`}
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.2s ease-in-out"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'md',
      }}
      display="flex"
      flexDirection="column"
    >
      {/* DEĞİŞİKLİK: Resim oranını korumak için AspectRatio kullanıldı. */}
      <AspectRatio w="full" ratio={4 / 3}>
        <Image
          src={product.image}
          alt={product.name}
          objectFit="cover"
        />
      </AspectRatio>

      {/* DEĞİŞİKLİK: İçerik alanı yeniden düzenlendi ve VStack kullanıldı. */}
      <VStack spacing={2} p={4} align="start" flex="1">
        <Text
          color={secondaryTextColor}
          fontWeight="medium"
          fontSize="xs"
          textTransform="uppercase"
        >
          {product.category?.name || 'Kategori'}
        </Text>
        <Text
          as="h3"
          fontWeight="semibold"
          fontSize="md"
          noOfLines={2}
          flex="1" // İsimlerin kart yüksekliğini eşitlemesine yardımcı olur.
        >
          {product.name}
        </Text>
        
        {/* DEĞİŞİKLİK: Fiyat ve Sepete Ekle butonu HStack içinde. */}
        <HStack justify="space-between" align="center" w="full" pt={2}>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            ₺{product.price}
          </Text>
          <Tooltip label="Sepete Ekle" hasArrow>
            <IconButton
              icon={<FiPlus />}
              size="sm"
              isRound
              colorScheme="blue"
              variant="ghost"
              aria-label="Sepete Ekle"
              onClick={handleAddToCart}
            />
          </Tooltip>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProductCard;