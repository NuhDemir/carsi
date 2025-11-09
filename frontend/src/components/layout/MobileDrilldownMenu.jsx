import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Text,
  Heading,
  Divider,
  Slide,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Full screen drill-down menu for mobile.
 * categories: array of { _id, name, parentId?, children?: [] }
 */
const MobileDrilldownMenu = ({ isOpen, onClose, categories = [] }) => {
  const [stack, setStack] = useState([]); // stack of {title, items}
  const navigate = useNavigate();
  const bg = useColorModeValue("white", "gray.800");

  // Build top-level items (those without parentId) and attempt to detect children
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
      onClose();
      navigate(`/category/${cat._id}`);
      reset();
    }
  };

  // current view is top of stack or root
  const current =
    stack.length > 0
      ? stack[stack.length - 1]
      : { title: "Kategoriler", items: rootItems };

  return (
    <Slide direction="bottom" in={isOpen} style={{ zIndex: 60 }}>
      <Box h="100vh" w="full" bg={bg} p={4} overflowY="auto">
        <HStack justify="space-between" mb={2}>
          <HStack>
            {stack.length > 0 ? (
              <IconButton
                aria-label="Geri"
                icon={<FiChevronLeft />}
                variant="ghost"
                onClick={pop}
              />
            ) : (
              <Box w="10px" />
            )}
            <Heading size="md">{current.title}</Heading>
          </HStack>
          <IconButton
            aria-label="Kapat"
            icon={<FiX />}
            variant="ghost"
            onClick={() => {
              onClose();
              reset();
            }}
          />
        </HStack>

        <Divider mb={3} />

        <VStack align="stretch" spacing={1}>
          {current.items.map((c) => (
            <Button
              key={c._id}
              justifyContent="space-between"
              variant="ghost"
              onClick={() => handleItemClick(c)}
              rightIcon={<FiChevronRight />}
            >
              <Text textAlign="left">{c.name}</Text>
            </Button>
          ))}
        </VStack>

        <Box mt="auto" pt={6}>
          <Divider />
          <VStack spacing={2} mt={3} align="stretch">
            <Text fontSize="sm">Kampanyalar</Text>
            <Text fontSize="sm">Yardım</Text>
            <Text fontSize="sm">İletişim</Text>
            <Text fontSize="sm">Hakkımızda</Text>
          </VStack>
        </Box>
      </Box>
    </Slide>
  );
};

MobileDrilldownMenu.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  categories: PropTypes.array,
};

export default MobileDrilldownMenu;
