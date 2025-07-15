// src/components/layout/UserMenu.jsx
import {
  Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar,
  VStack, Text, useToast, Button, Box, Flex
} from '@chakra-ui/react';
import { 
  FiSettings, 
  FiStar, 
  FiLogOut, 
  FiHelpCircle, 
  FiUser,
  FiShoppingBag,
  FiChevronDown
} from 'react-icons/fi';
import { memo, useState, useCallback } from 'react';

const UserMenu = memo(() => {
  const toast = useToast();
  
  // Tanıtım amaçlı statik kullanıcı bilgisi
  const [user] = useState({
    name: 'Ziyaretçi',
    email: 'Giriş bekleniyor...',
    avatar: '', // Varsayılan avatar kullanılacak
  });

  // Kullanıcı girişi gerektiren bir özelliğe tıklandığında gösterilecek bildirim
  const handleFeatureClick = useCallback(() => {
    toast({
      title: 'Çok Yakında!',
      description: 'Bu özellik için kullanıcı girişi gerekmektedir. Üyelik sistemi yakında aktif olacaktır.',
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top'
    });
  }, [toast]);
  
  // Bu versiyonda kullanıcı her zaman "giriş yapmamış" ama menüyü görebiliyor.
  // Gerçek bir giriş sistemi eklendiğinde bu kısım dinamik hale getirilebilir.
  // Şimdilik "Giriş Yap" butonu yerine direkt menü gösteriliyor.

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        p={1}
        h="auto"
        borderRadius="lg"
        _hover={{ bg: 'gray.50' }}
        transition="all 0.2s"
      >
        <Flex align="center" gap={2}>
          <Avatar
            size="sm"
            name={user.name} // Avatar'da isim baş harfleri gösterilir
            border="2px solid"
            borderColor="blue.500"
          />
          <Box display={{ base: 'none', md: 'block' }}>
            <FiChevronDown size={14} />
          </Box>
        </Flex>
      </MenuButton>
      
      <MenuList
        bg='white'
        borderColor='gray.200'
        borderRadius="xl"
        boxShadow="lg"
        border="1px solid"
        p={0}
        minW="220px"
        maxW="280px"
      >
        {/* User Info */}
        <Box p={4} borderBottom="1px solid" borderColor='gray.200'>
          <Flex align="center" gap={3}>
            <Avatar
              size="md"
              name={user.name}
              border="2px solid"
              borderColor="blue.500"
            />
            <VStack align="start" spacing={0} flex={1}>
              <Text 
                fontWeight="medium" 
                fontSize="md"
                color='gray.800'
                isTruncated
                maxW="140px"
              >
                {user.name}
              </Text>
              <Text 
                fontSize="sm" 
                color='gray.500'
                isTruncated
                maxW="140px"
              >
                {user.email}
              </Text>
            </VStack>
          </Flex>
        </Box>

        {/* Menu Items - Tümü tıklandığında bildirim gösterir */}
        <Box py={2}>
          <MenuItem
            onClick={handleFeatureClick}
            icon={<FiUser />}
            borderRadius="none"
            _hover={{ bg: 'gray.50' }}
            px={4}
            py={3}
          >
            Profilim
          </MenuItem>
          
          <MenuItem
            onClick={handleFeatureClick}
            icon={<FiShoppingBag />}
            borderRadius="none"
            _hover={{ bg: 'gray.50' }}
            px={4}
            py={3}
          >
            Siparişlerim
          </MenuItem>
          
          <MenuItem
            onClick={handleFeatureClick}
            icon={<FiStar />}
            borderRadius="none"
            _hover={{ bg: 'gray.50' }}
            px={4}
            py={3}
          >
            Favorilerim
          </MenuItem>
          
          <MenuItem
            onClick={handleFeatureClick}
            icon={<FiSettings />}
            borderRadius="none"
            _hover={{ bg: 'gray.50' }}
            px={4}
            py={3}
          >
            Ayarlar
          </MenuItem>
          
          <MenuItem
            onClick={handleFeatureClick}
            icon={<FiHelpCircle />}
            borderRadius="none"
            _hover={{ bg: 'gray.50' }}
            px={4}
            py={3}
          >
            Yardım Merkezi
          </MenuItem>
        </Box>

        {/* Logout/Login Button */}
        <Box borderTop="1px solid" borderColor='gray.200'>
          <MenuItem
            icon={<FiLogOut />}
            color="blue.500"
            onClick={handleFeatureClick}
            borderRadius="none"
            _hover={{ 
              bg: 'blue.50',
              color: 'blue.600'
            }}
            px={4}
            py={3}
          >
            Giriş Yap veya Kayıt Ol
          </MenuItem>
        </Box>
      </MenuList>
    </Menu>
  );
});

UserMenu.displayName = 'UserMenu';
export default UserMenu;