// src/components/layout/NavLink.jsx
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link } from '@chakra-ui/react';
import { memo } from 'react';

const NavLink = memo(({ to, children, ...rest }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      as={RouterLink}
      to={to}
      p={2}
      px={3}
      borderRadius="md"
      fontWeight={isActive ? 'bold' : 'medium'}
      // DEĞİŞİKLİK: Stil nesnesi sözdizimi kullanıldı.
      color={
        isActive
          ? { base: 'blue.500', _dark: 'blue.300' }
          : { base: 'gray.600', _dark: 'gray.400' }
      }
      bg={isActive ? { base: 'blue.50', _dark: 'gray.700' } : 'transparent'}
      transition="all 0.2s ease-in-out"
      _hover={{
        textDecoration: 'none',
        bg: { base: 'gray.100', _dark: 'gray.700' },
        color: { base: 'gray.800', _dark: 'white' },
      }}
      {...rest}
    >
      {children}
    </Link>
  );
});

NavLink.displayName = 'NavLink';
export default NavLink;