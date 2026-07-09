import React from 'react';
import { Container, VStack, Heading, Text } from '@chakra-ui/react';
export const Learn: React.FC = () => (
  <Container maxW="container.xl" px={4} py={12}>
    <VStack spacing={8}>
      <Heading size="2xl">DIY & Education</Heading>
      <Text>Learn how to build dog shelters from recycled materials.</Text>
    </VStack>
  </Container>
);
