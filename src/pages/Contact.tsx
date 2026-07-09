import React from 'react';
import { Container, VStack, Heading, Text } from '@chakra-ui/react';
export const Contact: React.FC = () => (
  <Container maxW="container.xl" px={4} py={12}>
    <VStack spacing={8}>
      <Heading size="2xl">Contact Us</Heading>
      <Text>Get in touch via WhatsApp or email.</Text>
    </VStack>
  </Container>
);
