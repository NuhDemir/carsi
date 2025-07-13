// src/components/layout/Navbar.jsx
import {
  Box, Flex, HStack, IconButton, useDisclosure, Container, Slide, VStack,
  Text, Divider, Menu, MenuButton, MenuList, MenuItem, Button, MenuDivider, Icon
} from '@chakra-ui/react';
import { FiMenu, FiX, FiShoppingBag, FiChevronDown } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { memo, useState, useEffect } from 'react';
import { useProductContext } from '../../context/ProductContext';

// Modüler bileşenlerin importları
import NavLink from './NavLink';
import ThemeToggleButton from './ThemeToggleButton ';
import Search from './Search';
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const { categories, fetchCategories } = useProductContext();

  useEffect(() => { /* ... */ }, []);
  useEffect(() => { /* ... */ }, [categories.length, fetchCategories]);

  const NAVIGATION_LINKS = [
    { name: 'Ana Sayfa', path: '/' }, { name: 'Oluştur', path: '/create' }, { name: 'Keşfet', path: '/explore' },
  ];

  return (
    <Box
      as="header" position="sticky" top={0} zIndex="sticky" w="full"
      // DEĞİŞİKLİK: Koşullu olarak stil nesneleri atanıyor.
      bg={scrolled ? { base: 'rgba(255, 255, 255, 0.8)', _dark: 'rgba(26, 32, 44, 0.8)' } : 'transparent'}
      borderColor={scrolled ? { base: 'gray.200', _dark: 'gray.700' } : 'transparent'}
      backdropFilter={scrolled ? 'saturate(180%) blur(10px)' : 'none'}
      borderBottom="1px solid"
      transition="all 0.2s ease-in-out"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton display={{ base: 'flex', md: 'none' }} onClick={isOpen ? onClose : onOpen} icon={isOpen ? <FiX /> : <FiMenu />} variant="ghost" aria-label="Menüyü Aç" />

          <Flex align="center" as={RouterLink} to="/" _hover={{ opacity: 0.8 }}>
            {/* DEĞİŞİKLİK: Icon bileşeni ile renk propu nesne alabilir. */}
            <Icon as={FiShoppingBag} h={6} w={6} color={{ base: 'blue.500', _dark: 'blue.300' }} />
            <Text fontSize="xl" fontWeight="bold" ml={2} display={{ base: 'none', sm: 'block' }}>Çarşı</Text>
          </Flex>

          <HStack as="nav" spacing={1} display={{ base: 'none', md: 'flex' }}>
            {NAVIGATION_LINKS.map((link) => (<NavLink key={link.path} to={link.path}>{link.name}</NavLink>))}
            <Menu>
              <MenuButton as={Button} variant="ghost" rightIcon={<FiChevronDown />} fontWeight="medium"
                // DEĞİŞİKLİK: Stil nesnesi sözdizimi kullanıldı.
                color={{ base: 'gray.600', _dark: 'gray.400' }}
                _hover={{ bg: { base: 'gray.100', _dark: 'gray.700' } }}
              >
                Kategoriler
              </MenuButton>
              <MenuList borderRadius="lg" p={2} bg={{ base: 'white', _dark: 'gray.800' }}>
                <MenuItem as={RouterLink} to="/categories" borderRadius="md">Tüm Kategoriler</MenuItem>
                <MenuDivider />
                {categories.slice(0, 5).map((cat) => (
                  <MenuItem as={RouterLink} to={`/category/${cat._id}`} key={cat._id} borderRadius="md">{cat.name}</MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>

          <HStack spacing={1} align="center">
            <HStack spacing={1} display={{ base: 'none', md: 'flex' }}>
              <Search />
              <NotificationMenu />
              <ThemeToggleButton />
              <Divider orientation="vertical" h="20px" borderColor={{ base: 'gray.300', _dark: 'gray.600' }} />
            </HStack>
            <UserMenu />
          </HStack>
        </Flex>
      </Container>
      
      {/* Mobil Menü */}
      <Slide direction="top" in={isOpen} style={{ zIndex: 10 }}>
        <Box
          p={4} display={{ md: 'none' }}
          // DEĞİŞİKLİK: Stil nesnesi sözdizimi kullanıldı.
          bg={{ base: 'white', _dark: 'gray.800' }}
          boxShadow="md"
        >
          <VStack as="nav" spacing={4}>
            {NAVIGATION_LINKS.map((link) => (
              <NavLink key={link.path} to={link.path} w="full">{link.name}</NavLink>
            ))}
             <NavLink to="/categories" w="full">Tüm Kategoriler</NavLink>
          </VStack>
        </Box>
      </Slide>
    </Box>
  );
};

export default memo(Navbar);