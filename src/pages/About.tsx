import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Icon,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Heart,
  Eye,
  Recycle,
  Users,
  HandHeart,
  Sparkles,
  ArrowRight,
  Quote,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { IMAGES } from '../utils/media';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const values = [
  {
    icon: Eye,
    title: 'Radical Transparency',
    color: 'ocean',
    text: 'Every shelter is geotagged, photographed and dated. You see exactly where your $10 went — no overhead, no mystery.',
  },
  {
    icon: Recycle,
    title: 'Waste Into Worth',
    color: 'tropical',
    text: 'Discarded plastic bottles become insulated walls. We turn a pollution problem into shelter for street dogs.',
  },
  {
    icon: Users,
    title: 'Local Livelihoods',
    color: 'brand',
    text: 'Shelters are built by local workers who are paid fairly. Your donation supports a family and a dog at once.',
  },
  {
    icon: HandHeart,
    title: 'Dignity For Dogs',
    color: 'coral',
    text: 'Shade from the sun, shelter from the rain, and automatic rainwater to drink. Small comforts, big difference.',
  },
];

const timeline = [
  { year: '2023', title: 'The Idea', text: 'John & Abigail start collecting bottles on the beaches of Bavaro, wondering if trash could become shelter.' },
  { year: '2024', title: 'First Shelter', text: 'Carlos builds our first insulated shelter in Santo Domingo from 200+ recycled bottles.' },
  { year: '2024', title: 'Rainwater Systems', text: 'We add automatic rainwater drinking places — clean water even in the dry season.' },
  { year: 'Today', title: 'Growing Network', text: '5+ shelters, 12+ dogs rescued, and partnerships with local comedors feeding dogs daily.' },
];

const stats = [
  { number: '5+', label: 'Shelters Built', color: 'brand' },
  { number: '12+', label: 'Dogs Rescued', color: 'ocean' },
  { number: '1000+', label: 'Bottles Recycled', color: 'tropical' },
  { number: '100%', label: 'Goes To The Cause', color: 'coral' },
];

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHero
        eyebrow="Our Story"
        eyebrowIcon={Sparkles}
        title="Making Something"
        highlight="Out of Little"
        subtitle="John & Abigail Dog Rescue connects global micro-donors with local Dominican rescue through radical transparency — one recycled bottle, one shelter, one dog at a time."
        bgImage={IMAGES.heroDog}
      />

      {/* Mission statement with quote */}
      <Container maxW="container.lg" px={4} py={{ base: 12, md: 20 }}>
        <MotionCard
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          borderRadius="3xl"
          bgGradient="linear(to-br, ocean.500, ocean.700)"
          color="white"
          overflow="hidden"
          position="relative"
        >
          <Box position="absolute" top={-8} left={6} opacity={0.15}>
            <Quote size={120} />
          </Box>
          <CardBody py={{ base: 10, md: 14 }} px={{ base: 6, md: 14 }} position="relative">
            <VStack spacing={6} align="center" textAlign="center">
              <Heading size={{ base: 'lg', md: 'xl' }} fontFamily="heading" fontWeight="700" lineHeight={1.4}>
                “We believe a street dog's life is worth more than a plastic bottle's second use —
                so we combine the two and let compassion compound.”
              </Heading>
              <HStack spacing={3}>
                <Box w={12} h={12} borderRadius="full" bg="whiteAlpha.300" display="flex" alignItems="center" justifyContent="center">
                  <Heart size={22} fill="currentColor" />
                </Box>
                <VStack spacing={0} align="start">
                  <Text fontWeight="700">John & Abigail</Text>
                  <Text fontSize="sm" opacity={0.8} fontFamily="mono">FOUNDERS, BAVARO DR</Text>
                </VStack>
              </HStack>
            </VStack>
          </CardBody>
        </MotionCard>
      </Container>

      {/* Impact numbers */}
      <Container maxW="container.xl" px={4} pb={{ base: 12, md: 16 }}>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          {stats.map((s, i) => (
            <MotionBox
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              py={8}
              textAlign="center"
            >
              <Text
                fontSize={{ base: '3xl', md: '5xl' }}
                fontWeight="800"
                bgGradient={`linear(to-r, ${s.color}.400, ${s.color}.600)`}
                bgClip="text"
                lineHeight={1}
              >
                {s.number}
              </Text>
              <Text mt={2} color="gray.600" fontWeight="600" fontSize={{ base: 'sm', md: 'md' }}>
                {s.label}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* Values */}
      <Box w="full" bgGradient="linear(to-b, sand.100, white)" py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl" px={4}>
          <VStack spacing={14}>
            <SectionHeading
              eyebrow="What We Stand For"
              title="Values That Guide Every Build"
              subtitle="Four principles keep us honest, local, and focused on the dogs."
            />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              {values.map((v, i) => (
                <MotionCard
                  key={v.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  borderRadius="3xl"
                  bg="white"
                  boxShadow="lg"
                >
                  <CardBody p={8}>
                    <Flex gap={5} align="start">
                      <MotionBox
                        flexShrink={0}
                        w={16}
                        h={16}
                        borderRadius="2xl"
                        bgGradient={`linear(to-br, ${v.color}.400, ${v.color}.600)`}
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        whileHover={{ rotate: 10, scale: 1.05 }}
                      >
                        <Icon as={v.icon} boxSize={7} />
                      </MotionBox>
                      <Box>
                        <Heading size="md" mb={2} color={`${v.color}.600`}>
                          {v.title}
                        </Heading>
                        <Text color="gray.600" lineHeight={1.7}>
                          {v.text}
                        </Text>
                      </Box>
                    </Flex>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Timeline */}
      <Container maxW="container.lg" px={4} py={{ base: 16, md: 24 }}>
        <VStack spacing={14}>
          <SectionHeading
            eyebrow="How We Got Here"
            eyebrowColor="tropical"
            title="Our Journey So Far"
          />
          <Box position="relative" w="full">
            {/* vertical line */}
            <Box
              position="absolute"
              left={{ base: 4, md: '50%' }}
              top={0}
              bottom={0}
              w="2px"
              bgGradient="linear(to-b, brand.300, ocean.300)"
              transform={{ md: 'translateX(-50%)' }}
            />
            <VStack spacing={10} align="stretch">
              {timeline.map((t, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5 }}
                >
                  <Flex
                    direction={{ base: 'row', md: i % 2 === 0 ? 'row' : 'row-reverse' }}
                    align="center"
                    gap={6}
                  >
                    <Box flex={1} pl={{ base: 12, md: 0 }} textAlign={{ base: 'left', md: i % 2 === 0 ? 'right' : 'left' }}>
                      <Card borderRadius="2xl" boxShadow="md" _hover={{ boxShadow: 'xl' }} transition="all 0.3s">
                        <CardBody>
                          <Badge colorScheme="brand" mb={2}>{t.year}</Badge>
                          <Heading size="md" color="ocean.600" mb={1}>{t.title}</Heading>
                          <Text color="gray.600" fontSize="sm">{t.text}</Text>
                        </CardBody>
                      </Card>
                    </Box>
                    <Box
                      position={{ base: 'absolute', md: 'static' }}
                      left={{ base: 4, md: 'auto' }}
                      transform={{ base: 'translateX(-45%)', md: 'none' }}
                      w={6}
                      h={6}
                      borderRadius="full"
                      bg="brand.500"
                      border="4px solid"
                      borderColor="sand.100"
                      flexShrink={0}
                      zIndex={1}
                    />
                    <Box flex={1} display={{ base: 'none', md: 'block' }} />
                  </Flex>
                </MotionBox>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* CTA */}
      <Container maxW="container.lg" px={4} pb={{ base: 16, md: 24 }}>
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          bgGradient="linear(to-r, brand.500, coral.500)"
          borderRadius="3xl"
          p={{ base: 8, md: 12 }}
          textAlign="center"
          color="white"
          boxShadow="2xl"
        >
          <VStack spacing={5}>
            <Heading size={{ base: 'lg', md: 'xl' }} fontFamily="heading">
              Be part of the next chapter
            </Heading>
            <Text maxW="xl" opacity={0.95} fontSize="lg">
              Every $10 builds a shelter and rescues a dog. Join hundreds of micro-donors making
              something out of little.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                size="lg"
                bg="white"
                color="brand.600"
                rightIcon={<Heart size={18} />}
                _hover={{ bg: 'whiteAlpha.900', transform: 'translateY(-3px)' }}
                onClick={() => navigate('/donate')}
              >
                Donate $10
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                rightIcon={<ArrowRight size={18} />}
                _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-3px)' }}
                onClick={() => navigate('/volunteer')}
              >
                Volunteer
              </Button>
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};
