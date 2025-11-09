// src/components/layout/ThemeToggleButton.jsx
import {
  IconButton,
  useColorMode,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { memo } from "react";

const ThemeToggleButton = memo(() => {
  const { colorMode, toggleColorMode } = useColorMode();
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Tooltip
      label={colorMode === "light" ? "Karanlık Tema" : "Aydınlık Tema"}
      hasArrow
      placement="bottom"
    >
      <IconButton
        onClick={toggleColorMode}
        icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
        variant="ghost"
        aria-label={colorMode === "light" ? "Karanlık Tema" : "Aydınlık Tema"}
        borderRadius="lg"
        size="md"
        _hover={{ bg: hoverBg }}
        transition="all 0.2s"
        color={colorMode === "light" ? "gray.600" : "yellow.400"}
      />
    </Tooltip>
  );
});

ThemeToggleButton.displayName = "ThemeToggleButton";
export default ThemeToggleButton;
