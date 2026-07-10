import React, { useMemo, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  SimpleGrid,
  Heading,
  Text,
  Card,
  CardBody,
  Badge,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Droplet, Calendar, PawPrint, Home as HomeIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import sheltersData from '../data/shelters.json';
import type { Shelter } from '../types';
import { PageHero } from '../components/PageHero';
import { IMAGES } from '../utils/media';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const statusColorHex: Record<Shelter['status'], string> = {
  active: '#1A936F',
  construction: '#FF6B35',
  planned: '#004E89',
};

const statusScheme: Record<Shelter['status'], string> = {
  active: 'tropical',
  construction: 'brand',
  planned: 'ocean',
};

/** Colored paw pin as an inline SVG divIcon (avoids Leaflet's default-icon 404). */
function pawIcon(status: Shelter['status'], active: boolean) {
  const color = statusColorHex[status];
  const size = active ? 44 : 34;
  return L.divIcon({
    className: 'jadr-pin',
    html: `
      <div style="transform: translate(-50%, -100%); ${active ? 'animation: jadrBounce 0.6s ease;' : ''}">
        <svg width="${size}" height="${size}" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C9 0 0 9 0 20c0 14 20 32 20 32s20-18 20-32C40 9 31 0 20 0z" fill="${color}"/>
          <circle cx="20" cy="19" r="12" fill="white" opacity="0.95"/>
          <g fill="${color}">
            <ellipse cx="15" cy="15" rx="2.2" ry="3"/>
            <ellipse cx="25" cy="15" rx="2.2" ry="3"/>
            <ellipse cx="11" cy="19" rx="2.2" ry="2.8"/>
            <ellipse cx="29" cy="19" rx="2.2" ry="2.8"/>
            <path d="M20 19c-3 0-5.5 2.2-5.5 5 0 2 1.7 3 3.4 3 1 0 1.4-.5 2.1-.5s1.1.5 2.1.5c1.7 0 3.4-1 3.4-3 0-2.8-2.5-5-5.5-5z"/>
          </g>
        </svg>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [0, 0],
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export const Map: React.FC = () => {
  const [searchParams] = useSearchParams();
  const focusedId = searchParams.get('shelter');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [query, setQuery] = useState('');

  const shelters = sheltersData as Shelter[];

  const filtered = useMemo(
    () =>
      shelters.filter((s) => {
        const matchStatus = filterStatus === 'all' || s.status === filterStatus;
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q ||
          s.location.city.toLowerCase().includes(q) ||
          s.location.address.toLowerCase().includes(q) ||
          s.builder.toLowerCase().includes(q);
        return matchStatus && matchQuery;
      }),
    [shelters, filterStatus, query]
  );

  const totals = useMemo(
    () => ({
      total: shelters.length,
      dogs: shelters.reduce((n, s) => n + s.dogs, 0),
      rainwater: shelters.filter((s) => s.hasRainwater).length,
    }),
    [shelters]
  );

  // Center on DR
  const center: [number, number] = [18.9, -70.0];

  return (
    <Box>
      <style>{`@keyframes jadrBounce {0%{transform:translate(-50%,-100%) scale(0.6);}60%{transform:translate(-50%,-100%) scale(1.15);}100%{transform:translate(-50%,-100%) scale(1);}}`}</style>

      <PageHero
        eyebrow="Where We Work"
        eyebrowIcon={MapPin}
        title="Our Shelters,"
        highlight="On The Map"
        subtitle="Every pin is a real, geotagged shelter. Explore where your donations become safe homes across the Dominican Republic."
        gradient="linear(to-br, ocean.500 via ocean.600 to tropical.600)"
        bgImage={IMAGES.heroBeach}
      />

      <Container maxW="container.xl" px={4} py={{ base: 10, md: 16 }}>
        <VStack spacing={10} align="stretch">
          {/* Quick stats */}
          <SimpleGrid columns={{ base: 3 }} spacing={4}>
            {[
              { icon: HomeIcon, label: 'Shelters', value: totals.total, color: 'brand' },
              { icon: PawPrint, label: 'Dogs Housed', value: totals.dogs, color: 'ocean' },
              { icon: Droplet, label: 'With Rainwater', value: totals.rainwater, color: 'tropical' },
            ].map((s, i) => (
              <MotionBox
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                bg="white"
                borderRadius="2xl"
                boxShadow="md"
                p={{ base: 4, md: 6 }}
                textAlign="center"
              >
                <Icon as={s.icon} boxSize={{ base: 5, md: 6 }} color={`${s.color}.500`} mb={2} />
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color={`${s.color}.600`} lineHeight={1}>
                  {s.value}
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" fontWeight="600">
                  {s.label}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Controls */}
          <Flex gap={4} flexWrap="wrap">
            <InputGroup maxW={{ base: 'full', md: 'md' }} flex={1}>
              <InputLeftElement pointerEvents="none" h="full" pl={2}>
                <Search size={18} color="#A0AEC0" />
              </InputLeftElement>
              <Input
                pl={10}
                placeholder="Search by city, address or builder..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                focusBorderColor="brand.500"
                bg="white"
              />
            </InputGroup>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              maxW={{ base: 'full', md: 'xs' }}
              focusBorderColor="brand.500"
              bg="white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="construction">Under Construction</option>
              <option value="planned">Planned</option>
            </Select>
          </Flex>

          {/* Interactive map */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="2xl"
            border="4px solid white"
            h={{ base: '360px', md: '520px' }}
            position="relative"
            zIndex={0}
          >
            <MapContainer
              center={center}
              zoom={7}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {filtered.map((s) => (
                <Marker
                  key={s.id}
                  position={[s.location.lat, s.location.lng]}
                  icon={pawIcon(s.status, s.id === focusedId)}
                >
                  <Popup>
                    <Box minW="180px">
                      <Text fontWeight="700" fontSize="md" color="#004E89">{s.location.city}</Text>
                      <Text fontSize="sm" color="#555">{s.location.address}</Text>
                      <Text fontSize="sm" mt={1}>🐕 {s.dogs} dog{s.dogs !== 1 ? 's' : ''} · {s.status}</Text>
                      {s.hasRainwater && <Text fontSize="sm" color="#1A936F">💧 Rainwater system</Text>}
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </MotionBox>

          {/* Legend */}
          <HStack spacing={6} justify="center" flexWrap="wrap">
            {(['active', 'construction', 'planned'] as const).map((st) => (
              <HStack key={st} spacing={2}>
                <Box w={3} h={3} borderRadius="full" bg={statusColorHex[st]} />
                <Text fontSize="sm" color="gray.600" textTransform="capitalize">{st}</Text>
              </HStack>
            ))}
          </HStack>

          {/* Shelter list */}
          <Box>
            <Heading size="lg" fontFamily="heading" color="ocean.600" mb={6}>
              {filtered.length} Shelter{filtered.length !== 1 ? 's' : ''}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filtered.map((shelter, i) => (
                <MotionCard
                  key={shelter.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -5 }}
                  borderRadius="2xl"
                  bg="white"
                  boxShadow="md"
                  borderWidth={shelter.id === focusedId ? '2px' : '1px'}
                  borderColor={shelter.id === focusedId ? 'brand.500' : 'transparent'}
                >
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack justify="space-between" w="full">
                        <Heading size="sm" color="ocean.700">{shelter.location.city}</Heading>
                        <Badge colorScheme={statusScheme[shelter.status]} textTransform="capitalize">
                          {shelter.status}
                        </Badge>
                      </HStack>
                      <HStack color="gray.500" fontSize="sm" spacing={2}>
                        <MapPin size={14} />
                        <Text>{shelter.location.address}</Text>
                      </HStack>
                      <HStack color="gray.500" fontSize="sm" spacing={2}>
                        <Calendar size={14} />
                        <Text>Built {formatDate(shelter.built)}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full" pt={1}>
                        <Text fontWeight="700" color="brand.600" fontSize="sm">
                          🐕 {shelter.dogs} Dog{shelter.dogs !== 1 ? 's' : ''}
                        </Text>
                        {shelter.hasRainwater && (
                          <HStack color="tropical.500" fontSize="sm" fontWeight="600" spacing={1}>
                            <Droplet size={14} />
                            <Text>Rainwater</Text>
                          </HStack>
                        )}
                      </HStack>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
            {filtered.length === 0 && (
              <VStack py={12} spacing={3} color="gray.500">
                <PawPrint size={40} />
                <Text>No shelters match your search.</Text>
              </VStack>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
