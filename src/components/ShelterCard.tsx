import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Image,
  Badge,
  Text,
  VStack,
  HStack,
  Button,
  Heading,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Droplet } from 'lucide-react';
import { Shelter } from '../types';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);

interface ShelterCardProps {
  shelter: Shelter;
}

export const ShelterCard: React.FC<ShelterCardProps> = ({ shelter }) => {
  const navigate = useNavigate();

  const statusColors = {
    active: 'tropical',
    construction: 'brand',
    planned: 'ocean',
  };

  return (
    <MotionCard
      whileHover={{ y: -5, boxShadow: 'xl' }}
      transition={{ duration: 0.2 }}
      overflow="hidden"
      borderRadius="2xl"
    >
      <Box position="relative" h={200} bgGradient="linear(to-br, brand.400, ocean.500)">
        <Image
          src={shelter.photos[0]}
          alt={`Shelter in ${shelter.location.city}`}
          h={200}
          w="100%"
          objectFit="cover"
          fallback={<Box h={200} w="100%" bgGradient="linear(to-br, brand.400, ocean.500)" />}
        />
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={statusColors[shelter.status]}
          px={3}
          py={1}
          borderRadius="full"
          textTransform="capitalize"
        >
          {shelter.status}
        </Badge>
      </Box>

      <CardBody>
        <VStack align="start" spacing={3}>
          <Heading size="md">{shelter.location.city}</Heading>
          
          <HStack color="gray.600" fontSize="sm">
            <MapPin size={16} />
            <Text>{shelter.location.address}</Text>
          </HStack>

          <HStack color="gray.600" fontSize="sm">
            <Calendar size={16} />
            <Text>Built: {new Date(shelter.built).toLocaleDateString()}</Text>
          </HStack>

          {shelter.hasRainwater && (
            <HStack color="tropical.500" fontSize="sm" fontWeight="600">
              <Droplet size={16} />
              <Text>Rainwater System Included</Text>
            </HStack>
          )}

          <Box
            bg="brand.50"
            px={3}
            py={2}
            borderRadius="lg"
            w="full"
          >
            <Text fontWeight="700" color="brand.700">
              🐕 {shelter.dogs} Dog{shelter.dogs !== 1 ? 's' : ''} Rescued
            </Text>
          </Box>

          <Button
            w="full"
            colorScheme="brand"
            variant="outline"
            onClick={() => navigate(`/map?shelter=${shelter.id}`)}
          >
            View on Map
          </Button>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};
