import {
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Bu örnekte sadece console.log; gerçek uygulamada backend'e POST yapılır
    console.log({ name, email, message });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Container maxW="container.md" py={12}>
      <Heading mb={4}>İletişim</Heading>
      <Text mb={4}>
        Bu bir güvencedir, ana navigasyon aracı değil. Footer'dan bizimle
        iletişime geçebilirsiniz.
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="İsim"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            placeholder="Mesajınız"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" colorScheme="blue">
            Gönder
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default Contact;
