// src/components/layout/NotificationMenu.jsx
import {
  Menu, MenuButton, MenuList, MenuItem, MenuDivider, IconButton,
  Badge, Tooltip, VStack, Text, Box, Flex, useToast,Icon
} from '@chakra-ui/react';
import { FiBell, FiCircle } from 'react-icons/fi';
import { useState, memo, useCallback } from 'react';

const NotificationMenu = memo(() => {
  const toast = useToast();

  // Tanıtım amaçlı statik bildirimler
  const [notifications] = useState([
    { 
      id: 1, 
      message: 'Çarşı\'ya hoş geldiniz! Keşfetmeye başlamak için ürünleri inceleyin.', 
      time: 'Şimdi', 
      unread: true,
    },
    { 
      id: 2, 
      message: 'İpucu: Arama yapmak için Ctrl+K kısayolunu kullanabilirsiniz.', 
      time: '1 dk önce', 
      unread: true,
    },
    { 
      id: 3, 
      message: 'Hesap oluşturarak siparişlerinizi ve favorilerinizi yönetebilirsiniz.', 
      time: '5 dk önce', 
      unread: false,
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Tüm tıklanabilir bildirim elemanları için ortak fonksiyon
  const handleFeatureClick = useCallback(() => {
    toast({
      title: 'Çok Yakında!',
      description: 'Bildirimleri yönetmek için kullanıcı girişi gerekmektedir. Üyelik sistemi yakında aktif olacaktır.',
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top'
    });
  }, [toast]);


  return (
    <Menu>
      <Tooltip label="Bildirimler" hasArrow placement="bottom">
        <MenuButton
          as={IconButton}
          icon={<FiBell />}
          variant="ghost"
          aria-label="Bildirimler"
          position="relative"
          borderRadius="lg"
          _hover={{ bg: 'gray.50' }}
          size="md"
        >
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              variant="solid"
              position="absolute"
              top="6px"
              right="6px"
              fontSize="0.6em"
              minW="16px"
              h="16px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </MenuButton>
      </Tooltip>
      
      <MenuList
        bg='white'
        borderColor='gray.200'
        borderRadius="lg"
        boxShadow="lg"
        border="1px solid"
        p={0}
        minW="320px"
        maxW="400px"
      >
        {/* Header */}
        <Box p={4} borderBottom="1px solid" borderColor='gray.200'>
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" fontSize="lg" color='gray.800'>
              Bildirimler
            </Text>
            {unreadCount > 0 && (
              <Text
                fontSize="sm"
                color="blue.500"
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
                onClick={handleFeatureClick}
              >
                Tümünü okundu işaretle
              </Text>
            )}
          </Flex>
          {unreadCount > 0 && (
            <Text fontSize="sm" color='gray.500' mt={1}>
              {unreadCount} okunmamış bildirim
            </Text>
          )}
        </Box>

        {/* Notifications */}
        <Box maxH="300px" overflowY="auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                p={0}
                _hover={{ bg: 'gray.50' }}
                borderRadius="none"
                onClick={handleFeatureClick}
                cursor="pointer"
              >
                <Box p={3} w="full">
                  <Flex align="flex-start" gap={3}>
                    {notification.unread && (
                      <Box mt={1}>
                        <Icon as={FiCircle} color="blue.500" boxSize={3} fill="blue.500" />
                      </Box>
                    )}
                    <VStack align="start" spacing={1} flex={1} pl={notification.unread ? 0 : 5}>
                      <Text
                        fontSize="sm"
                        fontWeight={notification.unread ? 'medium' : 'normal'}
                        color='gray.800'
                        lineHeight="1.4"
                      >
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color='gray.500'>
                        {notification.time}
                      </Text>
                    </VStack>
                  </Flex>
                </Box>
              </MenuItem>
            ))
          ) : (
            <Box p={6} textAlign="center">
              <Text color='gray.500' fontSize="sm">
                Henüz bildirim yok.
              </Text>
            </Box>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <Box
            p={3}
            borderTop="1px solid"
            borderColor='gray.200'
            textAlign="center"
          >
            <Text
              fontSize="sm"
              color="blue.500"
              cursor="pointer"
              _hover={{ textDecoration: 'underline' }}
              onClick={handleFeatureClick}
            >
              Tüm bildirimleri görüntüle
            </Text>
          </Box>
        )}
      </MenuList>
    </Menu>
  );
});

NotificationMenu.displayName = 'NotificationMenu';
export default NotificationMenu;