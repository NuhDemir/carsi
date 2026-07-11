import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Text,
  Heading,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useColorModeValue,
  Icon,
  Badge,
} from "@chakra-ui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiPackage,
  FiTag,
  FiHelpCircle,
  FiMail,
  FiInfo,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Full screen drill-down menu for mobile with smooth navigation
 * Supports nested categories with breadcrumb-style navigation
 */
const MobileDrilldownMenu = ({ isOpen, onClose, categories = [] }) => {
  const [stack, setStack] = useState([]);
  const navigate = useNavigate();

  const bg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Reset stack when menu closes
  useEffect(() => {
    if (!isOpen) {
      setStack([]);
    }
  }, [isOpen]);

  // Build top-level items
  const rootItems = categories.filter((c) => !c.parentId);
  const childrenOf = (id) => categories.filter((c) => c.parentId === id);

  const push = (title, items) => setStack((s) => [...s, { title, items }]);
  const pop = () => setStack((s) => s.slice(0, -1));
  const reset = () => setStack([]);

  const handleItemClick = (cat) => {
    const children = childrenOf(cat._id);
    if (children && children.length > 0) {
      push(cat.name, children);
    } else {
      handleClose();
      navigate(`/category/${cat._id}`);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleNavigation = (path) => {
    handleClose();
    navigate(path);
  };

  // Current view
  const current =
    stack.length > 0
      ? stack[stack.length - 1]
      : { title: "Kategoriler", items: rootItems };

  const quickLinks = [
    { icon: FiTag, label: "Kampanyalar", path: "/campaigns" },
    { icon: FiHelpCircle, label: "Yardım", path: "/help" },
    { icon: FiMail, label: "İletişim", path: "/contact" },
    { icon: FiInfo, label: "Hakkımızda", path: "/about" },
  ];

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={handleClose} size="full">
      <DrawerOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <DrawerContent bg={bg}>
        <Box h="100vh" display="flex" flexDirection="column">
          {/* Header */}
          <Box
            px={4}
            py={4}
            borderBottom="1px solid"
            borderColor={borderColor}
            bg={useColorModeValue("gray.50", "gray.900")}
          >
            <HStack justify="space-between">
              <HStack spacing={2}>
                {stack.length > 0 ? (
                  <IconButton
                    aria-label="Geri"
                    icon={<FiChevronLeft size={20} />}
                    variant="ghost"
                    size="sm"
                    onClick={pop}
                    colorScheme="blue"
                  />
                ) : (
                  <Icon as={FiPackage} w={6} h={6} color="blue.500" />
                )}
                <Heading size="md" fontWeight="bold">
                  {current.title}
                </Heading>
              </HStack>
              <DrawerCloseButton position="static" />
            </HStack>
          </Box>

          {/* Categories List */}
          <Box flex={1} overflowY="auto" px={4} py={4}>
            {current.items && current.items.length > 0 ? (
              <VStack align="stretch" spacing={2}>
                {current.items.map((cat) => {
                  const hasChildren = childrenOf(cat._id).length > 0;
                  return (
                    <Button
                      key={cat._id}
                      justifyContent="space-between"
                      variant="ghost"
                      size="lg"
                      h="auto"
                      py={3}
                      px={4}
                      onClick={() => handleItemClick(cat)}
                      _hover={{ bg: hoverBg }}
                      borderRadius="lg"
                      fontWeight="medium"
                      rightIcon={
                        hasChildren ? <FiChevronRight size={18} /> : undefined
                      }
                    >
                      <HStack spacing={3} flex={1} justify="flex-start">
                        <Text textAlign="left" fontSize="md">
                          {cat.name}
                        </Text>
                        {cat.productCount > 0 && (
                          <Badge colorScheme="blue" fontSize="xs">
                            {cat.productCount}
                          </Badge>
                        )}
                      </HStack>
                    </Button>
                  );
                })}
              </VStack>
            ) : (
              <Box py={8} textAlign="center">
                <Icon as={FiPackage} w={12} h={12} color="gray.400" />
                <Text mt={3} color="gray.500">
                  Kategori bulunamadı
                </Text>
              </Box>
            )}
          </Box>

          {/* Footer Quick Links */}
          <Box
            px={4}
            py={4}
            borderTop="1px solid"
            borderColor={borderColor}
            bg={useColorModeValue("gray.50", "gray.900")}
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              mb={3}
              color="gray.500"
              textTransform="uppercase"
            >
              Hızlı Erişim
            </Text>
            <VStack spacing={2} align="stretch">
              {quickLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="ghost"
                  size="sm"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={link.icon} />}
                  onClick={() => handleNavigation(link.path)}
                  _hover={{ bg: hoverBg }}
                  fontWeight="normal"
                >
                  {link.label}
                </Button>
              ))}
            </VStack>
          </Box>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

MobileDrilldownMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categories: PropTypes.array,
};

export default MobileDrilldownMenu;
