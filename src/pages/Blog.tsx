import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  Heading,
  Text,
  Badge,
  Image,
  Flex,
  Icon,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BadgeCheck, ArrowRight, Newspaper, PawPrint, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { IMAGES } from '../utils/media';
import { getBlogPosts } from '../utils/blog';
import { paws, dots } from '../utils/patterns';
import type { BlogPost } from '../types';

const MotionBox = motion(Box);

const gradients = [
  'linear(to-br, brand.400, coral.500)',
  'linear(to-br, ocean.400, tropical.500)',
  'linear(to-br, tropical.400, ocean.600)',
  'linear(to-br, coral.400, brand.600)',
];

// Staggered image heights give the masonry columns an editorial, non-uniform rhythm.
const cardImageHeights = [240, 300, 200, 280, 220, 320];

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Large split lead story that anchors the page. */
const FeaturedStory: React.FC<{ post: BlogPost; index: number; onOpen: () => void }> = ({
  post,
  index,
  onOpen,
}) => (
  <MotionBox
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6 }}
    onClick={onOpen}
    cursor="pointer"
    role="group"
    bg="white"
    borderRadius="3xl"
    overflow="hidden"
    boxShadow="2xl"
    position="relative"
  >
    <Flex direction={{ base: 'column', md: 'row' }} minH={{ md: 420 }}>
      {/* Image side */}
      <Box position="relative" flex={{ md: '1 1 58%' }} minH={{ base: 260, md: 'auto' }} bgGradient={gradients[index % gradients.length]} overflow="hidden">
        {post.heroImage && (
          <Image
            src={post.heroImage}
            alt={post.title}
            h="full"
            w="full"
            objectFit="cover"
            transition="transform 0.7s ease"
            _groupHover={{ transform: 'scale(1.06)' }}
            fallback={<Box />}
          />
        )}
        <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.500, transparent 60%)" />
        <Badge
          position="absolute"
          top={5}
          left={5}
          bg="whiteAlpha.900"
          color="brand.600"
          px={4}
          py={2}
          borderRadius="full"
          display="flex"
          alignItems="center"
          gap={2}
          boxShadow="md"
        >
          <Sparkles size={14} /> <Text fontWeight="700" letterSpacing="wide" fontSize="xs">FEATURED STORY</Text>
        </Badge>
      </Box>

      {/* Text side */}
      <Flex direction="column" flex={{ md: '1 1 42%' }} p={{ base: 7, md: 10 }} justify="center" position="relative">
        <Box position="absolute" inset={0} sx={{ backgroundImage: dots('#004E89', 0.04, 22) }} pointerEvents="none" />
        <VStack align="start" spacing={5} position="relative">
          <HStack spacing={3} flexWrap="wrap">
            {post.tags.slice(0, 2).map((t) => (
              <Badge key={t} colorScheme="ocean" variant="subtle" borderRadius="full" px={3} py={1} textTransform="capitalize">
                {t.replace('-', ' ')}
              </Badge>
            ))}
            {post.verified && (
              <Badge colorScheme="tropical" borderRadius="full" px={3} py={1} display="flex" alignItems="center" gap={1}>
                <BadgeCheck size={12} /> Verified
              </Badge>
            )}
          </HStack>
          <Heading
            as="h2"
            fontFamily="heading"
            size={{ base: 'xl', md: '2xl' }}
            color="ocean.700"
            lineHeight={1.15}
            noOfLines={3}
          >
            {post.title}
          </Heading>
          <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} lineHeight={1.8} noOfLines={4}>
            {post.excerpt}
          </Text>
          <HStack spacing={4} color="gray.500" fontSize="sm" pt={1}>
            <Text fontFamily="mono">{post.author}</Text>
            <HStack spacing={1}><Calendar size={13} /><Text>{formatDate(post.date)}</Text></HStack>
            <HStack spacing={1}><Clock size={13} /><Text>{post.readingTime} min</Text></HStack>
          </HStack>
          <Button
            variant="ghost"
            colorScheme="brand"
            rightIcon={<ArrowRight size={17} />}
            px={0}
            _groupHover={{ color: 'brand.600' }}
            fontWeight="700"
          >
            Read the story
          </Button>
        </VStack>
      </Flex>
    </Flex>
  </MotionBox>
);

/** Masonry column card. */
const StoryCard: React.FC<{ post: BlogPost; index: number; onOpen: () => void }> = ({ post, index, onOpen }) => (
  <MotionBox
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
    sx={{ breakInside: 'avoid' }}
    mb={7}
    display="inline-block"
    w="full"
  >
    <MotionBox
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      role="group"
      bg="white"
      borderRadius="3xl"
      overflow="hidden"
      boxShadow="lg"
      cursor="pointer"
      onClick={onOpen}
      _hover={{ boxShadow: '2xl' }}
    >
      <Box position="relative" h={`${cardImageHeights[index % cardImageHeights.length]}px`} bgGradient={gradients[index % gradients.length]} overflow="hidden">
        {post.heroImage && (
          <Image
            src={post.heroImage}
            alt={post.title}
            h="full"
            w="full"
            objectFit="cover"
            transition="transform 0.6s ease"
            _groupHover={{ transform: 'scale(1.07)' }}
            fallback={<Box />}
          />
        )}
        <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.600, transparent 55%)" />
        {post.verified && (
          <Badge position="absolute" top={3} right={3} colorScheme="tropical" display="flex" alignItems="center" gap={1} px={3} py={1} borderRadius="full">
            <BadgeCheck size={12} /> Verified
          </Badge>
        )}
        {/* Tag + title overlaid on the image for a magazine feel */}
        <VStack position="absolute" bottom={0} left={0} right={0} align="start" spacing={2} p={5}>
          {post.tags[0] && (
            <Badge bg="whiteAlpha.900" color="ocean.700" borderRadius="full" px={3} py={0.5} textTransform="capitalize" fontSize="xs">
              {post.tags[0].replace('-', ' ')}
            </Badge>
          )}
          <Heading size="md" color="white" fontFamily="heading" lineHeight={1.25} noOfLines={3} textShadow="0 2px 12px rgba(0,0,0,0.5)">
            {post.title}
          </Heading>
        </VStack>
        <Icon as={PawPrint} position="absolute" top={3} left={3} color="whiteAlpha.700" boxSize={5} />
      </Box>

      <Box p={5}>
        <Text color="gray.600" fontSize="sm" lineHeight={1.7} noOfLines={3}>
          {post.excerpt}
        </Text>
        <Flex justify="space-between" align="center" mt={4} pt={4} borderTop="1px solid" borderColor="blackAlpha.100">
          <HStack spacing={3} color="gray.500" fontSize="xs">
            <HStack spacing={1}><Calendar size={12} /><Text>{formatDate(post.date)}</Text></HStack>
            <HStack spacing={1}><Clock size={12} /><Text>{post.readingTime} min</Text></HStack>
          </HStack>
          <HStack color="brand.500" fontWeight="700" fontSize="sm" spacing={1} _groupHover={{ color: 'brand.600' }}>
            <Text>Read</Text>
            <Box _groupHover={{ transform: 'translateX(3px)' }} transition="transform 0.2s">
              <ArrowRight size={15} />
            </Box>
          </HStack>
        </Flex>
      </Box>
    </MotionBox>
  </MotionBox>
);

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
  const featured = visible[0];
  const rest = visible.slice(1);

  return (
    <Box>
      <PageHero
        eyebrow="Stories From The Field"
        eyebrowIcon={Newspaper}
        title="Every Shelter Has"
        highlight="A Story"
        subtitle="Follow the builds, the rescues and the people making it happen across the Dominican Republic."
        gradient="linear(to-br, ocean.500 via ocean.600 to brand.600)"
        bgImage={IMAGES.heroPack}
      />

      <Box position="relative" bg="sand.100" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: paws('#004E89', 0.035, 120) }} pointerEvents="none" />
        <Container maxW="container.xl" px={4} py={{ base: 12, md: 20 }} position="relative">
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
            <VStack spacing={{ base: 10, md: 14 }} align="stretch">
              {/* Filter toolbar */}
              {allTags.length > 0 && (
                <Flex justify="center">
                  <Wrap
                    justify="center"
                    spacing={2}
                    bg="whiteAlpha.800"
                    backdropFilter="blur(8px)"
                    px={3}
                    py={2}
                    borderRadius="full"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="blackAlpha.100"
                  >
                    {['all', ...allTags].map((tag) => (
                      <WrapItem key={tag}>
                        <Badge
                          as="button"
                          onClick={() => setActiveTag(tag)}
                          px={4}
                          py={2}
                          borderRadius="full"
                          cursor="pointer"
                          transition="all 0.2s"
                          colorScheme={activeTag === tag ? 'brand' : 'gray'}
                          variant={activeTag === tag ? 'solid' : 'subtle'}
                          textTransform="capitalize"
                        >
                          {tag === 'all' ? 'All Stories' : tag.replace('-', ' ')}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Flex>
              )}

              {/* Featured lead story */}
              {featured && <FeaturedStory post={featured} index={0} onOpen={() => navigate(`/blog/${featured.slug}`)} />}

              {/* Masonry column flow */}
              {rest.length > 0 && (
                <Box>
                  <HStack spacing={3} mb={7} align="center">
                    <Box h="1px" flex="0 0 32px" bg="ocean.300" />
                    <Text fontFamily="accent" fontSize="3xl" color="ocean.600" lineHeight={1}>
                      More stories
                    </Text>
                    <Box h="1px" flex={1} bg="blackAlpha.200" />
                  </HStack>
                  <Box
                    sx={{
                      columnGap: '1.75rem',
                      columnCount: { base: 1, md: 2, lg: 3 },
                    }}
                  >
                    {rest.map((post, i) => (
                      <StoryCard key={post.slug} post={post} index={i} onOpen={() => navigate(`/blog/${post.slug}`)} />
                    ))}
                  </Box>
                </Box>
              )}
            </VStack>
          )}
        </Container>
      </Box>
    </Box>
  );
};
