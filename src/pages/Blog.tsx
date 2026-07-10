import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  SimpleGrid,
  Heading,
  Text,
  Badge,
  Card,
  CardBody,
  Image,
  Flex,
  Icon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BadgeCheck, ArrowRight, Newspaper, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { getBlogPosts } from '../utils/blog';
import type { BlogPost } from '../types';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const gradients = [
  'linear(to-br, brand.400, coral.500)',
  'linear(to-br, ocean.400, tropical.500)',
  'linear(to-br, tropical.400, ocean.600)',
  'linear(to-br, coral.400, brand.600)',
];

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('all');

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));
  const visible = activeTag === 'all' ? posts : posts.filter((p) => p.tags.includes(activeTag));

  return (
    <Box>
      <PageHero
        eyebrow="Stories From The Field"
        eyebrowIcon={Newspaper}
        title="Every Shelter Has"
        highlight="A Story"
        subtitle="Follow the builds, the rescues and the people making it happen across the Dominican Republic."
        gradient="linear(to-br, ocean.500 via ocean.600 to brand.600)"
      />

      <Container maxW="container.xl" px={4} py={{ base: 12, md: 20 }}>
        {loading ? (
          <Center py={20}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
          </Center>
        ) : posts.length === 0 ? (
          <VStack py={16} spacing={4} color="gray.500">
            <PawPrint size={48} />
            <Text>No stories yet — check back soon!</Text>
          </VStack>
        ) : (
          <VStack spacing={10} align="stretch">
            {/* Tag filter */}
            {allTags.length > 0 && (
              <Wrap justify="center" spacing={3}>
                <WrapItem>
                  <Badge
                    as="button"
                    onClick={() => setActiveTag('all')}
                    px={4}
                    py={2}
                    borderRadius="full"
                    cursor="pointer"
                    colorScheme={activeTag === 'all' ? 'brand' : 'gray'}
                    variant={activeTag === 'all' ? 'solid' : 'subtle'}
                  >
                    All Stories
                  </Badge>
                </WrapItem>
                {allTags.map((tag) => (
                  <WrapItem key={tag}>
                    <Badge
                      as="button"
                      onClick={() => setActiveTag(tag)}
                      px={4}
                      py={2}
                      borderRadius="full"
                      cursor="pointer"
                      colorScheme={activeTag === tag ? 'brand' : 'gray'}
                      variant={activeTag === tag ? 'solid' : 'subtle'}
                      textTransform="capitalize"
                    >
                      {tag.replace('-', ' ')}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            )}

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {visible.map((post, i) => (
                <MotionCard
                  key={post.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  borderRadius="3xl"
                  bg="white"
                  boxShadow="lg"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  display="flex"
                  flexDirection="column"
                >
                  {/* Hero image with gradient fallback */}
                  <Box position="relative" h={44} bgGradient={gradients[i % gradients.length]} overflow="hidden">
                    {post.heroImage && (
                      <Image
                        src={post.heroImage}
                        alt={post.title}
                        h="full"
                        w="full"
                        objectFit="cover"
                        fallback={<Box />}
                      />
                    )}
                    <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.400, transparent)" />
                    {post.verified && (
                      <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        colorScheme="tropical"
                        display="flex"
                        alignItems="center"
                        gap={1}
                        px={3}
                        py={1}
                      >
                        <BadgeCheck size={13} /> Verified
                      </Badge>
                    )}
                    <Icon
                      as={PawPrint}
                      position="absolute"
                      bottom={3}
                      left={3}
                      color="whiteAlpha.800"
                      boxSize={7}
                    />
                  </Box>

                  <CardBody display="flex" flexDirection="column" flex={1}>
                    <VStack align="start" spacing={3} flex={1}>
                      <HStack spacing={4} color="gray.500" fontSize="xs">
                        <HStack spacing={1}>
                          <Calendar size={13} />
                          <Text>{formatDate(post.date)}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Clock size={13} />
                          <Text>{post.readingTime} min read</Text>
                        </HStack>
                      </HStack>
                      <Heading size="md" color="ocean.700" lineHeight={1.3} noOfLines={2}>
                        {post.title}
                      </Heading>
                      <Text color="gray.600" fontSize="sm" lineHeight={1.7} noOfLines={3}>
                        {post.excerpt}
                      </Text>
                    </VStack>
                    <Flex justify="space-between" align="center" mt={5}>
                      <Text fontSize="xs" color="gray.500" fontFamily="mono">
                        {post.author}
                      </Text>
                      <HStack color="brand.500" fontWeight="600" fontSize="sm" spacing={1}>
                        <Text>Read</Text>
                        <MotionBox whileHover={{ x: 3 }}>
                          <ArrowRight size={16} />
                        </MotionBox>
                      </HStack>
                    </Flex>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        )}
      </Container>
    </Box>
  );
};
