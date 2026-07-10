import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ScrollText,
  Eye,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { bones, grid, waves } from '../utils/patterns';
import { IMAGES } from '../utils/media';

const MotionBox = motion(Box);

export type LegalSlug = 'privacy' | 'terms' | 'transparency';

interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalDoc {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  highlight: string;
  subtitle: string;
  bgImage: string;
  /** Tint used for the pattern + accent stat band. */
  accent: 'ocean' | 'brand' | 'tropical';
  intro: string;
  sections: LegalSection[];
  /** Quick facts shown as a highlight band above the fine print. */
  highlights: { value: string; label: string }[];
}

const ORG = 'John & Abigail Dog Rescue';
const CONTACT = 'hello@jadr.org';
const EFFECTIVE = 'January 1, 2026';

const ACCENT_HEX: Record<LegalDoc['accent'], string> = {
  ocean: '#004E89',
  brand: '#FF6B35',
  tropical: '#1A936F',
};

/**
 * A single, generic legal/report page driven entirely by the `LEGAL` config
 * below. Adding a new document is a matter of adding one keyed entry and a
 * route in App.tsx — no new component required.
 */
const LEGAL: Record<LegalSlug, LegalDoc> = {
  privacy: {
    eyebrow: 'Your Data',
    icon: ShieldCheck,
    title: 'Privacy',
    highlight: 'Policy',
    subtitle:
      'We collect as little as possible, never sell it, and only use it to build shelters and keep you updated on the dogs you help.',
    bgImage: IMAGES.heroBeach,
    accent: 'ocean',
    intro: `${ORG} ("we", "us") respects your privacy. This policy explains what we collect when you donate, volunteer, or contact us, and how we use it. It applies to our website and any related forms.`,
    highlights: [
      { value: '0', label: 'Data brokers we sell to' },
      { value: 'HTTPS', label: 'Encrypted end to end' },
      { value: '30d', label: 'Inquiry retention' },
    ],
    sections: [
      {
        heading: 'What we collect',
        body: [
          'Contact details you give us voluntarily — your name, email, and (if you write in) your message.',
          'Donation details processed by our payment providers (PayPal, Stripe, GoFundMe). We never see or store your full card number.',
          'Basic, anonymous analytics such as which pages are visited, to help us improve the site.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To process and acknowledge your donation and send the shelter GPS + photos it funded.',
          'To reply to volunteer, partner, and help requests.',
          'To send occasional updates — only if you opt in, and you can unsubscribe at any time.',
        ],
      },
      {
        heading: 'What we never do',
        body: [
          'We never sell, rent, or trade your personal information.',
          'We never share your details with third parties except the payment processors required to complete your gift.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          `You can ask us to show, correct, or delete the data we hold about you at any time by emailing ${CONTACT}.`,
          'You can opt out of all communications with a single click in any email we send.',
        ],
      },
    ],
  },
  terms: {
    eyebrow: 'The Fine Print',
    icon: ScrollText,
    title: 'Terms of',
    highlight: 'Service',
    subtitle:
      'The simple, good-faith agreement that governs how you use this site and the donations you make through it.',
    bgImage: IMAGES.heroWorkshop,
    accent: 'brand',
    intro: `By using the ${ORG} website you agree to these terms. We keep them short and plain because we would rather spend our time building shelters than writing legalese.`,
    highlights: [
      { value: '100%', label: 'Goes to the cause' },
      { value: '$10', label: 'Builds one shelter' },
      { value: 'DR', label: 'Where funds are used' },
    ],
    sections: [
      {
        heading: 'Donations',
        body: [
          'Donations are voluntary gifts used to build dog shelters and feed street dogs in the Dominican Republic.',
          'Because materials are purchased and local labor is paid promptly, donations are generally non-refundable. If a genuine mistake was made, email us within 14 days and we will do our best to help.',
          'Impact figures ("$10 builds a shelter") are honest estimates based on real average costs, not fixed guarantees for every individual gift.',
        ],
      },
      {
        heading: 'Acceptable use',
        body: [
          'Use this site lawfully and do not attempt to disrupt, scrape abusively, or gain unauthorized access to it.',
          'Content on this site (photos, stories, guides) is ours or used with permission. You may share it to support our mission, with credit, but not resell it.',
        ],
      },
      {
        heading: 'DIY guides',
        body: [
          'Our building guides are provided in good faith for educational use. Build responsibly and follow local regulations — we cannot be liable for outcomes of self-directed builds.',
        ],
      },
      {
        heading: 'Changes',
        body: [
          'We may update these terms as the project grows. Material changes will be reflected here with a new effective date.',
        ],
      },
    ],
  },
  transparency: {
    eyebrow: 'Radical Transparency',
    icon: Eye,
    title: 'Transparency',
    highlight: 'Report',
    subtitle:
      'Every shelter is geotagged, photographed, and dated. Here is exactly where the money goes — no overhead, no mystery.',
    bgImage: IMAGES.heroPack,
    accent: 'tropical',
    intro: `Radical transparency is the whole point of ${ORG}. We publish where every dollar goes so global micro-donors can trust local action. This report summarizes our model and our latest figures.`,
    highlights: [
      { value: '100%', label: 'Reaches the ground' },
      { value: '$10', label: 'Full cost per shelter' },
      { value: '1000+', label: 'Bottles recycled' },
    ],
    sections: [
      {
        heading: 'Where your $10 goes',
        body: [
          'Roughly $6 pays for four hours of fair local labor to build one insulated shelter.',
          'The remaining ~$4 covers cords, transport, and the small natural materials that supplement recycled bottles and palm fiber.',
          'The bottles themselves are diverted waste — collected from streets and beaches at no cost.',
        ],
      },
      {
        heading: 'How we verify impact',
        body: [
          'Every completed shelter is logged on our interactive map with GPS coordinates.',
          'Donors receive photos and the exact location of the shelter their gift funded.',
          'Blog updates are AI-assisted for drafting and translation but human-verified by on-the-ground coordinators before publishing — real facts, real photos only.',
        ],
      },
      {
        heading: 'Governance',
        body: [
          'We are a small, founder-led effort (John & Abigail) working with trusted local builders and community partners.',
          'Financial summaries are updated periodically here. Questions about any figure are welcome — just email us.',
        ],
      },
    ],
  },
};

export const Legal: React.FC<{ slug: LegalSlug }> = ({ slug }) => {
  const doc = LEGAL[slug];

  return (
    <Box>
      <PageHero
        eyebrow={doc.eyebrow}
        eyebrowIcon={doc.icon}
        title={doc.title}
        highlight={doc.highlight}
        subtitle={doc.subtitle}
        bgImage={doc.bgImage}
        dividerColor="sand.100"
      />

      {/* Highlight band — even a plain report gets a patterned, single-color panel */}
      <Box
        w="full"
        bgGradient={`linear(to-br, ${doc.accent}.500, ${doc.accent}.700)`}
        color="white"
        py={{ base: 10, md: 12 }}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" inset={0} sx={{ backgroundImage: waves('#ffffff', 0.08, 90) }} pointerEvents="none" />
        <Container maxW="container.lg" px={4} position="relative">
          <SimpleGrid columns={{ base: 3 }} spacing={6}>
            {doc.highlights.map((h) => (
              <VStack key={h.label} spacing={1}>
                <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="800" fontFamily="heading" lineHeight={1}>
                  {h.value}
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} opacity={0.9} textAlign="center" fontWeight="600">
                  {h.label}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Document body */}
      <Box position="relative" py={{ base: 12, md: 20 }} overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: grid('#004E89', 0.04, 46) }} pointerEvents="none" />
        <Container maxW="container.md" px={4} position="relative">
          <MotionBox
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <Card borderRadius="3xl" boxShadow="xl" overflow="hidden">
              <Box position="absolute" top={0} right={0} opacity={0.06} pointerEvents="none">
                <Box sx={{ backgroundImage: bones(ACCENT_HEX[doc.accent], 0.5, 120) }} w={200} h={200} />
              </Box>
              <CardBody p={{ base: 6, md: 12 }} position="relative">
                <HStack spacing={3} mb={4} color={`${doc.accent}.600`}>
                  <Icon as={FileText} boxSize={5} />
                  <Text fontSize="sm" fontFamily="mono" letterSpacing="wide" textTransform="uppercase">
                    Effective {EFFECTIVE}
                  </Text>
                </HStack>
                <Text color="gray.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight={1.8} mb={2}>
                  {doc.intro}
                </Text>

                <VStack align="stretch" spacing={8} mt={8}>
                  {doc.sections.map((section, i) => (
                    <Box key={section.heading}>
                      <HStack spacing={3} mb={3} align="center">
                        <Box
                          flexShrink={0}
                          w={8}
                          h={8}
                          borderRadius="lg"
                          bg={`${doc.accent}.50`}
                          color={`${doc.accent}.600`}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="800"
                          fontSize="sm"
                        >
                          {i + 1}
                        </Box>
                        <Heading size="md" color="ocean.700" fontFamily="heading">
                          {section.heading}
                        </Heading>
                      </HStack>
                      <VStack align="stretch" spacing={2} pl={11}>
                        {section.body.map((p, j) => (
                          <Text key={j} color="gray.600" lineHeight={1.8}>
                            {p}
                          </Text>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </VStack>

                <Divider my={8} />
                <Text fontSize="sm" color="gray.500" lineHeight={1.7}>
                  Questions about this {slug === 'transparency' ? 'report' : 'policy'}? Email us at{' '}
                  <Text as="a" href={`mailto:${CONTACT}`} color={`${doc.accent}.600`} fontWeight="600">
                    {CONTACT}
                  </Text>
                  . This document is a plain-language summary and does not constitute legal advice.
                </Text>
              </CardBody>
            </Card>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};
