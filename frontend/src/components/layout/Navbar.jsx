import React, { memo, useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Container,
  Divider,
  Text,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { FiMenu, FiShoppingBag, FiSearch, FiHome } from "react-icons/fi";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";

import NavLink from "./NavLink";
import ThemeToggleButton from "./ThemeToggleButton";
import Search from "./Search";
import UserMenu from "./UserMenu";
import NotificationMenu from "./NotificationMenu";
import MegaMenu from "./MegaMenu";

// Mobile components
import MobileBottomNav from "./MobileBottomNav";
import MobileDrilldownMenu from "./MobileDrilldownMenu";
import MobileSearchModal from "./MobileSearchModal";

const Navbar = () => {
  const drilldown = useDisclosure();
  const mobileSearch = useDisclosure();

  const [scrolled, setScrolled] = useState(false);
  const { categories, fetchCategories } = useProductContext();
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Scroll detection for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch categories
  useEffect(() => {
    if (!categories || categories.length === 0) fetchCategories();
  }, [categories, fetchCategories]);

  // Cart count management
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

    // Listen for storage changes
    const onStorage = (e) => {
      if (e.key === "cart") readCart();
    };

    // Listen for custom cart update events
    const onCartUpdate = () => readCart();

    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onCartUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onCartUpdate);
    };
  }, []);

  const NAVIGATION_LINKS = [
    { name: "Ana Sayfa", path: "/", icon: FiHome },
    { name: "Keşfet", path: "/explore", icon: FiSearch },
  ];

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex="sticky"
        w="full"
        bg={scrolled ? { base: "white", _dark: "gray.800" } : "transparent"}
        borderBottom={scrolled ? "1px solid" : "none"}
        borderColor={
          scrolled ? { base: "gray.200", _dark: "gray.700" } : "transparent"
        }
        backdropFilter={scrolled ? "saturate(180%) blur(10px)" : "none"}
        transition="all 0.2s ease-in-out"
        boxShadow={scrolled ? "sm" : "none"}
      >
        <Container maxW="container.xl">
          <Flex h={16} align="center" justify="space-between">
            {/* Left Section */}
            <HStack spacing={3} align="center">
              {/* Mobile Menu Button */}
              <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={drilldown.onOpen}
                icon={<FiMenu />}
                aria-label="Menüyü Aç"
                variant="ghost"
                size="md"
              />

              {/* Logo */}
              <Flex
                as={RouterLink}
                to="/"
                align="center"
                _hover={{ opacity: 0.9 }}
                transition="opacity 0.2s"
              >
                <Icon
                  as={FiShoppingBag}
                  w={6}
                  h={6}
                  color={{ base: "blue.500", _dark: "blue.300" }}
                />
                <Text
                  ml={2}
                  fontWeight="bold"
                  fontSize="lg"
                  display={{ base: "block", sm: "block" }}
                >
                  Çarşı
                </Text>
              </Flex>

              {/* Desktop Navigation */}
              <HStack
                as="nav"
                spacing={2}
                display={{ base: "none", md: "flex" }}
              >
                {NAVIGATION_LINKS.map((link) => (
                  <NavLink key={link.path} to={link.path} icon={link.icon}>
                    {link.name}
                  </NavLink>
                ))}
                <MegaMenu categories={categories} />
              </HStack>
            </HStack>

            {/* Right Section */}
            <HStack spacing={2} align="center">
              {/* Desktop Actions */}
              <HStack spacing={2} display={{ base: "none", md: "flex" }}>
                <Search />
                <NotificationMenu />
                <ThemeToggleButton />
                <Divider orientation="vertical" h="20px" />
              </HStack>

              {/* Cart Button with Badge */}
              <Box position="relative">
                <IconButton
                  aria-label={`Sepet (${cartCount})`}
                  icon={<FiShoppingBag />}
                  variant="ghost"
                  onClick={() => navigate("/cart")}
                  display={{ base: "none", md: "inline-flex" }}
                />
                {cartCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="red"
                    borderRadius="full"
                    fontSize="xs"
                    display={{ base: "none", md: "flex" }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </Badge>
                )}
              </Box>

              {/* Mobile Cart Button */}
              <Box position="relative" display={{ base: "block", md: "none" }}>
                <IconButton
                  as={RouterLink}
                  to="/cart"
                  aria-label={`Sepet (${cartCount})`}
                  icon={<FiShoppingBag />}
                  variant="ghost"
                />
                {cartCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="red"
                    borderRadius="full"
                    fontSize="xs"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </Badge>
                )}
              </Box>

              {/* User Menu */}
              <UserMenu />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Components */}
      <MobileDrilldownMenu
        isOpen={drilldown.isOpen}
        onClose={drilldown.onClose}
        categories={categories}
      />
      <MobileSearchModal
        isOpen={mobileSearch.isOpen}
        onClose={mobileSearch.onClose}
      />
      <MobileBottomNav
        onOpenMenu={drilldown.onOpen}
        onOpenSearch={mobileSearch.onOpen}
        cartCount={cartCount}
      />
    </>
  );
};

export default memo(Navbar);
