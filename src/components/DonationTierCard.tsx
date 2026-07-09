import React from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Box,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCheck, FiHeart } from 'react-icons/fi';
import { DonationTier } from '../types';

const MotionCard = motion(Card);

interface DonationTierCardProps {
  tier: DonationTier;
  onSelect: (tier: DonationTier) => void;
  isSelected: boolean;
}

export const DonationTierCard: React.FC<DonationTierCardProps> = ({
  tier,
  onSelect,
  isSelected,
}) => {
  return (
    <MotionCard
      whileHover={{ y: -8, boxShadow: '2xl' }}
      transition={{ duration: 0.3 }}
      borderWidth={isSelected ? '3px' : '1px'}
      borderColor={isSelected ? 'brand.500' : 'gray.200'}
      borderRadius="2xl"
      overflow="hidden"
      cursor="pointer"
      onClick={() => onSelect(tier)}
      bg={isSelected ? 'brand.50' : 'white'}
    >
      <CardBody>
        <VStack spacing={4} align="center">
          <Box
            w={16}
            h={16}
            borderRadius="full"
            bg={isSelected ? 'brand.500' : 'brand.100'}
            color={isSelected ? 'white' : 'brand.500'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
            fontWeight="800"
          >
            ${tier.amount}
          </Box>

          <Heading size="lg" color="brand.700" textAlign="center">
            {tier.title}
          </Heading>

          <VStack spacing={2} align="start" w="full">
            {tier.impact.map((item, index) => (
              <HStack key={index} spacing={2}>
                <Icon as={FiCheck} color="tropical.500" />
                <Text fontSize="sm" color="gray.600">
                  {item}
                </Text>
              </HStack>
            ))}
          </VStack>

          <Button
            w="full"
            colorScheme="brand"
            leftIcon={<FiHeart />}
            variant={isSelected ? 'solid' : 'outline'}
          >
            Select Tier
          </Button>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};
