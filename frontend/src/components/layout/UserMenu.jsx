// src/components/layout/UserMenu.jsx
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  VStack,
  Text,
  useToast,
  Button,
  Box,
  Flex,
  HStack,
} from "@chakra-ui/react";
import {
  FiSettings,
  FiStar,
  FiLogOut,
  FiHelpCircle,
  FiUser,
  FiShoppingBag,
  FiChevronDown,
} from "react-icons/fi";
import { memo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link as RouterLink } from "react-router-dom";

const UserMenu = memo(() => {
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleFeatureClick = useCallback(() => {
    toast({
      title: "Çok Yakında!",
      description: "Bu özellik için kullanıcı girişi gerekmektedir.",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }, [toast]);

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        p={1}
        h="auto"
        borderRadius="lg"
        _hover={{ bg: "gray.50" }}
        transition="all 0.2s"
      >
        <Flex align="center" gap={2}>
          <Avatar
            size="sm"
            name={user?.name || "Z"}
            border="2px solid"
            borderColor="blue.500"
          />
          <Box display={{ base: "none", md: "block" }}>
            <FiChevronDown size={14} />
          </Box>
        </Flex>
      </MenuButton>

      <MenuList
        bg="white"
        borderColor="gray.200"
        borderRadius="xl"
        boxShadow="lg"
        border="1px solid"
        p={0}
        minW="220px"
        maxW="320px"
      >
        {/* User Info */}
        <Box p={4} borderBottom="1px solid" borderColor="gray.200">
          <Flex align="center" gap={3}>
            <Avatar
              size="md"
              name={user?.name || "Ziyaretçi"}
              border="2px solid"
              borderColor="blue.500"
            />
            <VStack align="start" spacing={0} flex={1}>
              <Text
                fontWeight="medium"
                fontSize="md"
                color="gray.800"
                isTruncated
                maxW="160px"
              >
                {user?.name ?? "Ziyaretçi"}
              </Text>
              <Text fontSize="sm" color="gray.500" isTruncated maxW="160px">
                {user?.email ?? "Giriş yapılmadı"}
              </Text>
            </VStack>
          </Flex>
        </Box>

        {/* Menu Items */}
        <Box py={2}>
          <MenuItem
            as={RouterLink}
            to="/profile"
            icon={<FiUser />}
            borderRadius="none"
            _hover={{ bg: "gray.50" }}
            px={4}
            py={3}
            onClick={user ? undefined : handleFeatureClick}
          >
            Profilim
          </MenuItem>

          <MenuItem
            onClick={user ? handleFeatureClick : handleFeatureClick}
            icon={<FiShoppingBag />}
            borderRadius="none"
            _hover={{ bg: "gray.50" }}
            px={4}
            py={3}
          >
            Siparişlerim
          </MenuItem>

          <MenuItem
            onClick={handleFeatureClick}
            icon={<FiStar />}
            borderRadius="none"
            _hover={{ bg: "gray.50" }}
            px={4}
            py={3}
          >
            Favorilerim
          </MenuItem>

          <MenuItem
            onClick={handleFeatureClick}
            icon={<FiSettings />}
            borderRadius="none"
            _hover={{ bg: "gray.50" }}
            px={4}
            py={3}
          >
            Ayarlar
          </MenuItem>

          <MenuItem
            onClick={handleFeatureClick}
            icon={<FiHelpCircle />}
            borderRadius="none"
            _hover={{ bg: "gray.50" }}
            px={4}
            py={3}
          >
            Yardım Merkezi
          </MenuItem>
        </Box>

        {/* Auth actions */}
        <Box borderTop="1px solid" borderColor="gray.200">
          {user ? (
            <MenuItem
              icon={<FiLogOut />}
              color="red.600"
              onClick={() => logout()}
              borderRadius="none"
              _hover={{ bg: "red.50", color: "red.700" }}
              px={4}
              py={3}
            >
              Çıkış Yap
            </MenuItem>
          ) : (
            <HStack spacing={0}>
              <MenuItem
                as={RouterLink}
                to="/login"
                borderRadius="none"
                _hover={{ bg: "gray.50" }}
                px={4}
                py={3}
                flex={1}
              >
                Giriş Yap
              </MenuItem>
              <MenuItem
                as={RouterLink}
                to="/register"
                borderRadius="none"
                _hover={{ bg: "gray.50" }}
                px={4}
                py={3}
                flex={1}
              >
                Kayıt Ol
              </MenuItem>
            </HStack>
          )}
        </Box>
      </MenuList>
    </Menu>
  );
});

UserMenu.displayName = "UserMenu";
export default UserMenu;
