import {
  SimpleGrid,
  Box,
  Image,
  Heading,
  Text,
  Link,
  Stack,
} from "@chakra-ui/react";
import React from "react";

const CategoryCard = ({ category }) => {
  const img =
    category.image ||
    `https://source.unsplash.com/collection/190727/800x600?sig=${category._id}`;
  return (
    <Link
      href={`/categories/${category._id}`}
      _hover={{ textDecoration: "none" }}
    >
      <Box
        borderRadius="md"
        overflow="hidden"
        boxShadow="md"
        bg="white"
        _dark={{ bg: "gray.700" }}
      >
        <Image
          src={img}
          alt={category.name}
          objectFit="cover"
          w="100%"
          h="180px"
        />
        <Stack spacing={2} p={4}>
          <Heading size="md">{category.name}</Heading>
          {category.productCount !== undefined && (
            <Text fontSize="sm" color="gray.600">
              {category.productCount} ürün
            </Text>
          )}
        </Stack>
      </Box>
    </Link>
  );
};

const CategoryShowcase = ({ categories = [] }) => {
  if (!categories || categories.length === 0) return null;

  // Limit to 6 visual categories
  const show = categories.slice(0, 6);

  return (
    <Box my={8}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {show.map((c) => (
          <CategoryCard key={c._id || c.name} category={c} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CategoryShowcase;
