// src/components/layout/NotificationMenu.jsx
import {
  Menu, MenuButton, MenuList, MenuItem, MenuDivider, IconButton,
  Badge, Tooltip, VStack, Text
} from '@chakra-ui/react';
import { FiBell } from 'react-icons/fi';
import { useState, memo } from 'react';

const NotificationMenu = memo(() => {
  const [notifications] = useState([
    { id: 1, message: 'Yeni ürün eklendi: iPhone 15', time: '5 dk önce', unread: true },
    { id: 2, message: 'Siparişiniz kargoya verildi.', time: '1 saat önce', unread: false }
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Menu>
      <Tooltip label="Bildirimler" hasArrow placement="bottom">
        <MenuButton as={IconButton} icon={<FiBell />} variant="ghost" aria-label="Bildirimler" position="relative" borderRadius="lg">
          {unreadCount > 0 && (
            <Badge colorScheme="blue" variant="solid" position="absolute" top="1" right="1" fontSize="0.6em" p="3px" borderRadius="full">
              {unreadCount}
            </Badge>
          )}
        </MenuButton>
      </Tooltip>
      <MenuList 
        // DEĞİŞİKLİK: Stil nesnesi sözdizimi kullanıldı.
        bg={{ base: 'white', _dark: 'gray.800' }} 
        borderRadius="lg" 
        boxShadow="lg" 
        p={2}
      >
        <MenuItem as={Text} fontWeight="bold" isDisabled>Bildirimler ({unreadCount})</MenuItem>
        <MenuDivider />
        {notifications.map((n) => (
          <MenuItem key={n.id} borderRadius="md">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight={n.unread ? 'bold' : 'normal'}>{n.message}</Text>
              <Text fontSize="xs" color="gray.500">{n.time}</Text>
            </VStack>
          </MenuItem>
        ))}
        {notifications.length === 0 && <MenuItem isDisabled>Yeni bildirim yok.</MenuItem>}
      </MenuList>
    </Menu>
  );
});

NotificationMenu.displayName = 'NotificationMenu';
export default NotificationMenu;