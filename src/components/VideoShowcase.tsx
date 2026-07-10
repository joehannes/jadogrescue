import React, { useRef, useState } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Icon,
  AspectRatio,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Play, Film, Clock3, Recycle, PawPrint } from 'lucide-react';
import { IMAGES, DEMO_VIDEO } from '../utils/media';

const MotionBox = motion(Box);

const highlights = [
  { icon: Clock3, label: 'Built in 4 hours', color: 'brand' },
  { icon: Recycle, label: '200+ bottles reused', color: 'tropical' },
  { icon: PawPrint, label: 'A safe home for life', color: 'ocean' },
];

/**
 * "Watch our story" video section. Shows an on-brand poster with a play
 * button; clicking loads and plays the video.
 *
 * TODO: swap DEMO_VIDEO for your real rescue footage, or replace the <video>
 * with a YouTube <iframe> embed.
 */
export const VideoShowcase: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    setPlaying(true);
    // Start playback once the element is shown.
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  };

  return (
    <Box w="full" bgGradient="linear(to-br, ocean.700, ocean.900)" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
      {/* soft glow */}
      <Box position="absolute" top="-10%" right="-5%" w={80} h={80} bg="brand.500" opacity={0.2} filter="blur(100px)" borderRadius="full" />

      <Container maxW="container.xl" px={4} position="relative">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 10, lg: 16 }} alignItems="center">
          {/* Copy */}
          <VStack align={{ base: 'center', lg: 'start' }} spacing={6} textAlign={{ base: 'center', lg: 'left' }} color="white">
            <Badge
              bg="whiteAlpha.200"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Film size={15} /> WATCH OUR STORY
            </Badge>
            <Heading size={{ base: 'xl', md: '2xl' }} fontFamily="heading" lineHeight={1.2}>
              See a shelter built from
              <Box as="span" bgGradient="linear(to-r, coral.300, tropical.300)" bgClip="text"> trash to treasure</Box>
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} opacity={0.9} maxW="lg" lineHeight={1.8}>
              In a few short minutes, watch how discarded plastic bottles become a warm, dry,
              insulated home — and how a street dog's whole world changes.
            </Text>
            <VStack align={{ base: 'center', lg: 'start' }} spacing={3} pt={2}>
              {highlights.map((h) => (
                <HStack key={h.label} spacing={3}>
                  <Box w={9} h={9} borderRadius="lg" bg="whiteAlpha.200" display="flex" alignItems="center" justifyContent="center">
                    <Icon as={h.icon} boxSize={5} />
                  </Box>
                  <Text fontWeight="600">{h.label}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>

          {/* Player */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="2xl"
            border="4px solid"
            borderColor="whiteAlpha.200"
            position="relative"
          >
            <AspectRatio ratio={16 / 9}>
              {playing ? (
                <video
                  ref={videoRef}
                  src={DEMO_VIDEO}
                  poster={IMAGES.videoPoster}
                  controls
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
                />
              ) : (
                <Box
                  role="button"
                  aria-label="Play video"
                  onClick={play}
                  cursor="pointer"
                  bgImage={`url(${IMAGES.videoPoster})`}
                  bgSize="cover"
                  bgPosition="center"
                  position="relative"
                >
                  <Box position="absolute" inset={0} bg="blackAlpha.400" />
                  <Box position="absolute" inset={0} display="flex" alignItems="center" justifyContent="center">
                    <MotionBox
                      className="play-btn"
                      w={{ base: 16, md: 20 }}
                      h={{ base: 16, md: 20 }}
                      borderRadius="full"
                      bg="brand.500"
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      animate={{ boxShadow: ['0 0 0 0px rgba(255,107,53,0.45)', '0 0 0 22px rgba(255,107,53,0)'] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    >
                      <Play size={30} fill="currentColor" style={{ marginLeft: 4 }} />
                    </MotionBox>
                  </Box>
                </Box>
              )}
            </AspectRatio>
          </MotionBox>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
