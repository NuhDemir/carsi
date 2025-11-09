import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "", password: "" });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2)
      e.name = "İsim en az 2 karakter olmalı";
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Geçerli email girin";
    if (form.password && form.password.length > 0 && form.password.length < 6)
      e.password = "Parola en az 6 karakter olmalı";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const updates = { name: form.name, email: form.email };
    if (form.password) updates.password = form.password;
    const res = await updateProfile(updates);
    setLoading(false);
    if (res.ok) {
      setForm((p) => ({ ...p, password: "" }));
    }
  };

  if (!user) {
    return (
      <Box
        maxW="3xl"
        mx="auto"
        mt={8}
        p={6}
        bg={{ base: "white", _dark: "gray.800" }}
        borderRadius="xl"
        border="1px solid"
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
      >
        <Text>
          Giriş yapmadınız. Lütfen <a href="/login">giriş yapın</a> veya{" "}
          <a href="/register">kayıt olun</a>.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      maxW="3xl"
      mx="auto"
      mt={8}
      p={6}
      bg={{ base: "white", _dark: "gray.800" }}
      borderRadius="xl"
      border="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
    >
      <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
        <Heading size="lg">Profil</Heading>

        <FormControl isInvalid={!!errors.name}>
          <FormLabel>İsim</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Yeni Parola (isteğe bağlı)</FormLabel>
          <Input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Yeni parola"
          />
          {errors.password && (
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          )}
        </FormControl>

        <Button type="submit" colorScheme="blue" isLoading={loading}>
          Güncelle
        </Button>
      </VStack>
    </Box>
  );
};

export default Profile;
