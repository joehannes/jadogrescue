import React, { useMemo, useState } from 'react';
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
  Input,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Progress,
  Avatar,
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Home as HomeIcon,
  PawPrint,
  Droplet,
  DollarSign,
  Trash2,
  Plus,
  Lock,
  LogOut,
  Inbox,
  Search,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import sheltersData from '../data/shelters.json';
import type { Shelter } from '../types';
import { paws, topo } from '../utils/patterns';

const MotionBox = motion(Box);

const DEFAULT_PASSWORD = 'dogrescue';
const PW_KEY = 'jadr_admin_pw';

/** Current admin password — persisted in localStorage, defaulting to 'dogrescue'. */
const getAdminPassword = (): string => {
  try {
    return localStorage.getItem(PW_KEY) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
};

const setAdminPassword = (pw: string): void => {
  try {
    localStorage.setItem(PW_KEY, pw);
  } catch {
    /* ignore storage errors (private mode etc.) */
  }
};

const recentDonations = [
  { name: 'Sarah M.', amount: 50, recurring: true, when: '2h ago' },
  { name: 'Anonymous', amount: 10, recurring: false, when: '5h ago' },
  { name: 'James K.', amount: 100, recurring: true, when: '1d ago' },
  { name: 'Lucia R.', amount: 25, recurring: false, when: '1d ago' },
  { name: 'Comedor La Esperanza', amount: 200, recurring: false, when: '3d ago' },
];

const inquiries = [
  { type: 'Volunteer', name: 'Diego P.', detail: 'Wants to join weekend build days', tag: 'volunteer' },
  { type: 'Partner', name: 'Hotel Riu Bavaro', detail: 'Sponsor shelters around property', tag: 'partner' },
  { type: 'Contact', name: 'Elena V.', detail: 'Found a stray near Punta Cana', tag: 'contact' },
  { type: 'Volunteer', name: 'Marcus T.', detail: 'Offering photography skills', tag: 'volunteer' },
];

const tagColor: Record<string, string> = {
  volunteer: 'ocean',
  partner: 'tropical',
  contact: 'brand',
};

export const Admin: React.FC = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('jadr_admin') === '1');
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);
  const toast = useToast();

  const [shelters, setShelters] = useState<Shelter[]>(sheltersData as Shelter[]);
  const [query, setQuery] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newStatus, setNewStatus] = useState<Shelter['status']>('planned');
  const [newRain, setNewRain] = useState(true);

  // Change-password form state
  const [curPw, setCurPw] = useState('');
  const [nextPw, setNextPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [isDefaultPw, setIsDefaultPw] = useState(() => getAdminPassword() === DEFAULT_PASSWORD);

  const login = () => {
    if (pw === getAdminPassword()) {
      sessionStorage.setItem('jadr_admin', '1');
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const updatePassword = () => {
    if (curPw !== getAdminPassword()) {
      toast({ title: 'Current password is incorrect', status: 'error', duration: 2500 });
      return;
    }
    if (nextPw.length < 6) {
      toast({ title: 'New password must be at least 6 characters', status: 'warning', duration: 2500 });
      return;
    }
    if (nextPw !== confirmPw) {
      toast({ title: 'New passwords do not match', status: 'warning', duration: 2500 });
      return;
    }
    setAdminPassword(nextPw);
    setIsDefaultPw(nextPw === DEFAULT_PASSWORD);
    setCurPw('');
    setNextPw('');
    setConfirmPw('');
    toast({ title: 'Password updated', description: 'Your new admin password is now active.', status: 'success', duration: 3000 });
  };

  const logout = () => {
    sessionStorage.removeItem('jadr_admin');
    setAuthed(false);
    setPw('');
  };

  const stats = useMemo(() => {
    const dogs = shelters.reduce((n, s) => n + s.dogs, 0);
    return {
      shelters: shelters.length,
      dogs,
      bottles: shelters.length * 200,
      raised: recentDonations.reduce((n, d) => n + d.amount, 0),
    };
  }, [shelters]);

  const filtered = shelters.filter(
    (s) =>
      !query ||
      s.location.city.toLowerCase().includes(query.toLowerCase()) ||
      s.location.address.toLowerCase().includes(query.toLowerCase())
  );

  const addShelter = () => {
    if (!newCity.trim() || !newAddress.trim()) {
      toast({ title: 'City and address are required', status: 'warning', duration: 2500 });
      return;
    }
    const shelter: Shelter = {
      id: `shelter-${Date.now()}`,
      location: { lat: 18.5, lng: -70, address: newAddress, city: newCity },
      built: new Date().toISOString().slice(0, 10),
      builder: 'TBD',
      photos: [],
      status: newStatus,
      dogs: 0,
      hasRainwater: newRain,
    };
    setShelters((prev) => [shelter, ...prev]);
    setNewCity('');
    setNewAddress('');
    toast({ title: 'Shelter added (local only)', status: 'success', duration: 2500 });
  };

  const removeShelter = (id: string) => {
    setShelters((prev) => prev.filter((s) => s.id !== id));
    toast({ title: 'Shelter removed', status: 'info', duration: 2000 });
  };

  // ---- Login gate ----------------------------------------------------------
  if (!authed) {
    return (
      <Container maxW="md" py={{ base: 24, md: 32 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card borderRadius="3xl" boxShadow="2xl" overflow="hidden">
            <Box bgGradient="linear(to-r, ocean.600, brand.500)" py={10} textAlign="center" color="white" position="relative" overflow="hidden">
              <Box position="absolute" inset={0} sx={{ backgroundImage: paws('#ffffff', 0.08, 90) }} pointerEvents="none" />
              <Box position="relative">
                <Icon as={Lock} boxSize={10} mb={2} />
                <Heading size="lg" fontFamily="heading">Admin Access</Heading>
                <Text opacity={0.9} mt={1}>Staff dashboard — please sign in</Text>
              </Box>
            </Box>
            <CardBody p={{ base: 6, md: 10 }}>
              <VStack spacing={5}>
                <FormControl isInvalid={pwError}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && login()}
                    placeholder="Enter admin password"
                  />
                  {pwError && (
                    <Text color="coral.500" fontSize="sm" mt={2}>
                      Incorrect password. Try again.
                    </Text>
                  )}
                </FormControl>
                <Button colorScheme="brand" w="full" size="lg" onClick={login} leftIcon={<ShieldCheck size={18} />}>
                  Sign In
                </Button>
                <Text fontSize="xs" color="gray.400" textAlign="center">
                  Default password is <b>dogrescue</b> — you can change it under Settings once signed
                  in. This is a client-side gate for preview only, not real authentication.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </Container>
    );
  }

  // ---- Dashboard -----------------------------------------------------------
  const statCards = [
    { icon: HomeIcon, label: 'Shelters', value: stats.shelters, color: 'brand' },
    { icon: PawPrint, label: 'Dogs Housed', value: stats.dogs, color: 'ocean' },
    { icon: Droplet, label: 'Bottles Reused', value: stats.bottles.toLocaleString(), color: 'tropical' },
    { icon: DollarSign, label: 'Recent Raised', value: `$${stats.raised}`, color: 'coral' },
  ];

  return (
    <Box bg="sand.100" minH="100vh" position="relative">
      <Box position="absolute" inset={0} sx={{ backgroundImage: paws('#004E89', 0.035, 110) }} pointerEvents="none" />
      {/* Top bar */}
      <Box bgGradient="linear(to-r, ocean.700, ocean.900)" color="white" py={6} position="relative" overflow="hidden">
        <Box position="absolute" inset={0} sx={{ backgroundImage: topo('#ffffff', 0.06, 140) }} pointerEvents="none" />
        <Container maxW="container.xl" px={4} position="relative">
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <HStack spacing={3}>
              <Box w={11} h={11} borderRadius="xl" bg="whiteAlpha.200" display="flex" alignItems="center" justifyContent="center">
                <LayoutDashboard size={22} />
              </Box>
              <Box>
                <Heading size="md" fontFamily="heading">Rescue Dashboard</Heading>
                <Text fontSize="sm" opacity={0.8}>John &amp; Abigail — staff view</Text>
              </Box>
            </HStack>
            <Button variant="outline" colorScheme="whiteAlpha" color="white" leftIcon={<LogOut size={16} />} onClick={logout}>
              Sign Out
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" px={4} py={{ base: 8, md: 12 }} position="relative">
        {/* Stat cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5} mb={10}>
          {statCards.map((s, i) => (
            <MotionBox
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              bg="white"
              borderRadius="2xl"
              boxShadow="md"
              p={5}
            >
              <HStack spacing={3} mb={2}>
                <Box w={10} h={10} borderRadius="lg" bg={`${s.color}.50`} color={`${s.color}.500`} display="flex" alignItems="center" justifyContent="center">
                  <Icon as={s.icon} boxSize={5} />
                </Box>
              </HStack>
              <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color={`${s.color}.600`} lineHeight={1}>
                {s.value}
              </Text>
              <Text fontSize="sm" color="gray.500" fontWeight="600">{s.label}</Text>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Tabs colorScheme="brand" variant="soft-rounded">
          <TabList flexWrap="wrap" gap={2} mb={6}>
            <Tab><HStack spacing={2}><HomeIcon size={16} /><Text>Shelters</Text></HStack></Tab>
            <Tab><HStack spacing={2}><DollarSign size={16} /><Text>Donations</Text></HStack></Tab>
            <Tab><HStack spacing={2}><Inbox size={16} /><Text>Inquiries</Text></HStack></Tab>
            <Tab><HStack spacing={2}><ShieldCheck size={16} /><Text>Settings</Text></HStack></Tab>
          </TabList>

          <TabPanels>
            {/* Shelters */}
            <TabPanel px={0}>
              <Card borderRadius="2xl" boxShadow="md" mb={6}>
                <CardBody>
                  <Heading size="sm" mb={4} color="ocean.700">Add a Shelter</Heading>
                  <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} alignItems="end">
                    <FormControl>
                      <FormLabel fontSize="sm">City</FormLabel>
                      <Input value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="City" size="sm" borderRadius="lg" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Address</FormLabel>
                      <Input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Street" size="sm" borderRadius="lg" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Status</FormLabel>
                      <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value as Shelter['status'])} size="sm" borderRadius="lg">
                        <option value="planned">Planned</option>
                        <option value="construction">Construction</option>
                        <option value="active">Active</option>
                      </Select>
                    </FormControl>
                    <HStack justify="space-between">
                      <FormControl display="flex" alignItems="center" gap={2}>
                        <FormLabel fontSize="sm" mb={0}>Rainwater</FormLabel>
                        <Switch isChecked={newRain} onChange={(e) => setNewRain(e.target.checked)} colorScheme="tropical" />
                      </FormControl>
                      <IconButton aria-label="Add shelter" icon={<Plus size={18} />} colorScheme="brand" onClick={addShelter} borderRadius="lg" />
                    </HStack>
                  </SimpleGrid>
                </CardBody>
              </Card>

              <Card borderRadius="2xl" boxShadow="md">
                <CardBody>
                  <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
                    <Heading size="sm" color="ocean.700">All Shelters ({filtered.length})</Heading>
                    <InputGroup maxW="xs" size="sm">
                      <InputLeftElement pointerEvents="none"><Search size={15} color="#A0AEC0" /></InputLeftElement>
                      <Input pl={8} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." borderRadius="lg" />
                    </InputGroup>
                  </Flex>
                  <TableContainer>
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>City</Th>
                          <Th>Address</Th>
                          <Th>Status</Th>
                          <Th isNumeric>Dogs</Th>
                          <Th>Rainwater</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filtered.map((s) => (
                          <Tr key={s.id} _hover={{ bg: 'sand.100' }}>
                            <Td fontWeight="600">{s.location.city}</Td>
                            <Td color="gray.600">{s.location.address}</Td>
                            <Td>
                              <Badge colorScheme={s.status === 'active' ? 'tropical' : s.status === 'construction' ? 'brand' : 'ocean'} textTransform="capitalize">
                                {s.status}
                              </Badge>
                            </Td>
                            <Td isNumeric>{s.dogs}</Td>
                            <Td>{s.hasRainwater ? '💧 Yes' : '—'}</Td>
                            <Td>
                              <IconButton aria-label="Delete" icon={<Trash2 size={15} />} size="xs" colorScheme="red" variant="ghost" onClick={() => removeShelter(s.id)} />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  {filtered.length === 0 && (
                    <Text textAlign="center" color="gray.400" py={8}>No shelters match your search.</Text>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            {/* Donations */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                <Card borderRadius="2xl" boxShadow="md" gridColumn={{ lg: 'span 1' }}>
                  <CardBody>
                    <HStack mb={3}><TrendingUp size={18} color="#FF6B35" /><Heading size="sm" color="ocean.700">Monthly Goal</Heading></HStack>
                    <Text fontSize="3xl" fontWeight="800" color="brand.600">$2,350</Text>
                    <Text color="gray.500" fontSize="sm" mb={3}>of $5,000 goal</Text>
                    <Progress value={47} colorScheme="brand" borderRadius="full" size="sm" />
                    <Text fontSize="xs" color="gray.400" mt={2}>47% — 235 shelters to go</Text>
                  </CardBody>
                </Card>
                <Card borderRadius="2xl" boxShadow="md" gridColumn={{ lg: 'span 2' }}>
                  <CardBody>
                    <Heading size="sm" color="ocean.700" mb={4}>Recent Donations</Heading>
                    <VStack align="stretch" spacing={3}>
                      {recentDonations.map((d, i) => (
                        <Flex key={i} justify="space-between" align="center" p={3} borderRadius="xl" bg="sand.100">
                          <HStack spacing={3}>
                            <Avatar size="sm" name={d.name} bg="ocean.400" color="white" />
                            <Box>
                              <Text fontWeight="600" fontSize="sm">{d.name}</Text>
                              <Text fontSize="xs" color="gray.500">{d.when}{d.recurring ? ' · monthly' : ''}</Text>
                            </Box>
                          </HStack>
                          <HStack>
                            {d.recurring && <Badge colorScheme="tropical">recurring</Badge>}
                            <Text fontWeight="800" color="brand.600">${d.amount}</Text>
                          </HStack>
                        </Flex>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>

            {/* Inquiries */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                {inquiries.map((q, i) => (
                  <Card key={i} borderRadius="2xl" boxShadow="md" _hover={{ boxShadow: 'lg' }} transition="all 0.2s">
                    <CardBody>
                      <Flex justify="space-between" align="start">
                        <HStack spacing={3} align="start">
                          <Avatar size="sm" name={q.name} bg={`${tagColor[q.tag]}.400`} color="white" />
                          <Box>
                            <Text fontWeight="700">{q.name}</Text>
                            <Text fontSize="sm" color="gray.600">{q.detail}</Text>
                          </Box>
                        </HStack>
                        <Badge colorScheme={tagColor[q.tag]}>{q.type}</Badge>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>

            {/* Settings */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card borderRadius="2xl" boxShadow="md">
                  <CardBody>
                    <HStack mb={1} spacing={2}>
                      <Lock size={18} color="#004E89" />
                      <Heading size="sm" color="ocean.700">Change Admin Password</Heading>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" mb={5}>
                      Update the password used to sign in to this dashboard. Stored locally in your browser.
                    </Text>

                    {isDefaultPw && (
                      <HStack mb={4} p={3} borderRadius="xl" bg="coral.50" color="coral.700" fontSize="sm" spacing={2}>
                        <ShieldCheck size={16} />
                        <Text>You're still using the default password. Set your own below.</Text>
                      </HStack>
                    )}

                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel fontSize="sm">Current password</FormLabel>
                        <Input
                          type="password"
                          value={curPw}
                          onChange={(e) => setCurPw(e.target.value)}
                          placeholder="Current password"
                          size="sm"
                          borderRadius="lg"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">New password</FormLabel>
                        <Input
                          type="password"
                          value={nextPw}
                          onChange={(e) => setNextPw(e.target.value)}
                          placeholder="At least 6 characters"
                          size="sm"
                          borderRadius="lg"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Confirm new password</FormLabel>
                        <Input
                          type="password"
                          value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && updatePassword()}
                          placeholder="Re-enter new password"
                          size="sm"
                          borderRadius="lg"
                        />
                      </FormControl>
                      <Button colorScheme="brand" leftIcon={<Lock size={16} />} onClick={updatePassword} alignSelf="flex-start">
                        Update Password
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                <Card borderRadius="2xl" boxShadow="md">
                  <CardBody>
                    <HStack mb={1} spacing={2}>
                      <ShieldCheck size={18} color="#1A936F" />
                      <Heading size="sm" color="ocean.700">Session</Heading>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" mb={5}>
                      This dashboard uses a client-side gate for preview purposes only — it is not
                      real authentication and should not protect sensitive data.
                    </Text>
                    <VStack align="stretch" spacing={3}>
                      <Flex justify="space-between" p={3} borderRadius="xl" bg="sand.100">
                        <Text fontSize="sm" fontWeight="600">Password status</Text>
                        <Badge colorScheme={isDefaultPw ? 'coral' : 'tropical'}>
                          {isDefaultPw ? 'Default' : 'Customized'}
                        </Badge>
                      </Flex>
                      <Button variant="outline" colorScheme="ocean" leftIcon={<LogOut size={16} />} onClick={logout}>
                        Sign Out
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};
