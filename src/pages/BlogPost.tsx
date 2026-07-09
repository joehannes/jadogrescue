import React from 'react';
import { Container, VStack, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
export const BlogPost: React.FC = () => {
  const { slug } = useParams();
  return (
    <Container maxW="container.xl" px={4} py={12}>
      <VStack spacing={8}>
        <Heading size="2xl">Blog Post: {slug}</Heading>
      </VStack>
    </Container>
  );
};
