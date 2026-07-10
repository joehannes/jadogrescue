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
  Button,
  Image,
  Flex,
  Icon,
  Spinner,
  Center,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BadgeCheck, ArrowLeft, Heart, PawPrint, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { Markdown } from '../components/Markdown';
import { getBlogPostBySlug } from '../utils/blog';
import type { BlogPost as BlogPostType } from '../types';

const MotionBox = motion(Box);

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getBlogPostBySlug(slug)
      .then(setPost)
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (loading) {
    return (
      <Center h="70vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (!post) {
    return (
      <Container maxW="container.md" px={4} py={24}>
        <VStack spacing={6} textAlign="center" color="gray.600">
          <PawPrint size={56} />
          <Heading size="lg" color="ocean.600">Story not found</Heading>
          <Text>We couldn't find that story. It may have moved or been unpublished.</Text>
          <Button colorScheme="brand" leftIcon={<ArrowLeft size={18} />} onClick={() => navigate('/blog')}>
            Back to all stories
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box>
      <PageHero
        eyebrow={post.tags[0]?.replace('-', ' ') || 'Story'}
        eyebrowIcon={PawPrint}
        title={post.title}
        gradient="linear(to-br, ocean.600 via ocean.700 to brand.600)"
      >
        <HStack spacing={5} color="white" opacity={0.95} flexWrap="wrap" justify="center">
          <HStack spacing={2}>
            <User size={16} />
            <Text fontWeight="600">{post.author}</Text>
          </HStack>
          <HStack spacing={2}>
            <Calendar size={16} />
            <Text>{formatDate(post.date)}</Text>
          </HStack>
          <HStack spacing={2}>
            <Clock size={16} />
            <Text>{post.readingTime} min read</Text>
          </HStack>
          {post.verified && (
            <Badge colorScheme="tropical" display="flex" alignItems="center" gap={1} px={3} py={1}>
              <BadgeCheck size={13} /> Verified
            </Badge>
          )}
        </HStack>
      </PageHero>

      <Container maxW="container.md" px={4} py={{ base: 10, md: 16 }}>
        <Button
          variant="ghost"
          colorScheme="brand"
          leftIcon={<ArrowLeft size={18} />}
          mb={8}
          onClick={() => navigate('/blog')}
        >
          All stories
        </Button>

        {/* Hero image (optional, with graceful fallback) */}
        {post.heroImage && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            borderRadius="3xl"
            overflow="hidden"
            mb={10}
            boxShadow="xl"
            h={{ base: 52, md: 80 }}
            bgGradient="linear(to-br, brand.400, ocean.500)"
          >
            <Image
              src={post.heroImage}
              alt={post.title}
              w="full"
              h="full"
              objectFit="cover"
              fallback={<Box w="full" h="full" bgGradient="linear(to-br, brand.400, ocean.500)" />}
            />
          </MotionBox>
        )}

        {/* Article body */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Markdown content={post.content} />
        </MotionBox>

        <Divider my={10} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <Wrap spacing={3} mb={10}>
            {post.tags.map((tag) => (
              <WrapItem key={tag}>
                <Badge colorScheme="ocean" px={4} py={2} borderRadius="full" textTransform="capitalize">
                  #{tag.replace('-', ' ')}
                </Badge>
              </WrapItem>
            ))}
          </Wrap>
        )}

        {/* CTA */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          bgGradient="linear(to-r, brand.500, coral.500)"
          borderRadius="3xl"
          p={{ base: 8, md: 10 }}
          color="white"
          textAlign="center"
          boxShadow="2xl"
        >
          <VStack spacing={4}>
            <Heading size="lg" fontFamily="heading">Moved by this story?</Heading>
            <Text opacity={0.95} maxW="md">
              Your $10 builds the next shelter and writes the next rescue story.
            </Text>
            <Flex gap={4} flexWrap="wrap" justify="center">
              <Button
                bg="white"
                color="brand.600"
                leftIcon={<Heart size={18} />}
                _hover={{ bg: 'whiteAlpha.900', transform: 'translateY(-3px)' }}
                onClick={() => navigate('/donate')}
              >
                Donate $10
              </Button>
              <Button
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-3px)' }}
                onClick={() => navigate('/blog')}
              >
                Read more stories
              </Button>
            </Flex>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};
