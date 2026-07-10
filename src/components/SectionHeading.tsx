import React from 'react';
import { VStack, Heading, Text, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionVStack = motion(VStack);

interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowColor?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'start';
  titleColor?: string;
}

/** Animated section header used across content pages for a consistent rhythm. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  eyebrowColor = 'brand',
  title,
  subtitle,
  align = 'center',
  titleColor = 'ocean.600',
}) => {
  return (
    <MotionVStack
      spacing={4}
      align={align}
      textAlign={align}
      maxW={align === 'center' ? '2xl' : undefined}
      mx={align === 'center' ? 'auto' : undefined}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      {eyebrow && (
        <Badge
          colorScheme={eyebrowColor}
          px={4}
          py={2}
          borderRadius="full"
          fontSize="sm"
          fontWeight="600"
          letterSpacing="wide"
        >
          {eyebrow}
        </Badge>
      )}
      <Heading size={{ base: 'xl', md: '2xl' }} fontFamily="heading" color={titleColor} lineHeight={1.2}>
        {title}
      </Heading>
      {subtitle && (
        <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} lineHeight={1.7}>
          {subtitle}
        </Text>
      )}
    </MotionVStack>
  );
};
