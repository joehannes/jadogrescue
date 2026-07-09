import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiHeart, FiTool, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import sheltersData from '../data/shelters.json';
import { ShelterCard } from '../components/ShelterCard';

const MotionBox = motion(Box);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuredShelters = sheltersData.slice(0, 3);

  const stats = [
    { label: 'Shelters Built', number: '5+', help: 'Across Dominican Republic' },
    { label: 'Dogs Rescued', number: '12+', help: 'Given safe homes' },
    { label: 'Bottles Recycled', number: '1000+', help: 'Plastic waste repurposed' },
  ];

  const steps = [
    { icon: FiHeart, title: 'Donate', description: 'Your $10 donation funds one complete shelter' },
    { icon: FiTool, title: 'Build', description: 'Local workers build shelters in 4 hours' },
    { icon: FiHome, title: 'Rescue', description: 'Street dogs get safe homes with rainwater' },
  ];

  return (
    <VStack spacing={0}>
      {/* Hero Section */}
      <MotionBox
        w="full"
        bgGradient="linear(to-r, brand.500, ocean.500)"
        color="white"
        py={{ base: 16, md: 24 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Container maxW="container.xl" px={4}>
          <VStack spacing={6} align="center" textAlign="center">
            <Heading
              as="h1"
              size={{ base: '2xl', md: '4xl' }}
              fontFamily="heading"
              fontWeight="800"
            >
              Making Something Out of Little
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="2xl" opacity={0.9}>
              Building insulated dog shelters from recycled plastic bottles in the Dominican Republic. 
              For just $10, a local worker builds a home in 4 hours—complete with automatic rainwater drinking places.
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                colorScheme="brand"
                onClick={() => navigate('/donate')}
                fontSize="lg"
                px={8}
              >
                Donate $10
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => navigate('/learn')}
                fontSize="lg"
                px={8}
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </Container>
      </MotionBox>

      {/* Impact Stats */}
      <Container maxW="container.xl" px={4} py={16}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {stats.map((stat, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              borderRadius="2xl"
              boxShadow="md"
            >
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel color="gray.600" fontSize="lg">{stat.label}</StatLabel>
                  <StatNumber color="brand.500" fontSize="4xl" fontWeight="800">
                    {stat.number}
                  </StatNumber>
                  <StatHelpText color="gray.500">{stat.help}</StatHelpText>
                </Stat>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>
      </Container>

      {/* How It Works */}
      <Box w="full" bg="white" py={16}>
        <Container maxW="container.xl" px={4}>
          <VStack spacing={12}>
            <Heading size="2xl" textAlign="center" fontFamily="heading" color="ocean.500">
              How It Works
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {steps.map((step, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <VStack spacing={4} align="center" textAlign="center">
                    <Box
                      w={20}
                      h={20}
                      borderRadius="full"
                      bg="brand.100"
                      color="brand.500"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="3xl"
                    >
                      <Icon as={step.icon} />
                    </Box>
                    <Heading size="md">{step.title}</Heading>
                    <Text color="gray.600">{step.description}</Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Featured Shelters */}
      <Container maxW="container.xl" px={4} py={16}>
        <VStack spacing={8}>
          <Heading size="2xl" fontFamily="heading" color="ocean.500">
            Featured Shelters
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {featuredShelters.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </SimpleGrid>
          <Button
            as="a"
            href="/map"
            colorScheme="brand"
            variant="outline"
            size="lg"
          >
            View All on Map
          </Button>
        </VStack>
      </Container>
    </VStack>
  );
};
