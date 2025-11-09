import { HStack, IconButton, Box, Text, Badge, Flex } from "@chakra-ui/react";
import {
  FiHome,
  FiSearch,
  FiUser,
  FiGrid,
  FiShoppingCart,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import MobileSearchModal from "./MobileSearchModal";
import { useEffect, useState } from "react";

const MobileBottomNav = ({ onOpenMenu }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const readCart = () => {
      try {
        const raw = localStorage.getItem("cart");
        const parsed = raw ? JSON.parse(raw) : [];
        setCartCount(Array.isArray(parsed) ? parsed.length : 0);
      } catch {
        setCartCount(0);
      }
    };
    readCart();
    const handleStorage = (e) => {
      if (e.key === "cart") readCart();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Box
      as="nav"
      position="sticky"
      bottom={0}
      zIndex={90}
      bg="transparent"
      display={{ base: "block", md: "none" }}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        py={2}
        align="center"
        justify="center"
      >
        <HStack spacing={4} w="full" justify="space-between">
          <IconButton
            as={RouterLink}
            to="/"
            aria-label="Ana Sayfa"
            icon={<FiHome />}
            variant="ghost"
            size="lg"
          />

          <IconButton
            aria-label="Kategoriler"
            icon={<FiGrid />}
            variant="ghost"
            size="lg"
            onClick={onOpenMenu}
          />

          <Box textAlign="center">
            {/* Center prominent search button */}
            <MobileSearchModal />
          </Box>

          <IconButton
            as={RouterLink}
            to="/profile"
            aria-label="Hesabım"
            icon={<FiUser />}
            variant="ghost"
            size="lg"
          />

          <Box position="relative">
            <IconButton
              as={RouterLink}
              to="/cart"
              aria-label={`Sepet (${cartCount})`}
              icon={<FiShoppingCart />}
              variant="ghost"
              size="lg"
            />
            {cartCount > 0 && (
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                fontSize="xs"
                colorScheme="red"
                borderRadius="full"
              >
                {cartCount}
              </Badge>
            )}
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default MobileBottomNav;
