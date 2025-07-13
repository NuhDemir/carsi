// src/components/layout/ThemeToggleButton.jsx
import { IconButton, useColorMode, Tooltip } from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { memo } from 'react';

const ThemeToggleButton = memo(() => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Tooltip 
      label={colorMode === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'} 
      hasArrow
      placement="bottom"
    >
      <IconButton
        onClick={toggleColorMode}
        icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
        variant="ghost"
        aria-label="Tema Değiştir"
        borderRadius="lg"
      />
    </Tooltip>
  );
});

ThemeToggleButton.displayName = 'ThemeToggleButton';
export default ThemeToggleButton;