import React, { useMemo } from 'react';
import { Box, Flex, Grid, GridItem, HStack, IconButton, Text, Heading, Button } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent } from '../types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const sameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b);

interface EventCalendarProps {
  /** First day of the visible month. */
  month: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

/** Lightweight month-grid calendar (Sunday-first) with colored event chips. */
export const EventCalendar: React.FC<EventCalendarProps> = ({
  month,
  events,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const today = new Date();

  // Group events by local day key for O(1) lookup while rendering cells.
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const d = new Date(e.start);
      const key = dayKey(d);
      const arr = map.get(key);
      if (arr) arr.push(e);
      else map.set(key, [e]);
    }
    for (const arr of map.values()) arr.sort((a, b) => +new Date(a.start) - +new Date(b.start));
    return map;
  }, [events]);

  // Build the 6-row grid starting on the Sunday on/before the 1st.
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [month]);

  return (
    <Box bg="white" borderRadius="3xl" boxShadow="xl" overflow="hidden">
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        py={4}
        bgGradient="linear(to-r, ocean.600, ocean.700)"
        color="white"
        flexWrap="wrap"
        gap={2}
      >
        <Heading size="md" fontFamily="heading">
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </Heading>
        <HStack spacing={2}>
          <Button size="sm" variant="outline" colorScheme="whiteAlpha" color="white" onClick={onToday}>
            Today
          </Button>
          <IconButton
            aria-label="Previous month"
            icon={<ChevronLeft size={18} />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.300' }}
            onClick={onPrevMonth}
          />
          <IconButton
            aria-label="Next month"
            icon={<ChevronRight size={18} />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.300' }}
            onClick={onNextMonth}
          />
        </HStack>
      </Flex>

      {/* Weekday labels */}
      <Grid templateColumns="repeat(7, 1fr)" px={{ base: 1, md: 2 }} pt={3}>
        {WEEKDAYS.map((w) => (
          <GridItem key={w} textAlign="center" pb={2}>
            <Text fontSize="xs" fontWeight="700" color="gray.400" letterSpacing="wide">
              {w}
            </Text>
          </GridItem>
        ))}
      </Grid>

      {/* Day cells */}
      <Grid templateColumns="repeat(7, 1fr)" gap={{ base: 0.5, md: 1 }} px={{ base: 1, md: 2 }} pb={{ base: 2, md: 3 }}>
        {cells.map((d) => {
          const inMonth = d.getMonth() === month.getMonth();
          const isToday = sameDay(d, today);
          const isSelected = selectedDate && sameDay(d, selectedDate);
          const dayEvents = eventsByDay.get(dayKey(d)) ?? [];
          return (
            <GridItem
              key={dayKey(d)}
              as="button"
              onClick={() => onSelectDate(d)}
              textAlign="left"
              minH={{ base: '58px', md: '92px' }}
              p={{ base: 1, md: 1.5 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={isSelected ? 'brand.400' : 'transparent'}
              bg={isSelected ? 'brand.50' : inMonth ? 'transparent' : 'blackAlpha.50'}
              opacity={inMonth ? 1 : 0.55}
              transition="all 0.15s"
              _hover={{ bg: isSelected ? 'brand.50' : 'sand.100' }}
              position="relative"
            >
              <Flex justify="space-between" align="center" mb={1}>
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w={6}
                  h={6}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight={isToday ? '800' : '600'}
                  bg={isToday ? 'brand.500' : 'transparent'}
                  color={isToday ? 'white' : inMonth ? 'gray.700' : 'gray.400'}
                >
                  {d.getDate()}
                </Box>
                {dayEvents.length > 0 && (
                  <HStack spacing={0.5} display={{ base: 'flex', md: 'none' }}>
                    {dayEvents.slice(0, 3).map((e) => (
                      <Box key={e.id} w={1.5} h={1.5} borderRadius="full" bg={e.color} />
                    ))}
                  </HStack>
                )}
              </Flex>

              {/* Event chips (desktop) */}
              <Box display={{ base: 'none', md: 'block' }}>
                {dayEvents.slice(0, 2).map((e) => (
                  <Flex
                    key={e.id}
                    align="center"
                    gap={1}
                    mb={0.5}
                    px={1.5}
                    py={0.5}
                    borderRadius="md"
                    bg={`${e.color}22`}
                  >
                    <Box w={1.5} h={1.5} borderRadius="full" bg={e.color} flexShrink={0} />
                    <Text fontSize="10px" fontWeight="600" color="gray.700" noOfLines={1}>
                      {e.title}
                    </Text>
                  </Flex>
                ))}
                {dayEvents.length > 2 && (
                  <Text fontSize="10px" color="gray.500" fontWeight="600" pl={1.5}>
                    +{dayEvents.length - 2} more
                  </Text>
                )}
              </Box>
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
};
