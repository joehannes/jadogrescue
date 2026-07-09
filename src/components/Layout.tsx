import React, { useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  IconButton,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Link,
  Container,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiHeart } from 'react-icons/fi';
import { IconType } from 'react-icons';

const MotionBox = motion(Box);

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, onClose }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      as={RouterLink}
      to={to}
      onClick={onClose}
      fontWeight={isActive ? '700' : '500'}
      color={isActive ? 'brand.500' : 'gray.700'}
      _hover={{ color: 'brand.500' }}
      transition="all 0.2s"
    >
      {children}
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/donate', label: 'Donate' },
    { to: '/map', label: 'Map' },
    { to: '/blog', label: 'Blog' },
    { to: '/learn', label: 'Learn' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <MotionBox
        as="header"
        position="sticky"
        top={0}
        zIndex={100}
        bg="white"
        boxShadow="md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Container maxW="container.xl" px={4}>
          <Flex h={16} align="center" justify="space-between">
            <HStack spacing={8}>
              <Link
                as={RouterLink}
                to="/"
                fontWeight="800"
                fontSize="xl"
                color="brand.500"
                fontFamily="heading"
              >
                🐕 John & Abigail
              </Link>
              
              {/* Desktop Nav */}
              <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to}>
                    {link.label}
                  </NavLink>
                ))}
              </HStack>
            </HStack>

            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/donate"
                colorScheme="brand"
                size="md"
                display={{ base: 'none', sm: 'flex' }}
                leftIcon={<FiHeart />}
              >
                Donate $10
              </Button>
              
              {/* Mobile Menu Button */}
              <IconButton
                aria-label="Open menu"
                icon={<FiMenu />}
                onClick={onOpen}
                display={{ base: 'flex', md: 'none' }}
                variant="ghost"
                size="lg"
              />
            </HStack>
          </Flex>
        </Container>
      </MotionBox>

      {/* Main Content */}
      <Box as="main" flex={1}>
        {children}
      </Box>

      {/* Footer */}
      <MotionBox
        as="footer"
        bg="ocean.500"
        color="white"
        py={8}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Container maxW="container.xl" px={4}>
          <VStack spacing={6} align="stretch">
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              gap={6}
            >
              <Box>
                <Box fontWeight="700" fontSize="lg" mb={2}>
                  John & Abigail Dog Rescue
                </Box>
                <Box fontSize="sm" opacity={0.8}>
                  Making Something Out of Little
                </Box>
              </Box>
              
              <HStack spacing={6}>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                <NavLink to="/volunteer">Volunteer</NavLink>
                <NavLink to="/partners">Partners</NavLink>
              </HStack>
            </Flex>
            
            <Divider borderColor="whiteAlpha.300" />
            
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align="center"
              fontSize="sm"
              opacity={0.8}
            >
              <Box>
                © {new Date().getFullYear()} John & Abigail Dog Rescue. All rights reserved.
              </Box>
              <HStack spacing={4} mt={{ base: 2, md: 0 }}>
                <Link href="#" isExternal>Facebook</Link>
                <Link href="#" isExternal>Instagram</Link>
                <Link href="#" isExternal>Twitter</Link>
              </HStack>
            </Flex>
          </VStack>
        </Container>
      </MotionBox>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClose={onClose}>
                  {link.label}
                </NavLink>
              ))}
              <Button
                as={RouterLink}
                to="/donate"
                colorScheme="brand"
                onClick={onClose}
                leftIcon={<FiHeart />}
              >
                Donate Now
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
