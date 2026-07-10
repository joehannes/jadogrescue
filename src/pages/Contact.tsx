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
  Link,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin, Clock, Send, PawPrint } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHero } from '../components/PageHero';

const MotionCard = motion(Card);

const channels = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '+1 (809) 555-0123',
    href: 'https://wa.me/18095550123',
    color: 'tropical',
    note: 'Fastest way to reach us',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@jadr.org',
    href: 'mailto:hello@jadr.org',
    color: 'ocean',
    note: 'We reply within 48 hours',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Bavaro, Dominican Republic',
    href: 'https://maps.google.com/?q=Bavaro+Dominican+Republic',
    color: 'brand',
    note: 'Serving the whole island',
  },
];

const contactSchema = z.object({
  name: z.string().min(2, 'Please tell us your name'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(5, 'Please write a short message'),
});

type ContactForm = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    await new Promise((r) => setTimeout(r, 600));
    console.log('Contact message', data);
    setSubmitted(true);
    reset();
  };

  return (
    <Box>
      <PageHero
        eyebrow="Get In Touch"
        eyebrowIcon={PawPrint}
        title="We'd Love To"
        highlight="Hear From You"
        subtitle="Questions, ideas, a dog that needs help, or just a hello — reach out any way you like. Real people read every message."
        gradient="linear(to-br, brand.500 via coral.500 to ocean.600)"
      />

      {/* Contact channels */}
      <Container maxW="container.xl" px={4} py={{ base: 14, md: 20 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {channels.map((c, i) => (
            <MotionCard
              key={c.title}
              as={Link}
              href={c.href}
              isExternal
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              borderRadius="3xl"
              bg="white"
              boxShadow="lg"
              _hover={{ textDecoration: 'none' }}
            >
              <CardBody p={8} textAlign="center">
                <VStack spacing={4}>
                  <Box
                    w={16}
                    h={16}
                    borderRadius="2xl"
                    bgGradient={`linear(to-br, ${c.color}.400, ${c.color}.600)`}
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={c.icon} boxSize={7} />
                  </Box>
                  <Box>
                    <Heading size="md" color={`${c.color}.600`}>{c.title}</Heading>
                    <Text fontWeight="600" color="gray.800" mt={1}>{c.value}</Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>{c.note}</Text>
                  </Box>
                </VStack>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>
      </Container>

      {/* Form + hours */}
      <Box w="full" bgGradient="linear(to-b, white, sand.100)" py={{ base: 16, md: 24 }}>
        <Container maxW="container.lg" px={4}>
          <SimpleGrid columns={{ base: 1, lg: 5 }} spacing={10} alignItems="start">
            {/* Form */}
            <Box gridColumn={{ lg: 'span 3' }}>
              <MotionCard
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                borderRadius="3xl"
                bg="white"
                boxShadow="2xl"
                overflow="hidden"
              >
                <CardBody p={{ base: 6, md: 10 }}>
                  <Heading size="lg" fontFamily="heading" color="ocean.600" mb={2}>
                    Send a Message
                  </Heading>
                  <Text color="gray.500" mb={6}>Fill in the form and we'll get back to you shortly.</Text>
                  {submitted && (
                    <Alert status="success" borderRadius="xl" mb={6}>
                      <AlertIcon />
                      Message sent! Thank you for reaching out. 🐾
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={5}>
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
                      <FormControl isInvalid={!!errors.message} isRequired>
                        <FormLabel>Message</FormLabel>
                        <Textarea {...register('message')} placeholder="How can we help?" rows={5} />
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
                        Send Message
                      </Button>
                    </VStack>
                  </form>
                </CardBody>
              </MotionCard>
            </Box>

            {/* Side panel */}
            <Box gridColumn={{ lg: 'span 2' }}>
              <MotionCard
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                borderRadius="3xl"
                bgGradient="linear(to-br, ocean.600, ocean.800)"
                color="white"
                boxShadow="xl"
                h="full"
              >
                <CardBody p={{ base: 6, md: 8 }}>
                  <VStack align="start" spacing={6}>
                    <Heading size="md" fontFamily="heading">Office Hours</Heading>
                    <VStack align="start" spacing={3} w="full">
                      {[
                        ['Monday – Friday', '9:00 – 18:00'],
                        ['Saturday', '9:00 – 14:00'],
                        ['Sunday', 'Emergencies only'],
                      ].map(([day, time]) => (
                        <Flex key={day} justify="space-between" w="full" fontSize="sm">
                          <HStack spacing={2} opacity={0.9}>
                            <Clock size={15} />
                            <Text>{day}</Text>
                          </HStack>
                          <Text fontWeight="600">{time}</Text>
                        </Flex>
                      ))}
                    </VStack>
                    <Box h="1px" bg="whiteAlpha.300" w="full" />
                    <Box>
                      <Text fontWeight="700" mb={1}>Found a dog in need?</Text>
                      <Text fontSize="sm" opacity={0.9} lineHeight={1.7}>
                        Message us on WhatsApp with a photo and location — we'll coordinate the
                        nearest shelter or rescue partner.
                      </Text>
                    </Box>
                    <Button
                      as={Link}
                      href="https://wa.me/18095550123"
                      isExternal
                      bg="tropical.500"
                      color="white"
                      _hover={{ bg: 'tropical.400', textDecoration: 'none' }}
                      leftIcon={<MessageCircle size={18} />}
                      w="full"
                    >
                      Chat on WhatsApp
                    </Button>
                  </VStack>
                </CardBody>
              </MotionCard>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};
