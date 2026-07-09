import React, { useState } from 'react';
import { Container, VStack, Heading, Text, SimpleGrid, Card, CardBody, HStack, Badge, Input, Select, Box } from '@chakra-ui/react';
import sheltersData from '../data/shelters.json';
import { Shelter } from '../types';
export const Map: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const filteredShelters = sheltersData.filter((s) => filterStatus === 'all' || s.status === filterStatus);
  return (
    <Container maxW="container.xl" px={4} py={8}>
      <VStack spacing={8}>
        <Heading size="2xl" fontFamily="heading" color="ocean.500">Shelter Map</Heading>
        <Text color="gray.600">Explore our dog shelters across the Dominican Republic.</Text>
        <HStack w="full" gap={4} flexWrap="wrap">
          <Input placeholder="Search..." maxW="md" focusBorderColor="brand.500" />
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} maxW="xs" focusBorderColor="brand.500">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="construction">Under Construction</option>
            <option value="planned">Planned</option>
          </Select>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
          {filteredShelters.map((shelter) => (
            <Card key={shelter.id} borderRadius="2xl">
              <CardBody>
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Heading size="sm">{shelter.location.city}</Heading>
                    <Badge colorScheme={shelter.status === 'active' ? 'tropical' : shelter.status === 'construction' ? 'brand' : 'ocean'}>{shelter.status}</Badge>
                  </HStack>
                  <Text fontSize="sm">{shelter.location.address}</Text>
                  <Text fontSize="sm" fontWeight="600" color="brand.600">🐕 {shelter.dogs} Dogs</Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};
