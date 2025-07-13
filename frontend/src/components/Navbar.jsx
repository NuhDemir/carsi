// src/components/Navbar.jsx - BÖLÜM 1/2

import {
  Box, Flex, HStack, IconButton, useDisclosure, Link, Container, Button,
  Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Text, Badge,
  Slide, useColorMode, Tooltip, VStack, Divider, Input, InputGroup,
  InputLeftElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, useToast, Kbd
} from '@chakra-ui/react';
import { 
  HamburgerIcon, CloseIcon, MoonIcon, SunIcon, SearchIcon, BellIcon,
  SettingsIcon, StarIcon, ExternalLinkIcon, ChevronDownIcon,
} from '@chakra-ui/icons';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { memo, useState, useEffect, useCallback } from 'react';
import { useProductContext } from '../context/ProductContext.jsx';

// NavLink Bileşeni (Orijinal yapı korunuyor, renkler güncelleniyor)
const NavLink = memo(({ to, children, isActive = false, icon, badge, description }) => {
  const hoverBg = { base: 'whiteAlpha.200', _dark: { bg: 'whiteAlpha.300' } };
  const activeBg = { base: 'whiteAlpha.300', _dark: { bg: 'whiteAlpha.400' } };
  const textColor = { base: 'white', _dark: { color: 'gray.100' } };

  return (
    <Tooltip label={description} hasArrow placement="bottom">
      <Link
        as={RouterLink} to={to} position="relative" px={4} py={2} rounded="lg"
        fontWeight="medium" transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        bg={isActive ? activeBg : 'transparent'} color={textColor}
        _hover={{ textDecoration: 'none', bg: hoverBg, transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        _active={{ transform: 'translateY(0)' }} display="flex" alignItems="center" gap={2}
      >
        {icon && <Text fontSize="sm">{icon}</Text>}
        {children}
        {badge && (
          <Badge
            colorScheme="red" variant="solid" fontSize="xs" position="absolute"
            top="-2px" right="-2px" borderRadius="full" minW="18px" h="18px"
            display="flex" alignItems="center" justifyContent="center"
            animation="pulse 2s infinite"
          >
            {badge}
          </Badge>
        )}
      </Link>
    </Tooltip>
  );
});
NavLink.displayName = 'NavLink';

// SearchModal Bileşeni (Değişiklik yok)
const SearchModal = memo(({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchProducts } = useProductContext();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSearch = useCallback(async (term) => {
    if (!term.trim()) { setSearchResults([]); return; }
    setIsLoading(true);
    try {
      const results = await searchProducts(term);
      setSearchResults(results);
    } catch (error) {
      toast({ title: 'Arama Hatası', description: 'Arama yapılırken bir hata oluştu', status: 'error', duration: 3000, isClosable: true });
    } finally { setIsLoading(false); }
  }, [searchProducts, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => { handleSearch(searchTerm); }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
    setSearchTerm('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Ürün Ara</ModalHeader> <ModalCloseButton />
        <ModalBody pb={6}>
          <InputGroup>
            <InputLeftElement pointerEvents="none"><SearchIcon color="gray.300" /></InputLeftElement>
            <Input placeholder="Ürün adı yazın..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
          </InputGroup>
          {isLoading && <Text mt={4} textAlign="center" color="gray.500">Aranıyor...</Text>}
          {!isLoading && searchResults.length > 0 && (
            <VStack mt={4} spacing={2} align="stretch">
              {searchResults.map((product) => (
                <Box key={product._id} p={3} borderRadius="md" border="1px" borderColor="gray.200" cursor="pointer" _hover={{ bg: {base: 'gray.50', _dark: {bg: 'gray.700'}} }} onClick={() => handleProductClick(product._id)}>
                  <Text fontWeight="medium">{product.name}</Text>
                  <Text fontSize="sm" color="gray.600">₺{product.price}</Text>
                </Box>
              ))}
            </VStack>
          )}
          {!isLoading && searchTerm && searchResults.length === 0 && <Text mt={4} textAlign="center" color="gray.500">Sonuç bulunamadı</Text>}
          <HStack mt={4} justify="center" opacity={0.7}><Text fontSize="sm">Kısayol:</Text><Kbd>Ctrl</Kbd><Text fontSize="sm">+</Text><Kbd>K</Kbd></HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
SearchModal.displayName = 'SearchModal';

// NotificationMenu Bileşeni (Değişiklik yok)
const NotificationMenu = memo(() => {
  const [notifications] = useState([{ id: 1, message: 'Yeni ürün eklendi', time: '5 dk önce', unread: true }, { id: 2, message: 'Sipariş onaylandı', time: '1 saat önce', unread: true }]);
  const unreadCount = notifications.filter(n => n.unread).length;
  return (
    <Menu>
      <MenuButton as={IconButton} icon={<BellIcon />} variant="ghost" color="white" size="sm" rounded="lg" _hover={{ bg: 'whiteAlpha.200' }} aria-label="Bildirimler" position="relative">
        {unreadCount > 0 && <Badge colorScheme="red" variant="solid" fontSize="xs" position="absolute" top="2px" right="2px" borderRadius="full" minW="16px" h="16px" display="flex" alignItems="center" justifyContent="center">{unreadCount}</Badge>}
      </MenuButton>
      <MenuList maxH="400px" overflowY="auto">
        <MenuItem py={3} fontWeight="bold">Bildirimler</MenuItem> <MenuDivider />
        {notifications.map((notification) => (
          <MenuItem key={notification.id} py={3} alignItems="flex-start">
            <VStack align="start" spacing={1}><Text fontSize="sm" fontWeight={notification.unread ? 'bold' : 'normal'}>{notification.message}</Text><Text fontSize="xs" color="gray.500">{notification.time}</Text></VStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
});
NotificationMenu.displayName = 'NotificationMenu';

// UserMenu Bileşeni (Renkler güncelleniyor)
const UserMenu = memo(() => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const handleLogout = () => { toast({ title: 'Çıkış Yapıldı', description: 'Başarıyla çıkış yaptınız', status: 'success', duration: 3000, isClosable: true }); };
  return (
    <Menu>
      <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0} _hover={{ transform: 'scale(1.05)' }} transition="all 0.2s">
        <Avatar size="sm" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" name="Kullanıcı" border="2px solid" borderColor={colorMode === 'light' ? 'white' : 'gray.600'} />
      </MenuButton>
      <MenuList bg={{ base: 'white', _dark: { bg: 'gray.800' } }} borderColor={{ base: 'gray.200', _dark: { borderColor: 'gray.700' } }} boxShadow="xl" borderRadius="xl" p={2} minW="200px">
        <MenuItem rounded="lg" icon={<Avatar size="xs" />}><VStack align="start" spacing={0}><Text fontWeight="medium">Kullanıcı Adı</Text><Text fontSize="sm" color="gray.500">user@example.com</Text></VStack></MenuItem>
        <MenuDivider />
        <MenuItem rounded="lg" icon={<SettingsIcon />}>Ayarlar</MenuItem> <MenuItem rounded="lg" icon={<StarIcon />}>Favoriler</MenuItem> <MenuItem rounded="lg" icon={<ExternalLinkIcon />}>Yardım</MenuItem>
        <MenuDivider />
        <MenuItem rounded="lg" color="red.500" onClick={handleLogout}>Çıkış Yap</MenuItem>
      </MenuList>
    </Menu>
  );
});
UserMenu.displayName = 'UserMenu';

// src/components/Navbar.jsx - BÖLÜM 2/2

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  const { categories, fetchCategories } = useProductContext();

  // Effect'ler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); onSearchOpen(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchOpen]);

  // Stil tanımlamaları
  const bgColor = scrolled ? { base: 'rgba(56, 178, 172, 0.95)', _dark: { bg: 'rgba(45, 55, 72, 0.95)' } } : 'teal.500';
  const borderColor = scrolled ? { base: 'teal.400', _dark: { borderColor: 'gray.700' } } : 'transparent';
  const mobileMenuBg = { base: 'teal.500', _dark: { bg: 'gray.800' } };
  
  // Navigasyon linkleri (Kategoriler hariç)
  const NAVIGATION_LINKS = [
    { name: 'Ana Sayfa', path: '/', icon: '🏠', description: 'Tüm ürünleri görüntüle' },
    { name: 'Oluştur', path: '/create', icon: '✨', badge: 'Yeni', description: 'Yeni ürün ekle' },
    { name: 'Keşfet', path: '/explore', icon: '🔍', description: 'Popüler ürünleri keşfet' },
  ];

  return (
    <>
      <Box
        position="sticky" top={0} zIndex={1000} bg={bgColor} backdropFilter="blur(10px)"
        borderBottom="1px solid" borderColor={borderColor}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" shadow={scrolled ? 'lg' : 'none'}
      >
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Mobile Menu Button */}
            <IconButton
              display={{ md: 'none' }} size="md" icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={isOpen ? 'Menüyü Kapat' : 'Menüyü Aç'} onClick={isOpen ? onClose : onOpen}
              variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }}
            />

            {/* Logo */}
            <Box as={RouterLink} to="/" fontWeight="bold" fontSize="2xl" color="white" letterSpacing="tight"
              _hover={{ opacity: 0.8, transform: 'scale(1.05)' }} transition="all 0.2s"
              display="flex" alignItems="center" gap={2}
            >
              <Text fontSize="2xl">🛍️</Text>Çarşı
            </Box>

            {/* Desktop Navigation */}
            <HStack as="nav" spacing={1} display={{ base: 'none', md: 'flex' }} flex={1} justifyContent="center">
              {NAVIGATION_LINKS.map((link) => (
                <NavLink key={link.path} to={link.path} isActive={location.pathname === link.path} icon={link.icon} badge={link.badge} description={link.description}>
                  {link.name}
                </NavLink>
              ))}
              {/* === Dinamik Kategori Menüsü === */}
              <Menu>
                <MenuButton as={Button} variant="ghost" color="white" px={4} py={2} rounded="lg"
                  fontWeight="medium" rightIcon={<ChevronDownIcon />} _hover={{ bg: 'whiteAlpha.200' }}>
                  Kategoriler
                </MenuButton>
                <MenuList zIndex={1100}>
                  <MenuItem as={RouterLink} to="/categories" fontWeight="bold">Tüm Kategoriler</MenuItem>
                  <MenuDivider />
                  {categories.slice(0, 7).map((cat) => (
                    <MenuItem as={RouterLink} to={`/category/${cat._id}`} key={cat._id}>
                      <Text flex={1}>{cat.name}</Text>
                      <Badge colorScheme="teal" variant="subtle">{cat.productCount}</Badge>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </HStack>

            {/* Right Side Actions */}
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              <Tooltip label="Ara (Ctrl+K)" hasArrow><IconButton icon={<SearchIcon />} variant="ghost" color="white" size="sm" rounded="lg" _hover={{ bg: 'whiteAlpha.200' }} aria-label="Arama" onClick={onSearchOpen} /></Tooltip>
              <NotificationMenu />
              <Tooltip label={colorMode === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'} hasArrow><IconButton icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} variant="ghost" color="white" size="sm" rounded="lg" _hover={{ bg: 'whiteAlpha.200' }} aria-label="Tema Değiştir" /></Tooltip>
              <Divider orientation="vertical" h="6" borderColor="whiteAlpha.300" />
              <UserMenu />
            </HStack>

            {/* Mobile Right Actions */}
            <HStack spacing={2} display={{ md: 'none' }}><IconButton icon={<SearchIcon />} variant="ghost" color="white" size="sm" rounded="lg" _hover={{ bg: 'whiteAlpha.200' }} aria-label="Arama" onClick={onSearchOpen} /><IconButton icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} variant="ghost" color="white" size="sm" rounded="lg" _hover={{ bg: 'whiteAlpha.200' }} aria-label="Tema Değiştir" /><UserMenu /></HStack>
          </Flex>

          {/* Mobile Navigation Menu */}
          <Slide direction="top" in={isOpen} style={{ zIndex: 10 }}>
            <Box pb={4} display={{ md: 'none' }} bg={mobileMenuBg} borderRadius="0 0 xl xl" mt={2} mx={-4} px={4} boxShadow="xl">
              <VStack spacing={2} align="stretch">
                {[...NAVIGATION_LINKS, {name: 'Tüm Kategoriler', path: '/categories', icon: '📂', description: 'Tüm kategorileri gör'}].map((link) => (
                  <NavLink key={link.path} to={link.path} isActive={location.pathname === link.path} icon={link.icon} badge={link.badge} description={link.description}>
                    {link.name}
                  </NavLink>
                ))}
                <Divider my={2} borderColor="whiteAlpha.300" />
                <HStack spacing={2} justify="center"><NotificationMenu /></HStack>
              </VStack>
            </Box>
          </Slide>
        </Container>
      </Box>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={onSearchClose} />
    </>
  );
};

export default memo(Navbar);