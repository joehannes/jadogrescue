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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Recycle,
  Scissors,
  Droplet,
  Sun,
  PackageOpen,
  Ruler,
  Hammer,
  BookOpen,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const materials = [
  { icon: Recycle, label: '200+ plastic bottles', note: 'Cleaned & dried' },
  { icon: PackageOpen, label: 'Palm fiber', note: 'Natural insulation' },
  { icon: Ruler, label: 'Wooden pallet', note: 'Raised base' },
  { icon: Scissors, label: 'Rope & wire', note: 'Locally sourced' },
  { icon: Droplet, label: 'Funnel + tubing', note: 'Rainwater system' },
  { icon: Hammer, label: 'Basic hand tools', note: 'Saw, knife, drill' },
];

const steps = [
  {
    icon: Recycle,
    title: 'Collect & Prepare Bottles',
    time: '30 min',
    color: 'tropical',
    text: 'Gather at least 200 clean, dry plastic bottles. Fill each with dry palm fiber or sand for insulation and structural strength.',
  },
  {
    icon: Ruler,
    title: 'Build the Frame',
    time: '45 min',
    color: 'ocean',
    text: 'Use a raised wooden pallet as the floor to keep dogs off hot or wet ground. Frame the walls with a simple rectangular structure.',
  },
  {
    icon: Hammer,
    title: 'Stack the Walls',
    time: '90 min',
    color: 'brand',
    text: 'Lay filled bottles like bricks, binding rows with wire and rope. The trapped air inside the bottles insulates against heat and cold.',
  },
  {
    icon: Sun,
    title: 'Add the Roof',
    time: '30 min',
    color: 'coral',
    text: 'Angle the roof for shade and rain runoff. A reflective or light-colored top keeps the interior cool under the Caribbean sun.',
  },
  {
    icon: Droplet,
    title: 'Install Rainwater System',
    time: '25 min',
    color: 'tropical',
    text: 'A simple funnel and tube channel roof runoff into a small bowl, giving dogs automatic access to clean drinking water.',
  },
];

const faqs = [
  {
    q: 'How long does a shelter last?',
    a: 'Properly built bottle shelters withstand sun, rain and wind for several years. The trapped air in each bottle resists UV degradation far better than a single sheet of plastic.',
  },
  {
    q: 'Do I need construction experience?',
    a: 'No. Our builds use only basic hand tools and follow a brick-stacking pattern anyone can learn in an afternoon. This guide plus a helper is enough.',
  },
  {
    q: 'Why plastic bottles instead of wood?',
    a: 'Bottles are free, abundant as waste, and their trapped air insulates against both heat and cold — something a plain wooden box cannot do. It also removes plastic from beaches and streets.',
  },
  {
    q: 'How does the rainwater system stay clean?',
    a: 'A first-flush diverter and a covered bowl keep debris out. In practice, frequent refills from regular Caribbean rain keep the water fresh.',
  },
  {
    q: 'Can I build one where I live?',
    a: 'Absolutely — the design adapts to almost any climate. Reach out through our contact page and we will share detailed measurements and tips for your area.',
  },
];

export const Learn: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHero
        eyebrow="DIY & Education"
        eyebrowIcon={BookOpen}
        title="Build a Shelter"
        highlight="From Recycled Bottles"
        subtitle="A free, open guide to the exact method our local builders use — insulated, weatherproof dog shelters made from plastic waste in about four hours."
        gradient="linear(to-br, tropical.500 via tropical.600 to ocean.600)"
      >
        <HStack spacing={3} color="white" opacity={0.95}>
          <Clock size={18} />
          <Text fontWeight="600">~4 hours</Text>
          <Text opacity={0.6}>•</Text>
          <Wrench size={18} />
          <Text fontWeight="600">Beginner friendly</Text>
        </HStack>
      </PageHero>

      {/* Materials */}
      <Container maxW="container.xl" px={4} py={{ base: 14, md: 20 }}>
        <VStack spacing={12}>
          <SectionHeading
            eyebrow="What You'll Need"
            eyebrowColor="tropical"
            title="Materials & Tools"
            subtitle="Almost everything here is recycled, donated, or already in a toolbox."
          />
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={5} w="full">
            {materials.map((m, i) => (
              <MotionCard
                key={m.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -5 }}
                borderRadius="2xl"
                bg="white"
                boxShadow="md"
              >
                <CardBody>
                  <VStack spacing={3} align="start">
                    <Box
                      w={12}
                      h={12}
                      borderRadius="xl"
                      bg="tropical.50"
                      color="tropical.500"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={m.icon} boxSize={6} />
                    </Box>
                    <Box>
                      <Text fontWeight="700" color="gray.800">{m.label}</Text>
                      <Text fontSize="sm" color="gray.500">{m.note}</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Steps */}
      <Box w="full" bgGradient="linear(to-b, white, sand.100)" py={{ base: 16, md: 24 }}>
        <Container maxW="container.lg" px={4}>
          <VStack spacing={14}>
            <SectionHeading
              eyebrow="The Process"
              title="Five Steps to a Safe Home"
              subtitle="Follow along at your own pace — each step builds on the last."
            />
            <VStack spacing={6} w="full" align="stretch">
              {steps.map((step, i) => (
                <MotionCard
                  key={step.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ x: 6 }}
                  borderRadius="3xl"
                  bg="white"
                  boxShadow="lg"
                  overflow="hidden"
                >
                  <CardBody p={{ base: 5, md: 7 }}>
                    <Flex gap={{ base: 4, md: 6 }} align="center">
                      <Box position="relative" flexShrink={0}>
                        <Flex
                          w={{ base: 14, md: 16 }}
                          h={{ base: 14, md: 16 }}
                          borderRadius="2xl"
                          bgGradient={`linear(to-br, ${step.color}.400, ${step.color}.600)`}
                          color="white"
                          align="center"
                          justify="center"
                        >
                          <Icon as={step.icon} boxSize={{ base: 6, md: 7 }} />
                        </Flex>
                        <Flex
                          position="absolute"
                          top={-2}
                          left={-2}
                          w={7}
                          h={7}
                          borderRadius="full"
                          bg="white"
                          boxShadow="md"
                          align="center"
                          justify="center"
                          fontWeight="800"
                          fontSize="sm"
                          color={`${step.color}.600`}
                        >
                          {i + 1}
                        </Flex>
                      </Box>
                      <Box flex={1}>
                        <HStack justify="space-between" flexWrap="wrap" mb={1}>
                          <Heading size="md" color={`${step.color}.600`}>{step.title}</Heading>
                          <Badge colorScheme={step.color} display="flex" alignItems="center" gap={1}>
                            <Clock size={12} /> {step.time}
                          </Badge>
                        </HStack>
                        <Text color="gray.600" lineHeight={1.7}>{step.text}</Text>
                      </Box>
                    </Flex>
                  </CardBody>
                </MotionCard>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* FAQ */}
      <Container maxW="container.md" px={4} py={{ base: 16, md: 24 }}>
        <VStack spacing={12}>
          <SectionHeading
            eyebrow="Good To Know"
            eyebrowColor="ocean"
            title="Frequently Asked Questions"
          />
          <Accordion allowToggle w="full">
            {faqs.map((faq, i) => (
              <MotionBox
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem
                  border="none"
                  mb={4}
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="sm"
                  overflow="hidden"
                  _hover={{ boxShadow: 'md' }}
                  transition="box-shadow 0.2s"
                >
                  <AccordionButton py={5} px={6} _hover={{ bg: 'sand.100' }} borderRadius="2xl">
                    <Box flex={1} textAlign="left" fontWeight="700" color="ocean.700">
                      {faq.q}
                    </Box>
                    <AccordionIcon color="brand.500" />
                  </AccordionButton>
                  <AccordionPanel pb={5} px={6} color="gray.600" lineHeight={1.7}>
                    {faq.a}
                  </AccordionPanel>
                </AccordionItem>
              </MotionBox>
            ))}
          </Accordion>

          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            w="full"
            bg="ocean.50"
            border="2px dashed"
            borderColor="ocean.200"
            borderRadius="3xl"
            p={8}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Heading size="md" color="ocean.700">Prefer we build it for you?</Heading>
              <Text color="gray.600" maxW="md">
                Not everyone can build — but everyone can help. Fund a shelter and a local worker
                builds it within days.
              </Text>
              <Button
                colorScheme="brand"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => navigate('/donate')}
              >
                Fund a Shelter — $10
              </Button>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};
