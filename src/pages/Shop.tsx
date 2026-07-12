import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Image,
  AspectRatio,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Spinner,
  Icon,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingBag, ExternalLink, Store, Heart, Palette, Recycle } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { fetchShopProducts, productMatchesCategory, type ShopFetchResult } from '../utils/printify';
import type { ShopProduct } from '../types';
import { IMAGES } from '../utils/media';
import { bones, grid as gridPattern } from '../utils/patterns';

const MotionBox = motion(Box);

const money = (p: ShopProduct) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: p.currency || 'USD' }).format(p.price);

const perks = [
  { icon: Palette, title: 'Original AI + photo art', text: 'Designs made from real street-dog and street-cat photos, restyled into art.' },
  { icon: Recycle, title: 'Print-on-demand', text: 'Nothing is made until you order it — no waste, no stock sitting in boxes.' },
  { icon: Heart, title: 'Proceeds build shelters', text: 'Every order funds insulated bottle shelters and food for the pack.' },
];

const ProductCard: React.FC<{ product: ShopProduct; fallbackStore?: string }> = ({ product, fallbackStore }) => {
  const buyUrl = product.buyUrl || fallbackStore;
  return (
    <MotionBox
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      bg="white"
      borderRadius="3xl"
      boxShadow="lg"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative">
        <AspectRatio ratio={1}>
          <Image
            src={product.image}
            alt={product.title}
            objectFit="cover"
            fallback={<Box w="full" h="full" bgGradient="linear(to-br, brand.100, ocean.100)" />}
          />
        </AspectRatio>
        {product.productType && (
          <Badge position="absolute" top={3} left={3} colorScheme="ocean" borderRadius="full" px={3}>
            {product.productType}
          </Badge>
        )}
        {product.isMock && (
          <Badge position="absolute" top={3} right={3} colorScheme="purple" borderRadius="full" px={3}>
            Example
          </Badge>
        )}
      </Box>
      <Flex direction="column" flex={1} p={5}>
        <Heading size="sm" color="ocean.700" mb={1}>
          {product.title}
        </Heading>
        {product.description && (
          <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3}>
            {product.description}
          </Text>
        )}
        <Flex justify="space-between" align="center" mt="auto" pt={2}>
          <Text fontSize="xl" fontWeight="800" color="brand.600">
            {money(product)}
          </Text>
          <Button
            as={buyUrl ? Link : undefined}
            href={buyUrl}
            isExternal={Boolean(buyUrl)}
            size="sm"
            colorScheme="brand"
            rightIcon={<ExternalLink size={14} />}
            isDisabled={!buyUrl}
          >
            {buyUrl ? 'Buy' : 'Coming soon'}
          </Button>
        </Flex>
      </Flex>
    </MotionBox>
  );
};

export const Shop: React.FC = () => {
  const { shop } = useSiteSettings();
  const [result, setResult] = useState<ShopFetchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchShopProducts(shop).then((r) => {
      if (!cancelled) {
        setResult(r);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [shop]);

  const products = result?.products ?? [];
  const isMock = result?.source === 'mock';

  const categories = useMemo(() => (shop.categories ?? []).filter((c) => c.enabled), [shop.categories]);
  // Only surface categories that actually match at least one product, so tabs
  // for product types you haven't added yet stay hidden until they're relevant.
  const availableCategories = useMemo(
    () => categories.filter((c) => products.some((p) => productMatchesCategory(p, c))),
    [categories, products]
  );

  useEffect(() => {
    if (active !== 'all' && !availableCategories.some((c) => c.id === active)) setActive('all');
  }, [availableCategories, active]);

  const filtered = useMemo(() => {
    if (active === 'all') return products;
    const cat = categories.find((c) => c.id === active);
    return cat ? products.filter((p) => productMatchesCategory(p, cat)) : products;
  }, [active, products, categories]);

  return (
    <Box>
      <PageHero
        eyebrow="Merch for a Cause"
        eyebrowIcon={ShoppingBag}
        title="The Rescue"
        highlight="Shop"
        subtitle="Wear the pack. Every hoodie, mug and print carries art made from our real street rescues — and every sale builds shelters back home in the DR."
        bgImage={IMAGES.heroPack}
        dividerColor="white"
      />

      <Box py={{ base: 12, md: 16 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: bones('#FF6B35', 0.04, 130) }} pointerEvents="none" />
        <Container maxW="container.xl" px={4} position="relative">
          {isMock && (
            <Alert status="info" borderRadius="2xl" mb={8} alignItems="start">
              <AlertIcon />
              <Box>
                <AlertTitle>Showing example products</AlertTitle>
                <AlertDescription fontSize="sm">
                  These mock-ups use our own dog photos as stand-in artwork. Connect a Printify store under{' '}
                  <Link as={RouterLink} to="/admin" fontWeight="700" color="brand.600">
                    Admin → Shop
                  </Link>{' '}
                  to sell your real print-on-demand designs.
                </AlertDescription>
              </Box>
            </Alert>
          )}
          {result?.error && (
            <Alert status="warning" borderRadius="2xl" mb={8}>
              <AlertIcon />
              <AlertDescription fontSize="sm">
                Couldn’t reach the store ({result.error}). Showing the best available list.
              </AlertDescription>
            </Alert>
          )}

          <Flex justify="space-between" align="center" mb={6} gap={4} flexWrap="wrap">
            {/* Category filter chips (only those with matching products) */}
            {availableCategories.length > 0 ? (
              <Wrap spacing={2}>
                <WrapItem>
                  <Button
                    size="sm"
                    borderRadius="full"
                    variant={active === 'all' ? 'solid' : 'outline'}
                    colorScheme="brand"
                    onClick={() => setActive('all')}
                  >
                    All ({products.length})
                  </Button>
                </WrapItem>
                {availableCategories.map((c) => {
                  const count = products.filter((p) => productMatchesCategory(p, c)).length;
                  return (
                    <WrapItem key={c.id}>
                      <Button
                        size="sm"
                        borderRadius="full"
                        variant={active === c.id ? 'solid' : 'outline'}
                        colorScheme="brand"
                        onClick={() => setActive(c.id)}
                      >
                        {c.label} ({count})
                      </Button>
                    </WrapItem>
                  );
                })}
              </Wrap>
            ) : (
              <Box />
            )}
            {shop.storeUrl && (
              <Button as={Link} href={shop.storeUrl} isExternal colorScheme="ocean" leftIcon={<Store size={16} />}>
                Visit full store
              </Button>
            )}
          </Flex>

          {loading ? (
            <Flex justify="center" py={24}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
          ) : filtered.length === 0 ? (
            <Text textAlign="center" color="gray.400" py={20}>
              No products to show yet. Once you publish designs on Printify they’ll appear here automatically.
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} fallbackStore={shop.storeUrl} />
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      {/* Why buy band */}
      <Box bgGradient="linear(to-br, ocean.600, ocean.800)" color="white" py={{ base: 16, md: 20 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: gridPattern('#ffffff', 0.05, 44) }} pointerEvents="none" />
        <Container maxW="container.lg" px={4} position="relative">
          <VStack spacing={12}>
            <SectionHeading
              eyebrow="Why Shop"
              eyebrowColor="whiteAlpha"
              title="Good-looking merch, real-world impact"
              titleColor="white"
            />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
              {perks.map((p, i) => (
                <MotionBox
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  bg="whiteAlpha.100"
                  backdropFilter="blur(6px)"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  borderRadius="2xl"
                  p={7}
                >
                  <Icon as={p.icon} boxSize={7} color="tropical.200" mb={3} />
                  <Heading size="md" mb={2} fontFamily="heading">
                    {p.title}
                  </Heading>
                  <Text opacity={0.85} fontSize="sm">
                    {p.text}
                  </Text>
                </MotionBox>
              ))}
            </SimpleGrid>
            <Button as={RouterLink} to="/donate" size="lg" colorScheme="brand">
              Prefer to donate directly?
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};
