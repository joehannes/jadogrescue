import React, { useState } from 'react';
import {
  Box,
  Container,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { topo } from '../utils/patterns';

const MotionBox = motion(Box);

interface GalleryProps {
  images: string[];
}

/** Responsive photo grid with hover-zoom and a click-to-enlarge lightbox. */
export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = useState<string | null>(null);

  const open = (src: string) => {
    setActive(src);
    onOpen();
  };

  // Vary tile heights for a lively, magazine-style grid.
  const spans = [2, 1, 1, 1, 1, 2];

  return (
    <Box w="full" bgGradient="linear(to-b, sand.100, white)" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
      <Box position="absolute" inset={0} sx={{ backgroundImage: topo('#004E89', 0.05, 150) }} pointerEvents="none" />
      <Container maxW="container.xl" px={4} position="relative">

        <SectionHeading
          eyebrow="Moments"
          eyebrowColor="coral"
          title="Faces You've Helped"
          subtitle="Real dogs, real shelters, real second chances across the Dominican Republic."
        />
        <Box
          mt={12}
          sx={{
            columnGap: '16px',
            columnCount: 2,
            '@media (min-width: 48em)': { columnCount: 3 },
          }}
        >
          {images.map((src, i) => (
            <MotionBox
              key={src}
              mb={4}
              borderRadius="2xl"
              overflow="hidden"
              cursor="pointer"
              position="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
              onClick={() => open(src)}
              sx={{ breakInside: 'avoid' }}
              role="group"
            >
              <Image
                src={src}
                alt={`Rescue moment ${i + 1}`}
                w="full"
                h={spans[i % spans.length] === 2 ? { base: 52, md: 72 } : { base: 40, md: 56 }}
                objectFit="cover"
                transition="transform 0.5s ease"
                _groupHover={{ transform: 'scale(1.08)' }}
                fallback={<Box w="full" h={48} bgGradient="linear(to-br, brand.300, ocean.400)" />}
              />
              <Box
                position="absolute"
                inset={0}
                bg="blackAlpha.400"
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.3s"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
              >
                <Camera size={26} />
              </Box>
            </MotionBox>
          ))}
        </Box>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
        <ModalContent bg="transparent" boxShadow="none" mx={4}>
          <ModalCloseButton color="white" bg="whiteAlpha.300" borderRadius="full" />
          {active && (
            <Image src={active} alt="Enlarged rescue moment" borderRadius="2xl" w="full" maxH="80vh" objectFit="contain" />
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};
