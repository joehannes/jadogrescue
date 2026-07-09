import React from 'react';
import { Container, VStack, Heading, Text } from '@chakra-ui/react';
export const Blog: React.FC = () => (
  <Container maxW="container.xl" px={4} py={12}>
    <VStack spacing={8}>
      <Heading size="2xl">Blog</Heading>
      <Text>Blog posts will be loaded from markdown files.</Text>
    </VStack>
  </Container>
);
