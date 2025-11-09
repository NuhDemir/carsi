import { Box, Heading, Text, Container } from "@chakra-ui/react";

const About = () => {
  return (
    <Container maxW="container.md" py={12}>
      <Heading mb={4}>Hakkımızda</Heading>
      <Text>
        Kimse sizin hikayenizi (henüz) umursamıyor. Onlar ürün almak için
        oradalar. Biz ise doğru ürünü doğru kişiye ulaştırmak için buradayız.
      </Text>
    </Container>
  );
};

export default About;
