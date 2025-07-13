// src/components/layout/UserMenu.jsx
import {
  Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar,
  VStack, Text, useToast, Button
} from '@chakra-ui/react';
import { FiSettings, FiStar, FiLogOut, FiHelpCircle } from 'react-icons/fi';
import { memo } from 'react';

const UserMenu = memo(() => {
  const toast = useToast();
  const handleLogout = () => { /* ... */ };

  return (
    <Menu>
      <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
        <Avatar
          size="sm"
          src="https://bit.ly/dan-abramov"
          border="2px solid"
          // DEĞİŞİKLİK: Stil nesnesi sözdizimi kullanıldı.
          borderColor={{ base: 'blue.500', _dark: 'blue.300' }}
        />
      </MenuButton>
      <MenuList
        // DEĞİŞİKLİK: Stil nesnesi sözdizimi kullanıldı.
        bg={{ base: 'white', _dark: 'gray.800' }}
        borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
        borderRadius="xl"
        boxShadow="lg"
        border="1px solid"
        p={2}
        minW="200px"
      >
        <MenuItem borderRadius="lg">
          <VStack align="start" spacing={0}>
            <Text fontWeight="medium">Dan Abramov</Text>
            <Text fontSize="sm" color="gray.500">dan@abramov.com</Text>
          </VStack>
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<FiSettings />} borderRadius="lg">Ayarlar</MenuItem>
        <MenuItem icon={<FiStar />} borderRadius="lg">Favorilerim</MenuItem>
        <MenuItem icon={<FiHelpCircle />} borderRadius="lg">Yardım Merkezi</MenuItem>
        <MenuDivider />
        <MenuItem
          icon={<FiLogOut />}
          color="red.500"
          onClick={handleLogout}
          borderRadius="lg"
          // DEĞİŞİKLİK: Stil nesnesi sözdizimi kullanıldı.
          _hover={{ bg: { base: 'red.50', _dark: 'red.900' } }}
        >
          Çıkış Yap
        </MenuItem>
      </MenuList>
    </Menu>
  );
});

UserMenu.displayName = 'UserMenu';
export default UserMenu;