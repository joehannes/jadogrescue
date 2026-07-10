import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Building2,
  UtensilsCrossed,
  Store,
  Handshake,
  BadgeCheck,
  MapPin,
  TrendingUp,
  Send,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { IMAGES } from '../utils/media';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const partnerTypes = [
  { icon: UtensilsCrossed, title: 'Comedors & Restaurants', color: 'brand', text: 'Donate food waste to feed nearby rescued dogs and host a shelter out back.' },
  { icon: Store, title: 'Local Businesses', color: 'ocean', text: 'Become a bottle drop-off point and get featured as a community sponsor.' },
  { icon: Building2, title: 'Hotels & Resorts', color: 'tropical', text: 'Sponsor shelters for the strays around your property and delight guests.' },
];

const benefits = [
  { icon: BadgeCheck, title: 'Verified Impact', text: 'Your logo appears on the geotagged shelters you help fund.' },
  { icon: MapPin, title: 'Local Visibility', text: 'Featured on our map and social channels as a community partner.' },
  { icon: TrendingUp, title: 'Real ESG Story', text: 'Turn plastic waste and food scraps into a measurable good-news story.' },
  { icon: Handshake, title: 'Zero Hassle', text: 'We handle building, placement and upkeep — you provide space or scraps.' },
];

const partnerSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  message: z.string().min(5, 'Tell us a little about your business'),
});

type PartnerForm = z.infer<typeof partnerSchema>;

export const Partners: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerForm>({ resolver: zodResolver(partnerSchema) });

  const onSubmit = async (data: PartnerForm) => {
    await new Promise((r) => setTimeout(r, 600));
    console.log('Partner inquiry', data);
    setSubmitted(true);
    reset();
  };

  return (
    <Box>
      <PageHero
        eyebrow="Partner With Us"
        eyebrowIcon={Handshake}
        title="Good Business,"
        highlight="Better Community"
        subtitle="Restaurants, hotels and local shops power our work. Share food waste, host a shelter, or collect bottles — and give the street dogs of the DR a fighting chance."
        gradient="linear(to-br, ocean.500 via brand.500 to coral.500)"
        bgImage={IMAGES.heroBeach}
      />

      {/* Partner types */}
      <Container maxW="container.xl" px={4} py={{ base: 14, md: 20 }}>
        <VStack spacing={12}>
          <SectionHeading
            eyebrow="Who We Work With"
            eyebrowColor="ocean"
            title="Ways To Partner"
            subtitle="Three simple ways local businesses join the mission."
          />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            {partnerTypes.map((p, i) => (
              <MotionCard
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                borderRadius="3xl"
                bg="white"
                boxShadow="lg"
                textAlign="center"
              >
                <CardBody p={8}>
                  <VStack spacing={5}>
                    <MotionBox
                      w={20}
                      h={20}
                      borderRadius="full"
                      bgGradient={`linear(to-br, ${p.color}.400, ${p.color}.600)`}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      whileHover={{ rotate: 8, scale: 1.08 }}
                    >
                      <Icon as={p.icon} boxSize={9} />
                    </MotionBox>
                    <Heading size="md" color={`${p.color}.600`}>{p.title}</Heading>
                    <Text color="gray.600" lineHeight={1.7}>{p.text}</Text>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Benefits */}
      <Box w="full" bgGradient="linear(to-b, sand.100, white)" py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl" px={4}>
          <VStack spacing={12}>
            <SectionHeading
              eyebrow="Why Partner"
              title="What's In It For You"
              subtitle="Doing good that's visible, verifiable and effortless."
            />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
              {benefits.map((b, i) => (
                <MotionBox
                  key={b.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <Flex gap={5} align="start" bg="white" borderRadius="2xl" boxShadow="md" p={6} _hover={{ boxShadow: 'lg', transform: 'translateY(-3px)' }} transition="all 0.3s">
                    <Box flexShrink={0} w={12} h={12} borderRadius="xl" bg="tropical.50" color="tropical.500" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={b.icon} boxSize={6} />
                    </Box>
                    <Box>
                      <Heading size="sm" color="ocean.700" mb={1}>{b.title}</Heading>
                      <Text color="gray.600" fontSize="sm" lineHeight={1.7}>{b.text}</Text>
                    </Box>
                  </Flex>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Inquiry form */}
      <Container maxW="container.md" px={4} py={{ base: 16, md: 24 }}>
        <MotionCard
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          borderRadius="3xl"
          bg="white"
          boxShadow="2xl"
          overflow="hidden"
        >
          <Box bgGradient="linear(to-r, ocean.500, coral.500)" py={8} px={{ base: 6, md: 10 }} color="white" textAlign="center">
            <Heading size="lg" fontFamily="heading">Become a Partner</Heading>
            <Text opacity={0.9} mt={2}>Tell us about your business and we'll design a partnership that fits.</Text>
          </Box>
          <CardBody p={{ base: 6, md: 10 }}>
            {submitted && (
              <Alert status="success" borderRadius="xl" mb={6}>
                <AlertIcon />
                Thanks for reaching out! We'll contact you to explore a partnership. 🤝
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={5}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="full">
                  <FormControl isInvalid={!!errors.businessName} isRequired>
                    <FormLabel>Business Name</FormLabel>
                    <Input {...register('businessName')} placeholder="Your business" />
                    <FormErrorMessage>{errors.businessName?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.contactName} isRequired>
                    <FormLabel>Contact Name</FormLabel>
                    <Input {...register('contactName')} placeholder="Your name" />
                    <FormErrorMessage>{errors.contactName?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="full">
                  <FormControl isInvalid={!!errors.email} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input {...register('email')} type="email" placeholder="you@business.com" />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Phone (optional)</FormLabel>
                    <Input {...register('phone')} placeholder="+1 (809) ..." />
                  </FormControl>
                </SimpleGrid>
                <FormControl isInvalid={!!errors.message} isRequired>
                  <FormLabel>How would you like to help?</FormLabel>
                  <Textarea {...register('message')} placeholder="Food waste, bottle collection, hosting a shelter, sponsorship..." rows={4} />
                  <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  leftIcon={<Send size={18} />}
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                >
                  Start a Partnership
                </Button>
              </VStack>
            </form>
          </CardBody>
        </MotionCard>
      </Container>
    </Box>
  );
};
