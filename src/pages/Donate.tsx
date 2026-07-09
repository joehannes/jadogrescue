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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { DonationTierCard } from '../components/DonationTierCard';
import { useDonationStore, donationTiers } from '../hooks/useDonationStore';
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
    const bottles = shelters * 200;
    
    if (shelters >= 1) {
      return `Your $${amt} can build ${shelters} shelter${shelters > 1 ? 's' : ''}, feed ${dogsFed} dog${dogsFed !== 1 ? 's' : ''} for a month, and recycle ${bottles}+ plastic bottles!`;
    }
    return `Every dollar helps! $${amt} contributes to building shelters and feeding street dogs.`;
  };

  const onSubmit = (data: DonationForm) => {
    // In production, redirect to PayPal/Stripe/GoFundMe
    const paypalLink = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=YOUR_PAYPAL_EMAIL&item_name=Dog+Shelter+Donation&amount=${data.amount}`;
    window.open(paypalLink, '_blank');
  };

  return (
    <Container maxW="container.xl" px={4} py={12}>
      <VStack spacing={12}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          w="full"
        >
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl" fontFamily="heading" color="ocean.500">
              Make a Difference Today
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Your donation directly funds dog shelters built by local workers in the Dominican Republic.
            </Text>
          </VStack>
        </MotionBox>

        {/* Progress Bar */}
        <Card w="full" borderRadius="2xl">
          <CardBody>
            <VStack spacing={4}>
              <HStack justify="space-between" w="full">
                <Text fontWeight="600">Monthly Goal: $5,000</Text>
                <Text color="brand.500" fontWeight="700">$2,350 raised</Text>
              </HStack>
              <Progress
                value={47}
                size="lg"
                colorScheme="brand"
                borderRadius="full"
                w="full"
              />
              <Text fontSize="sm" color="gray.500">
                47% of monthly goal - Help us reach 235 more shelters!
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Donation Tiers */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
          {donationTiers.map((tier, index) => (
            <MotionBox
              key={tier.amount}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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

        {/* Custom Amount & Form */}
        <Card w="full" maxW="2xl" borderRadius="2xl">
          <CardBody>
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
                    leftIcon={<FiHeart />}
                    fontSize="lg"
                  >
                    Donate ${amount}
                  </Button>
                </VStack>
              </form>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};
