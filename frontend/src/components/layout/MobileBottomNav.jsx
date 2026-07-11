import {
  HStack,
  IconButton,
  Box,
  Badge,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiHome,
  FiSearch,
  FiUser,
  FiGrid,
  FiShoppingCart,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Sticky mobile bottom navigation bar
 * Only visible on mobile devices (< md breakpoint)
 */
const MobileBottomNav = ({ onOpenMenu, onOpenSearch, cartCount = 0 }) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={100}
      bg={bg}
      borderTop="1px solid"
      borderColor={borderColor}
      display={{ base: "block", md: "none" }}
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.05)"
      backdropFilter="blur(10px)"
      backgroundColor={useColorModeValue(
        "rgba(255, 255, 255, 0.95)",
        "rgba(26, 32, 44, 0.95)"
      )}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={{ base: 2, sm: 4 }}
        py={2}
        align="center"
        justify="center"
      >
        <HStack
          spacing={{ base: 2, sm: 4 }}
          w="full"
          justify="space-evenly"
          maxW="500px"
          mx="auto"
        >
          {/* Ana Sayfa */}
          <IconButton
            as={RouterLink}
            to="/"
            aria-label="Ana Sayfa"
            icon={<FiHome size={22} />}
            variant="ghost"
            size="lg"
            colorScheme="blue"
            _hover={{ bg: useColorModeValue("blue.50", "blue.900") }}
          />

          {/* Kategoriler */}
          <IconButton
            aria-label="Kategoriler"
            icon={<FiGrid size={22} />}
            variant="ghost"
            size="lg"
            colorScheme="blue"
            onClick={onOpenMenu}
            _hover={{ bg: useColorModeValue("blue.50", "blue.900") }}
          />

          {/* Arama - Merkez ve vurgulu */}
          <IconButton
            aria-label="Ara"
            icon={<FiSearch size={24} />}
            variant="solid"
            colorScheme="blue"
            size="lg"
            isRound
            onClick={onOpenSearch}
            boxShadow="md"
            _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
            transition="all 0.2s"
          />

          {/* Profil */}
          <IconButton
            as={RouterLink}
            to="/profile"
            aria-label="Hesabım"
            icon={<FiUser size={22} />}
            variant="ghost"
            size="lg"
            colorScheme="blue"
            _hover={{ bg: useColorModeValue("blue.50", "blue.900") }}
          />

          {/* Sepet - Badge ile */}
          <Box position="relative">
            <IconButton
              as={RouterLink}
              to="/cart"
              aria-label={`Sepet (${cartCount})`}
              icon={<FiShoppingCart size={22} />}
              variant="ghost"
              size="lg"
              colorScheme="blue"
              _hover={{ bg: useColorModeValue("blue.50", "blue.900") }}
            />
            {cartCount > 0 && (
              <Badge
                position="absolute"
                top="0"
                right="0"
                fontSize="xs"
                colorScheme="red"
                borderRadius="full"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
              >
                {cartCount > 9 ? "9+" : cartCount}
              </Badge>
            )}
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

MobileBottomNav.propTypes = {
  onOpenMenu: PropTypes.func.isRequired,
  onOpenSearch: PropTypes.func.isRequired,
  cartCount: PropTypes.number,
};

export default MobileBottomNav;
