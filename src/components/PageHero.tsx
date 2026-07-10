import React, { useRef } from 'react';
import { Box, Container, VStack, HStack, Heading, Text, Badge } from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { paws } from '../utils/patterns';
import { SectionDivider } from './SectionDivider';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionBadge = motion(Badge);

type DividerVariant = 'wave' | 'curve' | 'tilt' | 'scallop' | 'drip';

interface PageHeroProps {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: React.ReactNode;
  /** Rendered in the handwritten accent font, on its own line. */
  highlight?: string;
  subtitle?: React.ReactNode;
  gradient?: string;
  /** Background photo URL. A dark overlay sits on top for contrast. */
  bgImage?: string;
  /** Colour of the section that follows (the divider reveals it). */
  dividerColor?: string;
  dividerVariant?: DividerVariant;
  children?: React.ReactNode;
}

/**
 * Hero band with a photographic/gradient background (always visible), a dark
 * overlay for contrast, a whispered paw pattern, subtle scroll parallax on the
 * image, stylised typography (serif display + handwritten accent) and a curved
 * SVG divider into the next section.
 */
export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  highlight,
  subtitle,
  gradient = 'linear(to-br, brand.500 via brand.600 to ocean.600)',
  bgImage,
  dividerColor = 'sand.100',
  dividerVariant = 'wave',
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Subtle parallax: image drifts down + scales a touch, content lifts gently.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.28]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Box
      ref={ref}
      as="section"
      w="full"
      bgGradient={gradient}
      color="white"
      pt={{ base: 28, md: 36 }}
      pb={{ base: 32, md: 44 }}
      position="relative"
      overflow="hidden"
    >
      {/* Photographic background with parallax (static opacity, never fades) */}
      {bgImage && (
        <MotionBox
          position="absolute"
          inset={0}
          style={{ y: bgY, scale: bgScale }}
          bgImage={`url(${bgImage})`}
          bgSize="cover"
          bgPosition="center"
          opacity={0.55}
          sx={{ mixBlendMode: 'soft-light' }}
        />
      )}
      {/* On-brand colour overlay: keeps the gradient vivid while darkening for contrast */}
      <Box position="absolute" inset={0} bgGradient="linear(to-br, rgba(196,69,39,0.5), rgba(0,46,82,0.72))" />
      <Box position="absolute" inset={0} bgGradient="linear(to-b, transparent 45%, blackAlpha.500)" />
      {/* Whispered paw pattern */}
      <Box position="absolute" inset={0} sx={{ backgroundImage: paws('#ffffff', 0.06, 96) }} />

      {/* Floating decorative blobs */}
      <MotionBox
        position="absolute"
        top={-120}
        right={-80}
        w={{ base: 260, md: 440 }}
        h={{ base: 260, md: 440 }}
        borderRadius="full"
        bg="whiteAlpha.100"
        filter="blur(90px)"
        animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />
      <MotionBox
        position="absolute"
        bottom={-40}
        left={-60}
        w={{ base: 200, md: 340 }}
        h={{ base: 200, md: 340 }}
        borderRadius="full"
        bg="coral.500"
        opacity={0.22}
        filter="blur(80px)"
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Container maxW="container.xl" px={4} position="relative">
        <MotionBox style={{ y: contentY, opacity: contentOpacity }}>
          <VStack spacing={{ base: 6, md: 7 }} align="center" textAlign="center">
            {eyebrow && (
              <MotionBadge
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                px={6}
                py={2.5}
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.300"
                color="white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <HStack spacing={2.5}>
                  {EyebrowIcon && <EyebrowIcon size={16} />}
                  <Text fontSize="sm" fontWeight="600" letterSpacing="0.22em" textTransform="uppercase" fontFamily="mono">
                    {eyebrow}
                  </Text>
                </HStack>
              </MotionBadge>
            )}

            <MotionHeading
              as="h1"
              fontSize={{ base: '3xl', sm: '4xl', md: '6xl', lg: '7xl' }}
              fontFamily="heading"
              fontWeight="800"
              lineHeight={0.98}
              letterSpacing="-0.03em"
              maxW="5xl"
              textShadow="0 2px 24px rgba(0,0,0,0.35)"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              {title}
              {highlight && (
                <Box
                  as="span"
                  display="block"
                  fontFamily="accent"
                  fontWeight="700"
                  fontSize={{ base: '5xl', sm: '6xl', md: '8xl' }}
                  lineHeight={1.05}
                  letterSpacing="normal"
                  mt={{ base: 1, md: 2 }}
                  bgGradient="linear(to-r, coral.200, tropical.200, coral.200)"
                  bgClip="text"
                  sx={{ WebkitTextStroke: '0.25px rgba(255,255,255,0.25)' }}
                >
                  {highlight}
                </Box>
              )}
            </MotionHeading>

            {subtitle && (
              <MotionText
                fontSize={{ base: 'md', md: 'xl' }}
                maxW="2xl"
                opacity={0.95}
                lineHeight={1.85}
                letterSpacing="0.01em"
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
        </MotionBox>
      </Container>

      {/* Curved divider into the next section */}
      <SectionDivider color={dividerColor} variant={dividerVariant} position="bottom" />
    </Box>
  );
};
