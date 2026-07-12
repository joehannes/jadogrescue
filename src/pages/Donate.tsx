import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Progress,
  Input,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  Icon,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Heart, Recycle, Users, Truck, Eye, MapPin, Camera, ShieldCheck } from 'lucide-react';
import { DonationTierCard } from '../components/DonationTierCard';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { SupportPlatforms } from '../components/SupportPlatforms';
import { useDonationStore, donationTiers } from '../hooks/useDonationStore';
import { IMAGES } from '../utils/media';
import { paws, bottles, waves, dots } from '../utils/patterns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MotionBox = motion(Box);

const donationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  amount: z.number().min(1, 'Amount must be at least $1'),
  isRecurring: z.boolean(),
});

type DonationForm = z.infer<typeof donationSchema>;

// Radical-transparency cost breakdown from the concept.
const costBreakdown = [
  { icon: Users, label: 'Fair local labor', detail: '~4 hours of paid work', pct: 60, color: 'brand' },
  { icon: Truck, label: 'Cords & transport', detail: 'Getting materials on site', pct: 25, color: 'ocean' },
  { icon: Recycle, label: 'Natural materials', detail: 'Palm fiber & supplements', pct: 15, color: 'tropical' },
];

const promises = [
  { icon: MapPin, title: 'GPS Coordinates', text: 'The exact spot where your shelter was placed.' },
  { icon: Camera, title: 'Real Photos', text: 'Human-verified images of the finished build.' },
  { icon: Eye, title: 'Logged On The Map', text: 'Every shelter appears on our public map.' },
];

export const Donate: React.FC = () => {
  const { selectedTier, setSelectedTier, setCustomAmount } = useDonationStore();
  const [customValue, setCustomValue] = useState<string>('');

  const { register, handleSubmit, setValue, watch } = useForm<DonationForm>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: '',
      email: '',
      amount: 10,
      isRecurring: false,
    },
  });

  const amount = watch('amount');

  const handleTierSelect = (tier: typeof donationTiers[0]) => {
    setSelectedTier(tier);
    setValue('amount', tier.amount);
    setCustomValue('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    const numValue = parseFloat(value) || 0;
    setValue('amount', numValue);
    setCustomAmount(numValue);
    setSelectedTier(null);
  };

  const getImpactMessage = (amt: number) => {
    const shelters = Math.floor(amt / 10);
    const dogsFed = Math.floor(amt / 5);
    const bottleCount = shelters * 200;

    if (shelters >= 1) {
      return `Your $${amt} can build ${shelters} shelter${shelters > 1 ? 's' : ''}, feed ${dogsFed} dog${dogsFed !== 1 ? 's' : ''} for a month, and recycle ${bottleCount}+ plastic bottles!`;
    }
    return `Every dollar helps! $${amt} contributes to building shelters and feeding street dogs.`;
  };

  const onSubmit = (data: DonationForm) => {
    // In production, redirect to PayPal/Stripe/GoFundMe
    const paypalLink = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=YOUR_PAYPAL_EMAIL&item_name=Dog+Shelter+Donation&amount=${data.amount}`;
    window.open(paypalLink, '_blank');
  };

  return (
    <Box>
      <PageHero
        eyebrow="Micro-Donations, Real Impact"
        eyebrowIcon={Heart}
        title="Make Something"
        highlight="Out of Little"
        subtitle="Your donation directly funds insulated dog shelters built by local workers in the Dominican Republic — and you see exactly where every dollar goes."
        bgImage={IMAGES.heroPuppy}
        dividerColor="sand.100"
      >
        <HStack spacing={6} pt={2} flexWrap="wrap" justify="center">
          {[
            { v: '$10', l: 'Builds a shelter' },
            { v: '4 hrs', l: 'To build by hand' },
            { v: '100%', l: 'To the cause' },
          ].map((s) => (
            <VStack key={s.l} spacing={0}>
              <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" fontFamily="heading">{s.v}</Text>
              <Text fontSize="xs" opacity={0.85} fontFamily="mono" letterSpacing="wide">{s.l}</Text>
            </VStack>
          ))}
        </HStack>
      </PageHero>

      {/* Progress toward monthly goal */}
      <Container maxW="container.lg" px={4} py={{ base: 10, md: 14 }}>
        <Card w="full" borderRadius="3xl" boxShadow="xl" position="relative" overflow="hidden">
          <Box position="absolute" inset={0} sx={{ backgroundImage: dots('#004E89', 0.05, 24) }} pointerEvents="none" />
          <CardBody p={{ base: 6, md: 8 }} position="relative">
            <VStack spacing={4}>
              <HStack justify="space-between" w="full" flexWrap="wrap" gap={2}>
                <HStack>
                  <Icon as={Heart} color="brand.500" />
                  <Text fontWeight="700" fontSize="lg">Monthly Goal: $5,000</Text>
                </HStack>
                <Text color="brand.500" fontWeight="800" fontSize="lg">$2,350 raised</Text>
              </HStack>
              <Progress value={47} size="lg" colorScheme="brand" borderRadius="full" w="full" />
              <Text fontSize="sm" color="gray.500">
                47% of our monthly goal — help us build 235 more shelters!
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>

      {/* Donation tiers */}
      <Box w="full" bgGradient="linear(to-b, sand.100, white)" py={{ base: 14, md: 20 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: bottles('#1A936F', 0.06, 130) }} pointerEvents="none" />
        <Container maxW="container.xl" px={4} position="relative">
          <VStack spacing={12}>
            <SectionHeading
              eyebrow="Choose Your Impact"
              title="Micro-Donation Tiers"
              subtitle="Every tier maps to a concrete, countable outcome on the ground."
            />
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
              {donationTiers.map((tier, index) => (
                <MotionBox
                  key={tier.amount}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <DonationTierCard
                    tier={tier}
                    onSelect={handleTierSelect}
                    isSelected={selectedTier?.amount === tier.amount}
                  />
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Custom amount + form */}
      <Container maxW="container.md" px={4} py={{ base: 14, md: 20 }}>
        <SectionHeading
          eyebrow="Give Any Amount"
          eyebrowColor="tropical"
          title="Complete Your Gift"
        />
        <Card w="full" borderRadius="3xl" boxShadow="xl" mt={10}>
          <CardBody p={{ base: 6, md: 10 }}>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel fontWeight="600">Custom Amount</FormLabel>
                <HStack>
                  <Text fontSize="xl">$</Text>
                  <Input
                    type="number"
                    value={customValue}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    min={1}
                    focusBorderColor="brand.500"
                  />
                </HStack>
              </FormControl>

              <Alert status="info" borderRadius="xl">
                <AlertIcon />
                <Text fontSize="sm">{getImpactMessage(amount)}</Text>
              </Alert>

              <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input {...register('name')} placeholder="Your name" />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input {...register('email')} type="email" placeholder="your@email.com" />
                  </FormControl>

                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel mb={0}>Make this a monthly donation</FormLabel>
                    <Switch {...register('isRecurring')} colorScheme="brand" />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    leftIcon={<Heart size={18} />}
                    fontSize="lg"
                  >
                    Donate ${amount}
                  </Button>
                </VStack>
              </form>
            </VStack>
          </CardBody>
        </Card>
      </Container>

      {/* Recurring giving — Patreon, Ko-fi, etc. (renders only when configured) */}
      <SupportPlatforms />

      {/* Where your $10 goes — transparency band */}
      <Box w="full" bgGradient="linear(to-br, ocean.600, ocean.800)" color="white" py={{ base: 16, md: 22 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: waves('#ffffff', 0.07, 90) }} pointerEvents="none" />
        <Container maxW="container.lg" px={4} position="relative">
          <VStack spacing={12}>
            <VStack spacing={3} textAlign="center" maxW="2xl">
              <Badge bg="whiteAlpha.200" color="white" px={4} py={2} borderRadius="full" fontFamily="mono" letterSpacing="wide">
                <HStack spacing={2}><ShieldCheck size={14} /><Text>Radical Transparency</Text></HStack>
              </Badge>
              <Heading size={{ base: 'xl', md: '2xl' }} fontFamily="heading">Where Your $10 Goes</Heading>
              <Text opacity={0.9} fontSize={{ base: 'md', md: 'lg' }}>
                The bottles are diverted waste, collected for free. Your gift covers the rest — here's the split.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
              {costBreakdown.map((c, i) => (
                <MotionBox
                  key={c.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  bg="whiteAlpha.100"
                  backdropFilter="blur(6px)"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  borderRadius="2xl"
                  p={7}
                >
                  <Flex justify="space-between" align="center" mb={4}>
                    <Icon as={c.icon} boxSize={7} color="tropical.200" />
                    <Text fontSize="3xl" fontWeight="800" fontFamily="heading">{c.pct}%</Text>
                  </Flex>
                  <Heading size="md" mb={1} fontFamily="heading">{c.label}</Heading>
                  <Text opacity={0.85} fontSize="sm">{c.detail}</Text>
                  <Progress value={c.pct} size="xs" mt={4} borderRadius="full" colorScheme="tropical" bg="whiteAlpha.200" />
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* What every donor receives */}
      <Box w="full" py={{ base: 16, md: 22 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: paws('#004E89', 0.04, 110) }} pointerEvents="none" />
        <Container maxW="container.lg" px={4} position="relative">
          <VStack spacing={12}>
            <SectionHeading
              eyebrow="You Stay In The Loop"
              title="What Every Donor Receives"
              subtitle="Donate and you don't just hope for impact — you get proof of it."
            />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
              {promises.map((p, i) => (
                <MotionBox
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  bg="white"
                  borderRadius="3xl"
                  boxShadow="lg"
                  p={8}
                  textAlign="center"
                >
                  <Box
                    w={16}
                    h={16}
                    mx="auto"
                    mb={4}
                    borderRadius="2xl"
                    bgGradient="linear(to-br, brand.400, coral.500)"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={p.icon} boxSize={7} />
                  </Box>
                  <Heading size="md" color="ocean.700" mb={2}>{p.title}</Heading>
                  <Text color="gray.600" lineHeight={1.7}>{p.text}</Text>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};
