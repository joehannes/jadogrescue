import React from 'react';
import { Box, Container, VStack, HStack, Heading, Text, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionBadge = motion(Badge);

interface PageHeroProps {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: React.ReactNode;
  highlight?: string;
  subtitle?: React.ReactNode;
  gradient?: string;
  children?: React.ReactNode;
}

/**
 * Reusable hero band matching the Home hero: animated gradient, floating
 * blobs, glass badge and a wave divider into the sand background below.
 */
export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  highlight,
  subtitle,
  gradient = 'linear(to-br, brand.500 via brand.600 to ocean.600)',
  children,
}) => {
  return (
    <MotionBox
      w="full"
      bgGradient={gradient}
      color="white"
      pt={{ base: 24, md: 32 }}
      pb={{ base: 28, md: 40 }}
      position="relative"
      overflow="hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Floating decorative blobs */}
      <MotionBox
        position="absolute"
        top={-120}
        right={-80}
        w={{ base: 260, md: 420 }}
        h={{ base: 260, md: 420 }}
        borderRadius="full"
        bg="whiteAlpha.100"
        filter="blur(90px)"
        animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />
      <MotionBox
        position="absolute"
        bottom={-60}
        left={-60}
        w={{ base: 200, md: 320 }}
        h={{ base: 200, md: 320 }}
        borderRadius="full"
        bg="coral.500"
        opacity={0.2}
        filter="blur(80px)"
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Subtle dotted texture */}
      <Box
        position="absolute"
        inset={0}
        opacity={0.15}
        sx={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <Container maxW="container.xl" px={4} position="relative">
        <VStack spacing={6} align="center" textAlign="center">
          {eyebrow && (
            <MotionBadge
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              px={6}
              py={2}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.300"
              color="white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <HStack spacing={2}>
                {EyebrowIcon && <EyebrowIcon size={16} />}
                <Text fontSize="sm" fontWeight="600" letterSpacing="wide" textTransform="uppercase">
                  {eyebrow}
                </Text>
              </HStack>
            </MotionBadge>
          )}

          <MotionHeading
            as="h1"
            size={{ base: '2xl', md: '5xl' }}
            fontFamily="heading"
            fontWeight="800"
            lineHeight={1.1}
            maxW="4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            {title}
            {highlight && (
              <Box as="span" display="block" bgGradient="linear(to-r, coral.200, tropical.200)" bgClip="text">
                {highlight}
              </Box>
            )}
          </MotionHeading>

          {subtitle && (
            <MotionText
              fontSize={{ base: 'md', md: 'xl' }}
              maxW="2xl"
              opacity={0.92}
              lineHeight={1.8}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {subtitle}
            </MotionText>
          )}

          {children && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              pt={2}
            >
              {children}
            </MotionBox>
          )}
        </VStack>
      </Container>

      {/* Wave divider into page background */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h={{ base: 12, md: 20 }}
        bg="sand.100"
        sx={{ clipPath: 'ellipse(150% 100% at 50% 100%)' }}
      />
    </MotionBox>
  );
};
