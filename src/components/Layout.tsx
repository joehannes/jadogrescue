import React, { useState, useEffect } from 'react';
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
  Icon,
  Badge,
  Heading,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  PawPrint, 
  MapPin, 
  BookOpen, 
  Heart, 
  Menu as MenuIcon, 
  X, 
  Home, 
  Info, 
  Mail, 
  DollarSign,
  Wrench,
  Users,
  ArrowRight,
  Sparkles,
  ThumbsUp,
  Camera,
  AtSign,
  Video
} from 'lucide-react';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: any;
  onClose?: () => void;
  footer?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon: Icon, onClose, footer }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseColor = footer ? 'whiteAlpha.800' : isActive ? 'brand.500' : 'gray.700';
  const hoverColor = footer ? 'white' : 'brand.500';

  return (
    <Link
      as={RouterLink}
      to={to}
      onClick={onClose}
      fontWeight={isActive ? '700' : '500'}
      color={baseColor}
      _hover={{ color: hoverColor }}
      transition="all 0.3s ease"
      display="flex"
      alignItems="center"
      gap={2}
      position="relative"
      sx={{
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-4px',
          left: 0,
          width: isActive ? '100%' : '0%',
          height: '2px',
          bg: footer ? 'white' : 'brand.500',
          transition: 'width 0.3s ease',
        },
        '&:hover::after': {
          width: '100%',
        },
      }}
    >
      {Icon && <Icon size={16} />}
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
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Parallax effect for header transparency
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']);
  const headerShadow = useTransform(scrollY, [0, 100], ['none', '0 4px 30px rgba(0, 0, 0, 0.1)']);
  const headerBlur = useTransform(scrollY, [0, 100], ['0px', '20px']);
  
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/donate', label: 'Donate', icon: Heart },
    { to: '/map', label: 'Map', icon: MapPin },
    { to: '/blog', label: 'Blog', icon: BookOpen },
    { to: '/learn', label: 'Learn', icon: Wrench },
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: Mail },
  ];

  const donateButtonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)',
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 },
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Animated Header with Glass Morphism */}
      <MotionBox
        as="header"
        position="sticky"
        top={0}
        zIndex={100}
        style={{
          backgroundColor: headerBg,
          boxShadow: headerShadow,
          backdropFilter: `blur(${headerBlur})`,
          WebkitBackdropFilter: `blur(${headerBlur})`,
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        borderBottomWidth={isScrolled ? '0px' : '1px'}
        borderBottomColor="whiteAlpha.200"
      >
        <Container maxW="container.xl" px={4}>
          <Flex h={20} align="center" justify="space-between">
            {/* Logo/Branding */}
            <MotionFlex
              as={RouterLink}
              to="/"
              align="center"
              gap={3}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <MotionBox
                w={12}
                h={12}
                borderRadius="full"
                bgGradient="linear(to-br, brand.400, brand.600)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="lg"
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.3 }}
              >
                <PawPrint color="white" size={24} />
              </MotionBox>
              <VStack align="start" spacing={0} ml={2}>
                <Box
                  fontWeight="800"
                  fontSize="xl"
                  fontFamily="heading"
                  bgGradient="linear(to-r, brand.500, ocean.500)"
                  bgClip="text"
                  lineHeight={1}
                >
                  John & Abigail
                </Box>
                <Box
                  fontSize="xs"
                  color="gray.600"
                  fontFamily="mono"
                  letterSpacing="wide"
                >
                  DOG RESCUE DR
                </Box>
              </VStack>
            </MotionFlex>
            
            {/* Desktop Nav */}
            <HStack 
              spacing={2} 
              display={{ base: 'none', lg: 'flex' }}
              bg={isScrolled ? 'transparent' : 'whiteAlpha.500'}
              px={4}
              py={2}
              borderRadius="full"
            >
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} icon={link.icon}>
                  {link.label}
                </NavLink>
              ))}
            </HStack>

            {/* Donate Button & Mobile Menu */}
            <HStack spacing={4}>
              <motion.div
                variants={donateButtonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  as={RouterLink}
                  to="/donate"
                  colorScheme="brand"
                  size="md"
                  display={{ base: 'none', md: 'flex' }}
                  leftIcon={<Heart size={18} />}
                  rightIcon={<ArrowRight size={16} />}
                  fontWeight="700"
                  bgGradient="linear(to-r, brand.500, coral.500)"
                  _hover={{
                    bgGradient: 'linear(to-r, brand.600, coral.600)',
                  }}
                  shadow="lg"
                >
                  Donate $10
                </Button>
              </motion.div>
              
              {/* Mobile Menu Button */}
              <IconButton
                aria-label="Open menu"
                icon={isOpen ? <X size={24} /> : <MenuIcon size={24} />}
                onClick={isOpen ? onClose : onOpen}
                display={{ base: 'flex', lg: 'none' }}
                variant="ghost"
                size="lg"
                borderRadius="full"
                _hover={{ bg: 'brand.50' }}
              />
            </HStack>
          </Flex>
        </Container>
      </MotionBox>

      {/* Main Content */}
      <Box as="main" flex={1}>
        {children}
      </Box>

      {/* Enhanced Footer */}
      <MotionBox
        as="footer"
        bgGradient="linear(to-r, ocean.600, ocean.800)"
        color="white"
        pt={16}
        pb={8}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative wave pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h={20}
          bg="sand.100"
          sx={{
            clipPath: 'ellipse(150% 100% at 50% 0%)',
          }}
        />
        
        <Container maxW="container.xl" px={4} position="relative">
          <VStack spacing={10} align="stretch">
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              gap={10}
            >
              {/* Brand Section */}
              <Box maxW="sm">
                <Flex align="center" gap={3} mb={4}>
                  <Box
                    w={12}
                    h={12}
                    borderRadius="full"
                    bg="whiteAlpha.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <PawPrint size={24} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Box fontWeight="800" fontSize="lg" fontFamily="heading">
                      John & Abigail
                    </Box>
                    <Box fontSize="xs" opacity={0.8} fontFamily="mono">
                      DOG RESCUE DR
                    </Box>
                  </VStack>
                </Flex>
                <Box fontSize="sm" opacity={0.8} lineHeight={1.8}>
                  Making Something Out of Little. Building insulated dog shelters 
                  from recycled plastic bottles in the Dominican Republic.
                </Box>
                
                {/* Social Links */}
                <HStack spacing={3} mt={6}>
                  {[
                    { label: 'Facebook', Icon: ThumbsUp },
                    { label: 'Instagram', Icon: Camera },
                    { label: 'Twitter', Icon: AtSign },
                    { label: 'YouTube', Icon: Video },
                  ].map(({ label, Icon: SocialIcon }) => (
                    <MotionBox
                      key={label}
                      as="a"
                      href="#"
                      aria-label={label}
                      w={10}
                      h={10}
                      borderRadius="full"
                      bg="whiteAlpha.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      whileHover={{
                        scale: 1.15,
                        backgroundColor: '#FF6B35',
                        transition: { duration: 0.2 },
                      }}
                      cursor="pointer"
                    >
                      <SocialIcon size={18} />
                    </MotionBox>
                  ))}
                </HStack>
              </Box>
              
              {/* Quick Links */}
              <Flex gap={8} flexWrap="wrap">
                <Box>
                  <Heading size="sm" mb={4} fontFamily="heading">Quick Links</Heading>
                  <VStack align="start" spacing={2}>
                    <NavLink to="/about" footer>About Us</NavLink>
                    <NavLink to="/donate" footer>Donate</NavLink>
                    <NavLink to="/volunteer" footer>Volunteer</NavLink>
                    <NavLink to="/partners" footer>Partners</NavLink>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="sm" mb={4} fontFamily="heading">Resources</Heading>
                  <VStack align="start" spacing={2}>
                    <NavLink to="/learn" footer>DIY Guides</NavLink>
                    <NavLink to="/blog" footer>Stories</NavLink>
                    <NavLink to="/map" footer>Shelter Map</NavLink>
                    <NavLink to="/contact" footer>Get Help</NavLink>
                  </VStack>
                </Box>
                
                <Box>
                  <Heading size="sm" mb={4} fontFamily="heading">Contact</Heading>
                  <VStack align="start" spacing={2} fontSize="sm" opacity={0.9}>
                    <Box>📍 Bavaro, Dominican Republic</Box>
                    <Box>📧 hello@jadr.org</Box>
                    <Box>📱 +1 (809) 555-0123</Box>
                  </VStack>
                </Box>
              </Flex>
            </Flex>
            
            <Divider borderColor="whiteAlpha.200" />
            
            {/* Bottom Bar */}
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align="center"
              fontSize="sm"
              opacity={0.8}
              gap={4}
            >
              <Box>
                © {new Date().getFullYear()} John & Abigail Dog Rescue. All rights reserved.
              </Box>
              <HStack spacing={6}>
                <Link href="#" isExternal>Privacy Policy</Link>
                <Link href="#" isExternal>Terms of Service</Link>
                <Link href="#" isExternal>Transparency Report</Link>
              </HStack>
            </Flex>
            
            {/* Made with love badge */}
            <Flex justify="center" mt={8}>
              <Badge 
                colorScheme="whiteAlpha" 
                px={4} 
                py={2} 
                borderRadius="full"
                bg="whiteAlpha.100"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Heart size={14} fill="currentColor" color="#FF6B35" />
                <span>Made with love in Dominican Republic</span>
              </Badge>
            </Flex>
          </VStack>
        </Container>
      </MotionBox>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
        <DrawerOverlay bg="blackAlpha.600" />
        <DrawerContent bg="sand.50">
          <DrawerCloseButton 
            top={6} 
            right={6} 
            size="lg"
            color="gray.700"
          />
          <DrawerHeader pt={12}>
            <Flex align="center" gap={3}>
              <Box
                w={10}
                h={10}
                borderRadius="full"
                bgGradient="linear(to-br, brand.400, brand.600)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <PawPrint color="white" size={20} />
              </Box>
              <Box fontWeight="800" fontSize="lg" fontFamily="heading" color="brand.500">
                Menu
              </Box>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={2} align="stretch" pt={4}>
              {navLinks.map((link, index) => (
                <MotionBox
                  key={link.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    as={RouterLink}
                    to={link.to}
                    onClick={onClose}
                    variant="ghost"
                    justifyContent="flex-start"
                    leftIcon={<link.icon size={20} />}
                    fontWeight={location.pathname === link.to ? '700' : '500'}
                    color={location.pathname === link.to ? 'brand.500' : 'gray.700'}
                    size="lg"
                    borderRadius="2xl"
                    _hover={{ bg: 'brand.50' }}
                  >
                    {link.label}
                  </Button>
                </MotionBox>
              ))}
              
              <Divider my={4} />
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  as={RouterLink}
                  to="/donate"
                  colorScheme="brand"
                  onClick={onClose}
                  leftIcon={<Heart />}
                  size="lg"
                  w="full"
                  borderRadius="2xl"
                  fontWeight="700"
                  shadow="lg"
                >
                  Donate Now
                </Button>
              </MotionBox>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
