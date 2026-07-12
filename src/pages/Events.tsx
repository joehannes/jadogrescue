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
  Icon,
  Flex,
  Switch,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Spinner,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Clock,
  ExternalLink,
  CalendarPlus,
  Rss,
  Info,
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { EventCalendar } from '../components/EventCalendar';
import { useSiteSettings } from '../hooks/useSiteSettings';
import {
  fetchGoogleEvents,
  mockEvents,
  subscribeGoogleUrl,
  subscribeIcalUrl,
} from '../utils/calendar';
import type { CalendarEvent } from '../types';
import { IMAGES } from '../utils/media';
import { topo, dots } from '../utils/patterns';

const MotionBox = motion(Box);

const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

const EventRow: React.FC<{ event: CalendarEvent }> = ({ event }) => (
  <Flex
    gap={3}
    p={4}
    borderRadius="2xl"
    bg="white"
    boxShadow="sm"
    borderLeftWidth="4px"
    borderLeftColor={event.color}
    align="stretch"
  >
    <VStack spacing={0} minW="52px" align="center" justify="center" color="ocean.700">
      <Text fontSize="2xl" fontWeight="800" lineHeight={1} fontFamily="heading">
        {new Date(event.start).getDate()}
      </Text>
      <Text fontSize="xs" textTransform="uppercase" fontWeight="700" color="gray.400">
        {new Date(event.start).toLocaleDateString([], { month: 'short' })}
      </Text>
    </VStack>
    <Box flex={1}>
      <HStack mb={1} flexWrap="wrap" spacing={2}>
        <Text fontWeight="700" color="gray.800">
          {event.title}
        </Text>
        {event.isMock && (
          <Badge colorScheme="purple" fontSize="10px">
            Example
          </Badge>
        )}
      </HStack>
      <HStack spacing={4} color="gray.500" fontSize="sm" flexWrap="wrap">
        <HStack spacing={1}>
          <Clock size={13} />
          <Text>{event.allDay ? 'All day' : `${fmtTime(event.start)}${event.end ? `–${fmtTime(event.end)}` : ''}`}</Text>
        </HStack>
        {event.location && (
          <HStack spacing={1}>
            <MapPin size={13} />
            <Text noOfLines={1}>{event.location}</Text>
          </HStack>
        )}
      </HStack>
      {event.description && (
        <Text fontSize="sm" color="gray.600" mt={2} noOfLines={2}>
          {event.description}
        </Text>
      )}
      {event.url && (
        <Link href={event.url} isExternal color="brand.500" fontSize="sm" fontWeight="600" mt={2} display="inline-flex" alignItems="center" gap={1}>
          Details <ExternalLink size={12} />
        </Link>
      )}
    </Box>
  </Flex>
);

export const Events: React.FC = () => {
  const { calendars, googleApiKey } = useSiteSettings();
  const [month, setMonth] = useState(() => firstOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [usingMock, setUsingMock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(
    () => new Set(calendars.filter((c) => !c.enabled).map((c) => c.id))
  );

  const liveSources = useMemo(
    () => calendars.filter((c) => c.calendarId.trim() && googleApiKey.trim()),
    [calendars, googleApiKey]
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // No configured Google calendars → show built-in example events.
      if (liveSources.length === 0) {
        setEvents(mockEvents(month));
        setUsingMock(true);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      const timeMin = new Date(month.getFullYear(), month.getMonth(), -7);
      const timeMax = new Date(month.getFullYear(), month.getMonth() + 1, 7);
      try {
        const results = await Promise.all(
          liveSources.map((s) => fetchGoogleEvents(s, googleApiKey, timeMin, timeMax))
        );
        if (cancelled) return;
        setEvents(results.flat());
        setUsingMock(false);
      } catch (err) {
        if (cancelled) return;
        setEvents(mockEvents(month));
        setUsingMock(true);
        setError(err instanceof Error ? err.message : 'Could not load Google Calendar; showing examples.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [liveSources, googleApiKey, month]);

  const visibleEvents = useMemo(() => events.filter((e) => !hidden.has(e.sourceId)), [events, hidden]);

  const dayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return visibleEvents
      .filter((e) => sameDay(new Date(e.start), selectedDate))
      .sort((a, b) => +new Date(a.start) - +new Date(b.start));
  }, [visibleEvents, selectedDate]);

  const upcoming = useMemo(() => {
    const now = new Date();
    return visibleEvents
      .filter((e) => new Date(e.end || e.start) >= now)
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .slice(0, 6);
  }, [visibleEvents]);

  const toggleSource = (id: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const publicCals = calendars.filter((c) => c.isPublic);

  return (
    <Box>
      <PageHero
        eyebrow="What's On"
        eyebrowIcon={CalendarDays}
        title="Events"
        highlight="& Build Days"
        subtitle="Build days, free spay/neuter clinics, adoption meet-ups and fundraisers — see what's coming up and subscribe so it lands straight in your own calendar."
        bgImage={IMAGES.heroWorkshop}
        dividerColor="sand.100"
      />

      <Box bg="sand.100" py={{ base: 12, md: 16 }} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: topo('#004E89', 0.04, 150) }} pointerEvents="none" />
        <Container maxW="container.xl" px={4} position="relative">
          {usingMock && (
            <Alert status="info" borderRadius="2xl" mb={6} alignItems="start">
              <AlertIcon as={Info} />
              <Box>
                <AlertTitle>Showing example events</AlertTitle>
                <AlertDescription fontSize="sm">
                  These are illustrative mock-ups. Connect a public Google Calendar under{' '}
                  <Link as={RouterLink} to="/admin" fontWeight="700" color="brand.600">Admin → Calendars</Link>{' '}
                  and anything you add to that Google calendar will appear here automatically.
                </AlertDescription>
              </Box>
            </Alert>
          )}
          {error && !usingMock && (
            <Alert status="warning" borderRadius="2xl" mb={6}>
              <AlertIcon />
              <AlertDescription fontSize="sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Legend + subscribe */}
          <Card borderRadius="2xl" boxShadow="md" mb={6}>
            <CardBody>
              <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                <HStack spacing={5} flexWrap="wrap">
                  {calendars.map((c) => (
                    <HStack key={c.id} spacing={2}>
                      <Switch
                        isChecked={!hidden.has(c.id)}
                        onChange={() => toggleSource(c.id)}
                        sx={{ '--switch-bg': c.color }}
                        colorScheme="brand"
                        size="sm"
                      />
                      <Box w={3} h={3} borderRadius="full" bg={c.color} />
                      <Text fontSize="sm" fontWeight="600" color="gray.700">
                        {c.name}
                      </Text>
                    </HStack>
                  ))}
                </HStack>
                {loading && <Spinner size="sm" color="brand.500" />}
              </Flex>

              {publicCals.length > 0 && (
                <>
                  <Divider my={4} />
                  <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
                    <HStack spacing={2} color="gray.600">
                      <Rss size={16} />
                      <Text fontSize="sm" fontWeight="600">
                        Subscribe to our public calendar
                      </Text>
                    </HStack>
                    <HStack spacing={2} flexWrap="wrap">
                      {publicCals.map((c) => {
                        const ready = Boolean(c.calendarId.trim());
                        return (
                          <HStack key={c.id} spacing={2}>
                            <Tooltip
                              label={ready ? '' : 'Owner: add this calendar’s Google ID in Admin to enable subscribing'}
                              isDisabled={ready}
                            >
                              <Button
                                as={ready ? Link : undefined}
                                href={ready ? subscribeGoogleUrl(c.calendarId) : undefined}
                                isExternal={ready}
                                size="sm"
                                colorScheme="brand"
                                leftIcon={<CalendarPlus size={15} />}
                                isDisabled={!ready}
                              >
                                Add to Google
                              </Button>
                            </Tooltip>
                            {ready && (
                              <Button
                                as={Link}
                                href={subscribeIcalUrl(c.calendarId)}
                                isExternal
                                size="sm"
                                variant="outline"
                                colorScheme="ocean"
                                leftIcon={<Rss size={14} />}
                              >
                                iCal
                              </Button>
                            )}
                          </HStack>
                        );
                      })}
                    </HStack>
                  </Flex>
                </>
              )}
            </CardBody>
          </Card>

          {/* Calendar + side list */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} alignItems="start">
            <Box gridColumn={{ lg: 'span 2' }}>
              <EventCalendar
                month={month}
                events={visibleEvents}
                selectedDate={selectedDate}
                onSelectDate={(d) => setSelectedDate(d)}
                onPrevMonth={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                onNextMonth={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                onToday={() => {
                  setMonth(firstOfMonth(new Date()));
                  setSelectedDate(new Date());
                }}
              />
            </Box>

            <Card borderRadius="3xl" boxShadow="xl" position="relative" overflow="hidden">
              <Box position="absolute" inset={0} sx={{ backgroundImage: dots('#004E89', 0.04, 22) }} pointerEvents="none" />
              <CardBody position="relative">
                <Heading size="sm" color="ocean.700" mb={4}>
                  {selectedDate
                    ? `Events on ${selectedDate.toLocaleDateString([], { month: 'long', day: 'numeric' })}`
                    : 'Upcoming events'}
                </Heading>
                <VStack align="stretch" spacing={3}>
                  {(selectedDate ? dayEvents : upcoming).map((e) => (
                    <EventRow key={e.id} event={e} />
                  ))}
                  {(selectedDate ? dayEvents : upcoming).length === 0 && (
                    <Text color="gray.400" fontSize="sm" py={6} textAlign="center">
                      {selectedDate ? 'Nothing scheduled this day.' : 'No upcoming events right now.'}
                    </Text>
                  )}
                  {selectedDate && (
                    <Button variant="ghost" size="sm" colorScheme="ocean" onClick={() => setSelectedDate(null)}>
                      Show all upcoming
                    </Button>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA */}
      <Box py={{ base: 14, md: 20 }}>
        <Container maxW="container.md" px={4}>
          <SectionHeading
            eyebrow="Get Involved"
            title="Want to host or join an event?"
            subtitle="Whether you can lend an afternoon to a build day or want to organise a fundraiser in your community, we'd love to hear from you."
          />
          <HStack justify="center" mt={8} spacing={4} flexWrap="wrap">
            <Button as={RouterLink} to="/volunteer" colorScheme="brand" size="lg">
              Volunteer with us
            </Button>
            <Button as={RouterLink} to="/contact" variant="outline" colorScheme="ocean" size="lg">
              Get in touch
            </Button>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};
