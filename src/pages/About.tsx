import React from 'react';
import { Container, VStack, Heading, Text } from '@chakra-ui/react';
export const About: React.FC = () => (
  <Container maxW="container.xl" px={4} py={12}>
    <VStack spacing={8}>
      <Heading size="2xl">About John & Abigail</Heading>
      <Text>Our mission is to connect global micro-donors with local DR rescue via radical transparency.</Text>
    </VStack>
  </Container>
);
