import {
  Container,
  Heading,
  VStack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const posts = [
  {
    id: 1,
    title: "Ürün Seçim Rehberi",
    excerpt: "Doğru ürünü seçmenin 5 adımı",
    slug: "urun-secim-rehberi",
  },
  {
    id: 2,
    title: "Sezon İndirimleri",
    excerpt: "Fırsatları nasıl yakalarsınız?",
    slug: "sezon-indirimleri",
  },
];

const Blog = () => {
  return (
    <Container maxW="container.md" py={12}>
      <Heading mb={4}>Blog</Heading>
      <VStack align="stretch" spacing={4}>
        {posts.map((p) => (
          <BoxCard key={p.id} post={p} />
        ))}
      </VStack>
    </Container>
  );
};

const BoxCard = ({ post }) => (
  <ChakraLink
    as={RouterLink}
    to={`/blog/${post.slug}`}
    _hover={{ textDecoration: "none" }}
  >
    <VStack align="start" p={4} borderWidth="1px" borderRadius="md">
      <Heading size="sm">{post.title}</Heading>
      <Text color="gray.600">{post.excerpt}</Text>
    </VStack>
  </ChakraLink>
);

export default Blog;
