import React, { memo, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Container,
  Divider,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FiMenu, FiShoppingBag } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext.jsx';

import NavLink from './NavLink';
import ThemeToggleButton from './ThemeToggleButton';
import Search from './Search';
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';
import MegaMenu from './MegaMenu';

// Mobile components
import MobileBottomNav from './MobileBottomNav';
import MobileDrilldownMenu from './MobileDrilldownMenu';
import MobileSearchModal from './MobileSearchModal';

const Navbar = () => {
  // drilldown menu (hamburger) and mobile search modal
  const drilldown = useDisclosure();
  const mobileSearch = useDisclosure();

  const [scrolled, setScrolled] = useState(false);
  const { categories, fetchCategories } = useProductContext();
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!categories || categories.length === 0) fetchCategories();
  }, [categories, fetchCategories]);

  useEffect(() => {
    const readCart = () => {
      try {
        const raw = localStorage.getItem('cart');
        const parsed = raw ? JSON.parse(raw) : [];
        setCartCount(Array.isArray(parsed) ? parsed.length : 0);
      } catch {
        setCartCount(0);
      }
    };
    readCart();
    const onStorage = (e) => {
      if (e.key === 'cart') readCart();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const NAVIGATION_LINKS = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Keşfet', path: '/explore' },
  ];

  return (
    <Box
      as= header
      position=sticky
      top={0}
      zIndex=sticky
      w=full
      bg={scrolled ? { base: 'rgba(255,255,255,0.85)', _dark: 'rgba(26,32,44,0.85)' } : 'transparent'}
      borderBottom=1px solid
      borderColor={scrolled ? { base: 'gray.200', _dark: 'gray.700' } : 'transparent'}
      backdropFilter={scrolled ? 'saturate(180%) blur(10px)' : 'none'}
    >
      <Container maxW=container.xl>
        <Flex h={16} align=center justify=space-between>
          <HStack spacing={3} align=center>
            {/* hamburger for mobile -> opens drilldown */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={drilldown.onOpen}
              icon={<FiMenu />}
              aria-label=Menüyü Aç
              variant=ghost
            />

            <Flex as={RouterLink} to='/' align='center' _hover={{ opacity: 0.9 }}>
              <Icon as={FiShoppingBag} w={6} h={6} color={{ base: 'blue.500', _dark: 'blue.300' }} />
              <Text ml={2} fontWeight='bold' fontSize='lg' display={{ base: 'block', sm: 'block' }}>
                Çarşı
              </Text>
            </Flex>

            {/* desktop nav */}
            <HStack as='nav' spacing={2} display={{ base: 'none', md: 'flex' }}>
              {NAVIGATION_LINKS.map((l) => (
                <NavLink key={l.path} to={l.path}>{l.name}</NavLink>
              ))}
              <MegaMenu categories={categories} />
            </HStack>
          </HStack>

          <HStack spacing={2} align='center'>
            {/* desktop tools */}
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              <Search />
              <NotificationMenu />
              <ThemeToggleButton />
              <Divider orientation='vertical' h='20px' />
            </HStack>

            {/* mobile cart icon visible only on small screens */}
            <IconButton
              as={RouterLink}
              to='/cart'
              aria-label={Sepet ()}
              icon={<FiShoppingBag />}
              variant='ghost'
              display={{ base: 'flex', md: 'none' }}
            />

            <UserMenu />
          </HStack>
        </Flex>
      </Container>

      {/* Mobile components wiring */}
      <MobileDrilldownMenu isOpen={drilldown.isOpen} onClose={drilldown.onClose} categories={categories} />
      <MobileSearchModal isOpen={mobileSearch.isOpen} onClose={mobileSearch.onClose} />
      <MobileBottomNav onOpenMenu={drilldown.onOpen} onOpenSearch={mobileSearch.onOpen} />
    </Box>
  );
};

export default memo(Navbar);
