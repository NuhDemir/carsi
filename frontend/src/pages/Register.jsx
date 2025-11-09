import { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!name || name.trim().length < 2)
      errs.name = "İsim en az 2 karakter olmalı";
    if (!email) errs.email = "Email gerekli";
    if (!password || password.length < 6)
      errs.password = "Parola en az 6 karakter olmalı";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const res = await register(name, email, password);
    if (res.ok) navigate("/");
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={8}
      p={6}
      bg={{ base: "white", _dark: "gray.800" }}
      borderRadius="xl"
      border="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
    >
      <VStack as="form" spacing={6} onSubmit={handleSubmit}>
        <Heading size="lg">Kayıt Ol</Heading>

        <FormControl isInvalid={!!errors.name}>
          <FormLabel>İsim</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adınız"
          />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
          />
          {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Parola</FormLabel>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Parolanız"
          />
          {errors.password && (
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          )}
        </FormControl>

        <Button type="submit" colorScheme="blue" width="full">
          Kayıt Ol
        </Button>

        <Text fontSize="sm">
          Zaten hesabın var mı?{" "}
          <Link as={RouterLink} to="/login" color="blue.500">
            Giriş yap
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register;
