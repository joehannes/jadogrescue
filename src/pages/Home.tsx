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
  Badge,
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Wrench, Home as HomeIcon, PawPrint, ArrowRight, Sparkles, Waves, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import sheltersData from '../data/shelters.json';
import { ShelterCard } from '../components/ShelterCard';
import type { Shelter } from '../types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionHeading = motion(Heading);
const MotionBadge = motion(Badge);
const MotionText = motion(Text);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuredShelters = sheltersData.slice(0, 3) as Shelter[];
  const { scrollY } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);

  const stats = [
    { label: 'Shelters Built', number: '5+', help: 'Across Dominican Republic', icon: HomeIcon, color: 'brand' },
    { label: 'Dogs Rescued', number: '12+', help: 'Given safe homes', icon: PawPrint, color: 'ocean' },
    { label: 'Bottles Recycled', number: '1000+', help: 'Plastic waste repurposed', icon: Waves, color: 'tropical' },
  ];

  const steps = [
    { 
      icon: Heart, 
      title: 'Donate', 
      description: 'Your $10 donation funds one complete shelter',
      color: 'brand'
    },
    { 
      icon: Wrench, 
      title: 'Build', 
      description: 'Local workers build shelters in 4 hours',
      color: 'ocean'
    },
    { 
      icon: HomeIcon, 
      title: 'Rescue', 
      description: 'Street dogs get safe homes with rainwater',
      color: 'tropical'
    },
  ];

  return (
    <VStack spacing={0}>
      {/* Hero Section with Enhanced Design */}
      <MotionBox
        w="full"
        bgGradient="linear(to-br, brand.500 via brand.600 to ocean.600)"
        color="white"
        py={{ base: 20, md: 32 }}
        position="relative"
        overflow="hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Decorative Elements */}
        <MotionBox
          position="absolute"
          top={-100}
          right={-100}
          w={400}
          h={400}
          borderRadius="full"
          bg="whiteAlpha.100"
          blur="100px"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <MotionBox
          position="absolute"
          bottom={-50}
          left={-50}
          w={300}
          h={300}
          borderRadius="full"
          bg="coral.500"
          opacity={0.2}
          blur="80px"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <Container maxW="container.xl" px={4} position="relative">
          <VStack spacing={8} align="center" textAlign="center">
            {/* Tagline Badge */}
            <MotionBadge
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              px={6}
              py={2}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <HStack spacing={2}>
                <Sparkles size={16} />
                <Text fontSize="sm" fontWeight="600" letterSpacing="wide">
                  MAKING SOMETHING OUT OF LITTLE
                </Text>
              </HStack>
            </MotionBadge>
            
            <MotionHeading
              as="h1"
              size={{ base: '3xl', md: '6xl' }}
              fontFamily="heading"
              fontWeight="800"
              lineHeight={1.1}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Every Bottle Saves
              <Box as="span" display="block" bgGradient="linear(to-r, coral.200, tropical.200)" bgClip="text">
                A Life
              </Box>
            </MotionHeading>
            
            <MotionText 
              fontSize={{ base: 'lg', md: 'xl' }} 
              maxW="2xl" 
              opacity={0.9}
              lineHeight={1.8}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Building insulated dog shelters from recycled plastic bottles in the Dominican Republic. 
              For just <Text as="span" fontWeight="700" color="coral.200">$10</Text>, a local worker builds 
              a home in 4 hours—complete with automatic rainwater drinking places.
            </MotionText>
            
            <HStack spacing={4} pt={4}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  colorScheme="brand"
                  onClick={() => navigate('/donate')}
                  fontSize="lg"
                  px={10}
                  py={8}
                  bg="white"
                  color="brand.600"
                  _hover={{ 
                    bg: 'whiteAlpha.900',
                    transform: 'translateY(-4px)',
                    boxShadow: '2xl'
                  }}
                  rightIcon={<ArrowRight size={20} />}
                  fontWeight="700"
                  shadow="2xl"
                >
                  Donate $10
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ 
                    bg: 'whiteAlpha.100',
                    transform: 'translateY(-4px)',
                  }}
                  onClick={() => navigate('/learn')}
                  fontSize="lg"
                  px={10}
                  py={8}
                  rightIcon={<ArrowRight size={20} />}
                  fontWeight="600"
                >
                  Learn More
                </Button>
              </motion.div>
            </HStack>
          </VStack>
        </Container>
        
        {/* Wave Divider */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h={20}
          bg="sand.100"
          sx={{
            clipPath: 'ellipse(150% 100% at 50% 100%)',
          }}
        />
      </MotionBox>

      {/* Impact Stats with Floating Cards */}
      <Container maxW="container.xl" px={4} py={20}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {stats.map((stat, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ 
                y: -8,
                boxShadow: '2xl',
                transition: { duration: 0.3 }
              }}
              borderRadius="3xl"
              boxShadow="xl"
              bg="white"
              overflow="visible"
            >
              <CardBody textAlign="center" py={10}>
                <Stat>
                  {/* Icon Badge */}
                  <MotionBox
                    w={16}
                    h={16}
                    mx="auto"
                    mb={4}
                    borderRadius="2xl"
                    bgGradient={`linear(to-br, ${stat.color}.100, ${stat.color}.200)`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon as={stat.icon} boxSize={8} color={`${stat.color}.500`} />
                  </MotionBox>
                  
                  <StatNumber 
                    fontSize="6xl" 
                    fontWeight="800"
                    bgGradient={`linear(to-r, ${stat.color}.400, ${stat.color}.600)`}
                    bgClip="text"
                    lineHeight={1}
                  >
                    {stat.number}
                  </StatNumber>
                  <StatLabel color="gray.600" fontSize="lg" fontWeight="600" mt={2}>
                    {stat.label}
                  </StatLabel>
                  <StatHelpText color="gray.500" fontSize="sm">{stat.help}</StatHelpText>
                </Stat>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>
      </Container>

      {/* How It Works with Enhanced Visuals */}
      <Box w="full" bgGradient="linear(to-b, white, sand.50)" py={24}>
        <Container maxW="container.xl" px={4}>
          <VStack spacing={16}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <VStack spacing={4}>
                <Badge 
                  colorScheme="brand" 
                  px={4} 
                  py={2} 
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="600"
                  letterSpacing="wide"
                >
                  THE PROCESS
                </Badge>
                <Heading size="2xl" textAlign="center" fontFamily="heading" color="ocean.600">
                  How Your Donation Creates Impact
                </Heading>
                <Text color="gray.600" maxW="xl" textAlign="center" fontSize="lg">
                  From your generous gift to a dog's safe home—here's how we make it happen
                </Text>
              </VStack>
            </MotionBox>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
              {steps.map((step, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  position="relative"
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <Box
                      display={{ base: 'none', md: 'block' }}
                      position="absolute"
                      top={12}
                      left="60%"
                      w="80%"
                      h={0.5}
                      bgGradient="linear(to-r, brand.200, transparent)"
                      zIndex={0}
                    />
                  )}
                  
                  <VStack spacing={6} align="center" textAlign="center" position="relative" zIndex={1}>
                    {/* Step Number Badge */}
                    <MotionBox
                      w={24}
                      h={24}
                      borderRadius="full"
                      bgGradient={`linear(to-br, ${step.color}.400, ${step.color}.600)`}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="4xl"
                      shadow="xl"
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 360,
                        transition: { duration: 0.5 }
                      }}
                    >
                      <Icon as={step.icon} boxSize={10} />
                    </MotionBox>
                    
                    <VStack spacing={3}>
                      <Heading size="lg" color={`${step.color}.600`}>
                        {step.title}
                      </Heading>
                      <Text color="gray.600" lineHeight={1.7}>
                        {step.description}
                      </Text>
                    </VStack>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Featured Shelters */}
      <Container maxW="container.xl" px={4} py={24}>
        <VStack spacing={12}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={4}>
              <Badge 
                colorScheme="tropical" 
                px={4} 
                py={2} 
                borderRadius="full"
                fontSize="sm"
                fontWeight="600"
              >
                OUR WORK IN ACTION
              </Badge>
              <Heading size="2xl" fontFamily="heading" color="ocean.600">
                Featured Shelters
              </Heading>
            </VStack>
          </MotionBox>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {featuredShelters.map((shelter, index) => (
              <MotionBox
                key={shelter.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15 }}
              >
                <ShelterCard shelter={shelter} />
              </MotionBox>
            ))}
          </SimpleGrid>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button
              as="a"
              href="/map"
              colorScheme="brand"
              variant="outline"
              size="lg"
              px={8}
              rightIcon={<ArrowRight size={20} />}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
            >
              View All Shelters on Map
            </Button>
          </motion.div>
        </VStack>
      </Container>
    </VStack>
  );
};
