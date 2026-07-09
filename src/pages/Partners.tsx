import React from 'react';
import { Container, VStack, Heading, Text } from '@chakra-ui/react';
export const Partners: React.FC = () => (
  <Container maxW="container.xl" px={4} py={12}>
    <VStack spacing={8}>
      <Heading size="2xl">Partners</Heading>
      <Text>Partner with us to host shelters and provide food waste.</Text>
    </VStack>
  </Container>
);
