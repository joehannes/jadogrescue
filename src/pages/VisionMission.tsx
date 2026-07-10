import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Icon,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Heart,
  Eye,
  Recycle,
  Users,
  HandHeart,
  Sparkles,
  ArrowRight,
  Quote,
  Target,
  Compass,
  CloudRain,
  Droplet,
  Home as HomeIcon,
  MapPin,
  Bot,
  Calendar,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { IMAGES } from '../utils/media';
import { paws, bottles, palm, waves, dots } from '../utils/patterns';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const values = [
  {
    icon: Eye,
    title: 'Radical Transparency',
    color: 'ocean',
    text: 'Every shelter is geotagged, photographed and dated. You see exactly where your $10 went — no overhead, no mystery.',
  },
  {
    icon: Recycle,
    title: 'Waste Into Worth',
    color: 'tropical',
    text: 'Discarded plastic bottles become insulated walls. We turn a pollution problem into shelter for street dogs.',
  },
  {
    icon: Users,
    title: 'Local Livelihoods',
    color: 'brand',
    text: 'Shelters are built by local workers who are paid fairly. Your donation supports a family and a dog at once.',
  },
  {
    icon: HandHeart,
    title: 'Dignity For Dogs',
    color: 'coral',
    text: 'Shade from the sun, shelter from the rain, and automatic rainwater to drink. Small comforts, big difference.',
  },
];

// The three-part shelter architecture straight from the concept.
const architecture: { icon: LucideIcon; step: string; title: string; text: string; color: string }[] = [
  {
    icon: CloudRain,
    step: '01',
    title: 'Rainwater Collection',
    color: 'ocean',
    text: 'Inverted bottles at the roofline (caps removed) funnel rain down into the shelter walls.',
  },
  {
    icon: HomeIcon,
    step: '02',
    title: 'Insulated Walls',
    color: 'tropical',
    text: 'Interconnected bottles woven with natural palm fiber insulate against heat and tropical rain.',
  },
  {
    icon: Droplet,
    step: '03',
    title: 'Licking Station',
    color: 'brand',
    text: 'Bottom bottles with loosened caps hold the percolated water so dogs can drink straight from the base.',
  },
];

const placement = [
  { icon: HandHeart, title: 'Food Access', text: 'Placed by restaurants so staff can drop food scraps at the shelter entrance.' },
  { icon: Droplet, title: 'Water Access', text: 'Autonomous rain collection means dogs never have to wander far to drink.' },
  { icon: Users, title: 'Community Watch', text: 'Sited in visible spots so locals keep an eye on the dogs and the shelter.' },
];

const stats = [
  { number: '$10', label: 'Builds One Shelter', color: 'brand' },
  { number: '4hrs', label: 'To Build By Hand', color: 'ocean' },
  { number: '200', label: 'Bottles Reused Each', color: 'tropical' },
  { number: '100%', label: 'Goes To The Cause', color: 'coral' },
];

// Recent + soon-to-come events with John & Abigail and new volunteers (2026).
const events = [
  {
    when: 'Jun 2026',
    tag: 'Recap',
    tagColor: 'tropical',
    title: 'Bavaro Beach Bottle Drive',
    text: 'John, Abigail and eight new volunteers cleared 1,400+ bottles off Playa Bavaro in a single morning — enough material for our next seven shelters.',
  },
  {
    when: 'Jul 2026',
    tag: 'Happening now',
    tagColor: 'brand',
    title: 'Volunteer Onboarding Cohort',
    text: 'Our first structured volunteer intake: five newcomers learning the 4-hour build, photo logging, and Spanish–English update workflow alongside Carlos.',
  },
  {
    when: 'Aug 2026',
    tag: 'Upcoming',
    tagColor: 'ocean',
    title: 'Squad Build Day · Los Corales',
    text: 'A full week employing two local builders plus volunteers to raise 10+ shelters in one neighborhood — creating a safe zone for a whole street pack.',
  },
  {
    when: 'Sep 2026',
    tag: 'Upcoming',
    tagColor: 'ocean',
    title: 'Comedor Partnership Expansion',
    text: 'Extending our feeding partnership with Comedor La Esperanza to two more restaurants near Punta Cana, each anchored by a cluster of new shelters.',
  },
  {
    when: 'Oct 2026',
    tag: 'Planned',
    tagColor: 'coral',
    title: 'Puerto Plata Pilot',
    text: 'John & Abigail scout the north coast for our first shelters outside the east — with a local volunteer lead we are training now.',
  },
];

export const VisionMission: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHero
        eyebrow="Vision & Mission"
        eyebrowIcon={Compass}
        title="Making Something"
        highlight="Out of Little"
        subtitle="Empowering global micro-donors to save street dogs in the Dominican Republic — one recycled bottle, one $10 shelter, one dog at a time."
        bgImage={IMAGES.heroDog}
      />

      {/* Vision + Mission pair */}
      <Container maxW="container.lg" px={4} py={{ base: 12, md: 20 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {[
            {
              icon: Compass,
              label: 'Our Vision',
              color: 'ocean',
              text: 'A Dominican Republic where no street dog goes without shade, water, or dignity — and where the plastic that once polluted its beaches becomes the shelter that protects them.',
            },
            {
              icon: Target,
              label: 'Our Mission',
              color: 'brand',
              text: 'To fund practical, $10 shelters that everyday people can pay for and local workers can build in four hours — proving that radical transparency turns small gifts into real, verifiable impact.',
            },
          ].map((b, i) => (
            <MotionCard
              key={b.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              borderRadius="3xl"
              bg="white"
              boxShadow="lg"
              position="relative"
              overflow="hidden"
            >
              <Box position="absolute" inset={0} sx={{ backgroundImage: dots(b.color === 'ocean' ? '#004E89' : '#FF6B35', 0.06, 24) }} pointerEvents="none" />
              <CardBody p={{ base: 7, md: 9 }} position="relative">
                <Box
                  w={14}
                  h={14}
                  borderRadius="2xl"
                  bgGradient={`linear(to-br, ${b.color}.400, ${b.color}.600)`}
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={5}
                >
                  <Icon as={b.icon} boxSize={7} />
                </Box>
                <Text fontFamily="mono" fontSize="sm" letterSpacing="0.2em" textTransform="uppercase" color={`${b.color}.600`} mb={2}>
                  {b.label}
                </Text>
                <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.700" lineHeight={1.7} fontWeight="500">
                  {b.text}
                </Text>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>
      </Container>

      {/* Founder quote */}
      <Container maxW="container.lg" px={4} pb={{ base: 8, md: 12 }}>
        <MotionCard
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          borderRadius="3xl"
          bgGradient="linear(to-br, ocean.500, ocean.700)"
          color="white"
          overflow="hidden"
          position="relative"
        >
          <Box position="absolute" inset={0} sx={{ backgroundImage: paws('#ffffff', 0.06, 96) }} pointerEvents="none" />
          <Box position="absolute" top={-8} left={6} opacity={0.15}>
            <Quote size={120} />
          </Box>
          <CardBody py={{ base: 10, md: 14 }} px={{ base: 6, md: 14 }} position="relative">
            <VStack spacing={6} align="center" textAlign="center">
              <Heading size={{ base: 'lg', md: 'xl' }} fontFamily="heading" fontWeight="700" lineHeight={1.4}>
                “We believe a street dog's life is worth more than a plastic bottle's second use —
                so we combine the two and let compassion compound.”
              </Heading>
              <HStack spacing={3}>
                <Box w={12} h={12} borderRadius="full" bg="whiteAlpha.300" display="flex" alignItems="center" justifyContent="center">
                  <Heart size={22} fill="currentColor" />
                </Box>
                <VStack spacing={0} align="start">
                  <Text fontWeight="700">John & Abigail</Text>
                  <Text fontSize="sm" opacity={0.8} fontFamily="mono">FOUNDERS, BAVARO DR</Text>
                </VStack>
              </HStack>
            </VStack>
          </CardBody>
        </MotionCard>
      </Container>

      {/* Impact numbers */}
      <Container maxW="container.xl" px={4} pb={{ base: 12, md: 16 }}>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          {stats.map((s, i) => (
            <MotionBox
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              py={8}
              textAlign="center"
            >
              <Text
                fontSize={{ base: '3xl', md: '5xl' }}
                fontWeight="800"
                bgGradient={`linear(to-r, ${s.color}.400, ${s.color}.600)`}
                bgClip="text"
                lineHeight={1}
              >
                {s.number}
              </Text>
              <Text mt={2} color="gray.600" fontWeight="600" fontSize={{ base: 'sm', md: 'md' }}>
                {s.label}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* The $10, 4-hour shelter — solution + architecture */}
      <Box w="full" bgGradient="linear(to-b, sand.100, white)" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: bottles('#1A936F', 0.06, 130) }} pointerEvents="none" />
        <Container maxW="container.xl" px={4} position="relative">
          <VStack spacing={14}>
            <SectionHeading
              eyebrow="The Solution"
              eyebrowColor="tropical"
              title="The $10, 4-Hour Plastic Bottle Shelter"
              subtitle="No grand schemes — a practical intervention everyday people can fund and local workers can build in a single afternoon from discarded bottles and natural palm fiber."
            />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {architecture.map((a, i) => (
                <MotionCard
                  key={a.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  borderRadius="3xl"
                  bg="white"
                  boxShadow="lg"
                >
                  <CardBody p={8}>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Box
                        w={14}
                        h={14}
                        borderRadius="2xl"
                        bgGradient={`linear(to-br, ${a.color}.400, ${a.color}.600)`}
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={a.icon} boxSize={7} />
                      </Box>
                      <Text fontFamily="mono" fontSize="3xl" fontWeight="800" color={`${a.color}.100`}>
                        {a.step}
                      </Text>
                    </Flex>
                    <Heading size="md" color={`${a.color}.600`} mb={2}>{a.title}</Heading>
                    <Text color="gray.600" lineHeight={1.7}>{a.text}</Text>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Strategic placement — single-color band with pattern */}
      <Box w="full" bgGradient="linear(to-br, ocean.600, ocean.800)" color="white" py={{ base: 16, md: 20 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: waves('#ffffff', 0.07, 90) }} pointerEvents="none" />
        <Container maxW="container.xl" px={4} position="relative">
          <VStack spacing={12}>
            <VStack spacing={3} textAlign="center" maxW="2xl">
              <Badge bg="whiteAlpha.200" color="white" px={4} py={2} borderRadius="full" fontFamily="mono" letterSpacing="wide">
                <HStack spacing={2}><MapPin size={14} /><Text>Strategic Placement</Text></HStack>
              </Badge>
              <Heading size={{ base: 'xl', md: '2xl' }} fontFamily="heading">Sited Where Dogs Already Gather</Heading>
              <Text opacity={0.9} fontSize={{ base: 'md', md: 'lg' }}>
                Shelters go near restaurants and community hubs — close to food, water, and watchful neighbours.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
              {placement.map((p, i) => (
                <MotionBox
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  bg="whiteAlpha.100"
                  backdropFilter="blur(6px)"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  borderRadius="2xl"
                  p={7}
                >
                  <Icon as={p.icon} boxSize={7} mb={4} color="tropical.200" />
                  <Heading size="md" mb={2} fontFamily="heading">{p.title}</Heading>
                  <Text opacity={0.85} lineHeight={1.7}>{p.text}</Text>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Values */}
      <Box w="full" bgGradient="linear(to-b, white, sand.100)" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: palm('#1A936F', 0.05, 140) }} pointerEvents="none" />
        <Container maxW="container.xl" px={4} position="relative">
          <VStack spacing={14}>
            <SectionHeading
              eyebrow="What We Stand For"
              title="Values That Guide Every Build"
              subtitle="Four principles keep us honest, local, and focused on the dogs."
            />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              {values.map((v, i) => (
                <MotionCard
                  key={v.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  borderRadius="3xl"
                  bg="white"
                  boxShadow="lg"
                >
                  <CardBody p={8}>
                    <Flex gap={5} align="start">
                      <MotionBox
                        flexShrink={0}
                        w={16}
                        h={16}
                        borderRadius="2xl"
                        bgGradient={`linear(to-br, ${v.color}.400, ${v.color}.600)`}
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        whileHover={{ rotate: 10, scale: 1.05 }}
                      >
                        <Icon as={v.icon} boxSize={7} />
                      </MotionBox>
                      <Box>
                        <Heading size="md" mb={2} color={`${v.color}.600`}>
                          {v.title}
                        </Heading>
                        <Text color="gray.600" lineHeight={1.7}>
                          {v.text}
                        </Text>
                      </Box>
                    </Flex>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Upcoming events / roadmap */}
      <Container maxW="container.lg" px={4} py={{ base: 16, md: 24 }}>
        <VStack spacing={14}>
          <SectionHeading
            eyebrow="What's Next"
            eyebrowColor="tropical"
            title="Recent & Upcoming"
            subtitle="Where John, Abigail, and our growing crew of volunteers are pointed over the coming months."
          />
          <Box position="relative" w="full">
            <Box
              position="absolute"
              left={{ base: 4, md: '50%' }}
              top={0}
              bottom={0}
              w="2px"
              bgGradient="linear(to-b, brand.300, ocean.300)"
              transform={{ md: 'translateX(-50%)' }}
            />
            <VStack spacing={10} align="stretch">
              {events.map((e, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5 }}
                >
                  <Flex
                    direction={{ base: 'row', md: i % 2 === 0 ? 'row' : 'row-reverse' }}
                    align="center"
                    gap={6}
                  >
                    <Box flex={1} pl={{ base: 12, md: 0 }} textAlign={{ base: 'left', md: i % 2 === 0 ? 'right' : 'left' }}>
                      <Card borderRadius="2xl" boxShadow="md" _hover={{ boxShadow: 'xl' }} transition="all 0.3s">
                        <CardBody>
                          <HStack mb={2} spacing={2} justify={{ base: 'flex-start', md: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                            <Badge colorScheme="brand"><HStack spacing={1}><Calendar size={12} /><Text>{e.when}</Text></HStack></Badge>
                            <Badge colorScheme={e.tagColor}>{e.tag}</Badge>
                          </HStack>
                          <Heading size="md" color="ocean.600" mb={1}>{e.title}</Heading>
                          <Text color="gray.600" fontSize="sm">{e.text}</Text>
                        </CardBody>
                      </Card>
                    </Box>
                    <Box
                      position={{ base: 'absolute', md: 'static' }}
                      left={{ base: 4, md: 'auto' }}
                      transform={{ base: 'translateX(-45%)', md: 'none' }}
                      w={6}
                      h={6}
                      borderRadius="full"
                      bg="brand.500"
                      border="4px solid"
                      borderColor="sand.100"
                      flexShrink={0}
                      zIndex={1}
                    />
                    <Box flex={1} display={{ base: 'none', md: 'block' }} />
                  </Flex>
                </MotionBox>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* How the platform works — AI-verified blog + transparency */}
      <Box w="full" bgGradient="linear(to-br, tropical.500, ocean.700)" color="white" py={{ base: 16, md: 22 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: dots('#ffffff', 0.07, 26) }} pointerEvents="none" />
        <Container maxW="container.lg" px={4} position="relative">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {[
              {
                icon: Bot,
                title: 'AI-Drafted, Human-Verified',
                text: 'AI helps our local volunteers draft updates, translate Spanish to English, and optimize photos. Every post is verified by an on-the-ground coordinator before it goes live — real facts and real photos only, never fabricated stories.',
              },
              {
                icon: Eye,
                title: 'A Transparency Dashboard',
                text: 'Every shelter built is logged on our interactive map. When you donate, you receive the GPS coordinates, photos, and the exact location where your $10 shelter was placed.',
              },
            ].map((b, i) => (
              <MotionBox
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                bg="whiteAlpha.100"
                backdropFilter="blur(6px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                borderRadius="3xl"
                p={{ base: 7, md: 9 }}
              >
                <Icon as={b.icon} boxSize={9} mb={4} color="tropical.100" />
                <Heading size="lg" mb={3} fontFamily="heading">{b.title}</Heading>
                <Text opacity={0.9} lineHeight={1.8}>{b.text}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxW="container.lg" px={4} py={{ base: 16, md: 24 }}>
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          bgGradient="linear(to-r, brand.500, coral.500)"
          borderRadius="3xl"
          p={{ base: 8, md: 12 }}
          textAlign="center"
          color="white"
          boxShadow="2xl"
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" inset={0} sx={{ backgroundImage: paws('#ffffff', 0.08, 90) }} pointerEvents="none" />
          <VStack spacing={5} position="relative">
            <Icon as={Sparkles} boxSize={8} />
            <Heading size={{ base: 'lg', md: 'xl' }} fontFamily="heading">
              Be part of the next chapter
            </Heading>
            <Text maxW="xl" opacity={0.95} fontSize="lg">
              Every $10 builds a shelter and rescues a dog. Join hundreds of micro-donors making
              something out of little.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                size="lg"
                bg="white"
                color="brand.600"
                rightIcon={<Heart size={18} />}
                _hover={{ bg: 'whiteAlpha.900', transform: 'translateY(-3px)' }}
                onClick={() => navigate('/donate')}
              >
                Donate $10
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                rightIcon={<ArrowRight size={18} />}
                _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-3px)' }}
                onClick={() => navigate('/volunteer')}
              >
                Volunteer
              </Button>
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};
