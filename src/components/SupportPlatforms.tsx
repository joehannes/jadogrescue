import React from 'react';
import { Box, Container, SimpleGrid, VStack, HStack, Heading, Text, Link, Icon, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Repeat, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { platformMeta } from '../utils/support';
import { dots } from '../utils/patterns';

const MotionBox = motion(Box);

/**
 * Recurring-giving band for the Donate page. Renders only the membership
 * platforms the owner has enabled and given a URL for under Admin → Recurring,
 * so the public page stays clean until something is configured.
 */
export const SupportPlatforms: React.FC = () => {
  const { support } = useSiteSettings();
  const active = support.filter((p) => p.enabled && p.url.trim());
  if (active.length === 0) return null;

  return (
    <Box py={{ base: 16, md: 22 }} position="relative" overflow="hidden" bg="sand.100">
      <Box position="absolute" inset={0} sx={{ backgroundImage: dots('#1A936F', 0.05, 24) }} pointerEvents="none" />
      <Container maxW="container.lg" px={4} position="relative">
        <VStack spacing={12}>
          <SectionHeading
            eyebrow="Give Every Month"
            eyebrowColor="tropical"
            title="Become a Monthly Supporter"
            subtitle="Steady monthly support lets us plan build days and clinics ahead of time. Join us on whichever platform you already use."
          />
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5} w="full">
            {active.map((p, i) => {
              const meta = platformMeta(p.id);
              if (!meta) return null;
              return (
                <MotionBox
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                >
                  <Link href={p.url} isExternal _hover={{ textDecoration: 'none' }} display="block" h="full">
                    <Box
                      bg="white"
                      borderRadius="2xl"
                      boxShadow="md"
                      p={6}
                      h="full"
                      borderTopWidth="4px"
                      borderTopColor={meta.color}
                      transition="box-shadow 0.2s"
                      _hover={{ boxShadow: 'xl' }}
                    >
                      <Flex justify="space-between" align="start" mb={3}>
                        <Box
                          w={11}
                          h={11}
                          borderRadius="xl"
                          bg={`${meta.color}1A`}
                          color={meta.color}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={Repeat} boxSize={5} />
                        </Box>
                        <Icon as={ArrowUpRight} color="gray.300" />
                      </Flex>
                      <Heading size="md" color="ocean.700" mb={1}>
                        {meta.name}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        {meta.tagline}
                      </Text>
                      {p.handle && (
                        <Text fontSize="xs" color="gray.400" mt={2} fontFamily="mono">
                          {p.handle}
                        </Text>
                      )}
                    </Box>
                  </Link>
                </MotionBox>
              );
            })}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};
