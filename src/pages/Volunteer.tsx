import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Icon,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Users,
  Hammer,
  Camera,
  Megaphone,
  Truck,
  HeartHandshake,
  Send,
  Sparkles,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { IMAGES } from '../utils/media';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const roles = [
  { icon: Hammer, title: 'Shelter Builder', color: 'brand', text: 'Join a local build day and help assemble shelters from recycled bottles.' },
  { icon: Camera, title: 'Storyteller', color: 'ocean', text: 'Photograph and film builds and rescues so donors can see their impact.' },
  { icon: Megaphone, title: 'Community Outreach', color: 'tropical', text: 'Spread the word online and connect us with new neighborhoods and donors.' },
  { icon: Truck, title: 'Bottle Collector', color: 'coral', text: 'Gather and prep recycled bottles from beaches, businesses and homes.' },
  { icon: HeartHandshake, title: 'Dog Care', color: 'palm', text: 'Help feed, water and check on rescued dogs living near our shelters.' },
  { icon: Users, title: 'Skills & Trades', color: 'brand', text: 'Offer design, translation, fundraising or veterinary skills remotely or on-site.' },
];

const volunteerSchema = z.object({
  name: z.string().min(2, 'Please tell us your name'),
  email: z.string().email('Please enter a valid email'),
  skills: z.string().min(2, 'Let us know how you can help'),
  availability: z.string().min(1, 'Please choose your availability'),
  message: z.string().optional(),
});

type VolunteerForm = z.infer<typeof volunteerSchema>;

export const Volunteer: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerForm>({ resolver: zodResolver(volunteerSchema) });

  const onSubmit = async (data: VolunteerForm) => {
    // Placeholder: in production this posts to an API / email service.
    await new Promise((r) => setTimeout(r, 600));
    console.log('Volunteer signup', data);
    setSubmitted(true);
    reset();
  };

  return (
    <Box>
      <PageHero
        eyebrow="Join The Team"
        eyebrowIcon={Sparkles}
        title="Give Your Time,"
        highlight="Change a Life"
        subtitle="You don't need money to make a difference. Hands, skills, a camera or a car — every kind of help builds shelters and rescues dogs."
        gradient="linear(to-br, ocean.500 via ocean.600 to tropical.600)"
        bgImage={IMAGES.heroPack}
      />

      {/* Roles */}
      <Container maxW="container.xl" px={4} py={{ base: 14, md: 20 }}>
        <VStack spacing={12}>
          <SectionHeading
            eyebrow="Ways To Help"
            eyebrowColor="ocean"
            title="Find Your Role"
            subtitle="Pick what fits your time and talents — every role matters."
          />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {roles.map((role, i) => (
              <MotionCard
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -8 }}
                borderRadius="3xl"
                bg="white"
                boxShadow="lg"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top={0} left={0} right={0} h={1.5} bgGradient={`linear(to-r, ${role.color}.400, ${role.color}.600)`} />
                <CardBody p={7}>
                  <VStack align="start" spacing={4}>
                    <MotionBox
                      w={14}
                      h={14}
                      borderRadius="2xl"
                      bgGradient={`linear(to-br, ${role.color}.400, ${role.color}.600)`}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      whileHover={{ rotate: 8, scale: 1.05 }}
                    >
                      <Icon as={role.icon} boxSize={7} />
                    </MotionBox>
                    <Heading size="md" color={`${role.color}.600`}>{role.title}</Heading>
                    <Text color="gray.600" lineHeight={1.7}>{role.text}</Text>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Signup form */}
      <Box w="full" bgGradient="linear(to-b, white, sand.100)" py={{ base: 16, md: 24 }}>
        <Container maxW="container.md" px={4}>
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
            <Box bgGradient="linear(to-r, ocean.500, tropical.500)" py={8} px={{ base: 6, md: 10 }} color="white" textAlign="center">
              <Heading size="lg" fontFamily="heading">Sign Up To Volunteer</Heading>
              <Text opacity={0.9} mt={2}>We'll reach out within a few days with next steps.</Text>
            </Box>
            <CardBody p={{ base: 6, md: 10 }}>
              {submitted && (
                <Alert status="success" borderRadius="xl" mb={6}>
                  <AlertIcon />
                  Thank you! Your interest is in — we'll be in touch soon. 🐾
                </Alert>
              )}
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={5}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="full">
                    <FormControl isInvalid={!!errors.name} isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input {...register('name')} placeholder="Your name" />
                      <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email} isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input {...register('email')} type="email" placeholder="your@email.com" />
                      <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isInvalid={!!errors.skills} isRequired>
                    <FormLabel>How would you like to help?</FormLabel>
                    <Input {...register('skills')} placeholder="e.g. building, photography, translation" />
                    <FormErrorMessage>{errors.skills?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.availability} isRequired>
                    <FormLabel>Availability</FormLabel>
                    <Select {...register('availability')} placeholder="Choose your availability" focusBorderColor="brand.500">
                      <option value="weekends">Weekends</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="remote">Remote / flexible</option>
                      <option value="one-off">One-off events</option>
                    </Select>
                    <FormErrorMessage>{errors.availability?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Anything else? (optional)</FormLabel>
                    <Textarea {...register('message')} placeholder="Tell us a bit about yourself..." rows={4} />
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
                    Count Me In
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </MotionCard>
        </Container>
      </Box>
    </Box>
  );
};
