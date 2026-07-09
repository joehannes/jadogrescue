import React from 'react';
import { Container, VStack, Heading, Text } from '@chakra-ui/react';
export const Volunteer: React.FC = () => (
  <Container maxW="container.xl" px={4} py={12}>
    <VStack spacing={8}>
      <Heading size="2xl">Volunteer</Heading>
      <Text>Join our team and help make a difference.</Text>
    </VStack>
  </Container>
);
