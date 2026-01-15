import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  WarningIcon,
  TimeIcon,
  CalendarIcon,
} from '@chakra-ui/icons';

export const DashboardPage = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)',
  );

  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Box bgGradient={bgGradient} color="white" py={8}>
        <Container maxW="6xl">
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={2}>
              <Heading size="xl">Nazoratchi Dashboard</Heading>
              <Text fontSize="sm">Sanoat Xavfsizligi Inspeksiyasi Tizimi</Text>
            </VStack>
            <HStack>
              <Button colorScheme="whiteAlpha" variant="outline">
                Profil
              </Button>
              <Button colorScheme="whiteAlpha" variant="outline">
                Chiqish
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="6xl" py={8}>
        {/* KPI Cards */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Jami Vazifalar</StatLabel>
                <StatNumber fontSize="3xl">24</StatNumber>
                <StatHelpText>Bu oyda</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Bajarilgan</StatLabel>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" w={8} h={8} />
                  <StatNumber fontSize="3xl">18</StatNumber>
                </HStack>
                <StatHelpText>75% bajarilish darajasi</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Muddati Tug'agan</StatLabel>
                <HStack>
                  <Icon as={WarningIcon} color="red.500" w={8} h={8} />
                  <StatNumber fontSize="3xl">3</StatNumber>
                </HStack>
                <StatHelpText>Darhol bajarish kerak</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Moslik Darajasi</StatLabel>
                <StatNumber fontSize="3xl">87%</StatNumber>
                <StatHelpText>Normativ talablarga moslik</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Overdue Tasks */}
        <Card bg={cardBg} mb={8}>
          <CardHeader>
            <Heading size="md">🔴 Muddati Tug'agan Vazifalar</Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <VStack align="start" spacing={4}>
              <Box w="full" p={4} bg={useColorModeValue('red.50', 'red.900')}>
                <HStack justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Xavfsizlik inspeksiyasi</Text>
                    <Text fontSize="sm">Muddati: 2024-01-10</Text>
                  </VStack>
                  <Badge colorScheme="red">Muddati Tugagan</Badge>
                </HStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Monthly Progress */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Oylik Bajarilish Grafigi</Heading>
            </CardHeader>
            <Divider />
            <CardBody>
              <VStack spacing={4} align="start" w="full">
                <Box w="full">
                  <HStack justify="space-between" mb={2}>
                    <Text>Reja mo'yud: 20/24</Text>
                    <Text fontWeight="bold">83%</Text>
                  </HStack>
                  <Progress value={83} colorScheme="blue" />
                </Box>

                <Box w="full">
                  <HStack justify="space-between" mb={2}>
                    <Text>Xavfsizlik auditi: 5/5</Text>
                    <Text fontWeight="bold">100%</Text>
                  </HStack>
                  <Progress value={100} colorScheme="green" />
                </Box>

                <Box w="full">
                  <HStack justify="space-between" mb={2}>
                    <Text>Hisobotlar topshirildi: 3/4</Text>
                    <Text fontWeight="bold">75%</Text>
                  </HStack>
                  <Progress value={75} colorScheme="orange" />
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Yaqinda Keladigan Muddatlar</Heading>
            </CardHeader>
            <Divider />
            <CardBody>
              <VStack align="start" spacing={3} w="full">
                <HStack w="full" justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Kuz-qish tayyorgarligi</Text>
                    <Text fontSize="sm" color="gray.600">
                      3 kun qoldi
                    </Text>
                  </VStack>
                  <Icon as={CalendarIcon} color="orange.500" />
                </HStack>

                <HStack w="full" justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Oylik hisobot</Text>
                    <Text fontSize="sm" color="gray.600">
                      5 kun qoldi
                    </Text>
                  </VStack>
                  <Icon as={TimeIcon} color="blue.500" />
                </HStack>

                <HStack w="full" justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Xavfsizlik kundazbasi</Text>
                    <Text fontSize="sm" color="gray.600">
                      10 kun qoldi
                    </Text>
                  </VStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
