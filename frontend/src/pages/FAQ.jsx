import { Container, Heading, VStack, Text, Box } from "@chakra-ui/react";

const faqs = [
  {
    q: "Siparişimi nasıl takip edebilirim?",
    a: "Hesabınızdaki Siparişlerim bölümünden takip edebilirsiniz.",
  },
  {
    q: "İade politikası nedir?",
    a: "14 gün içinde koşulsuz iade imkanı sunuyoruz. Bazı ürünler hariç olabilir.",
  },
  {
    q: "Garanti nasıl işler?",
    a: "Ürün sayfasındaki garanti bilgilerini kontrol edin veya müşteri hizmetleri ile iletişime geçin.",
  },
];

const FAQ = () => {
  return (
    <Container maxW="container.md" py={12}>
      <Heading mb={4}>S.S.S. (Sıkça Sorulan Sorular)</Heading>
      <VStack align="stretch" spacing={4}>
        {faqs.map((f, i) => (
          <Box key={i} p={4} borderWidth="1px" borderRadius="md">
            <Heading size="sm">{f.q}</Heading>
            <Text mt={2} color="gray.600">
              {f.a}
            </Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default FAQ;
