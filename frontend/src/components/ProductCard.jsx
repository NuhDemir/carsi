import {
  Box,
  Image,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      bg={cardBg}
      boxShadow="lg"
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
    >
      <Link to={`/product/${product._id}`}>
        <Image
          src={product.image}
          alt={product.name}
          objectFit="cover"
          w="full"
          h="200px"
        />
      </Link>
      <Box p={6}>
        <Stack spacing={2}>
          <Text
            color="teal.500"
            fontWeight="semibold"
            fontSize="sm"
            textTransform="uppercase"
          >
            Yeni Ürün
          </Text>
          <Text
            as="h3"
            fontWeight="bold"
            fontSize="xl"
            color={textColor}
            isTruncated
          >
            {product.name}
          </Text>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold" color="teal.500">
              ₺{product.price}
            </Text>
            <Badge colorScheme="green" variant="subtle">
              Stokta
            </Badge>
          </Flex>
        </Stack>
        <Stack mt={6} direction="row" spacing={4} align="center">
          <Button flex={1} colorScheme="teal" variant="solid">
            Sepete Ekle
          </Button>
          <Button
            as={Link}
            to={`/product/${product._id}`}
            flex={1}
            colorScheme="teal"
            variant="outline"
          >
            Detaylar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductCard;