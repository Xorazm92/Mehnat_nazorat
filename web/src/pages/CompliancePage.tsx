import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Badge,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, WarningIcon } from '@chakra-ui/icons';

export const CompliancePage = () => {
  const cardBg = useColorModeValue('white', 'gray.800');

  const complianceItems = [
    {
      id: '1',
      article: 'Art. 1',
      requirement: 'Hayot va sog\'lig\'ini muhofaza qilish choralari',
      status: 'COMPLIANT',
      checked_by: 'A.Raximboyev',
      checked_at: '2024-01-15',
    },
    {
      id: '2',
      article: 'Art. 2',
      requirement: 'Mehnat muhofazasi normativlarining bajarilishi',
      status: 'NON_COMPLIANT',
      checked_by: 'N.Karimov',
      checked_at: '2024-01-14',
    },
    {
      id: '3',
      article: 'Art. 3',
      requirement: 'Profilaktika chora-tadbirlarini o\'z vaqtida bajarish',
      status: 'PARTIAL_COMPLIANCE',
      checked_by: 'D.Eshonov',
      checked_at: '2024-01-13',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircleIcon color="green.500" />;
      case 'NON_COMPLIANT':
        return <CloseIcon color="red.500" />;
      case 'PARTIAL_COMPLIANCE':
        return <WarningIcon color="orange.500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'green';
      case 'NON_COMPLIANT':
        return 'red';
      case 'PARTIAL_COMPLIANCE':
        return 'orange';
      default:
        return 'blue';
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Box bg={useColorModeValue('white', 'gray.800')} borderBottom="1px" borderColor="gray.200">
        <Container maxW="6xl" py={6}>
          <Heading size="lg">✅ Normativ Talablar Moslikni Tekshirish</Heading>
        </Container>
      </Box>

      {/* Statistics */}
      <Container maxW="6xl" py={6}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Jami Talablar</StatLabel>
                <StatNumber fontSize="3xl">8</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Moslik</StatLabel>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" w={8} h={8} />
                  <StatNumber fontSize="3xl">5</StatNumber>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Qisman Moslik</StatLabel>
                <HStack>
                  <Icon as={WarningIcon} color="orange.500" w={8} h={8} />
                  <StatNumber fontSize="3xl">2</StatNumber>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Moslik Darajasi</StatLabel>
                <StatNumber fontSize="3xl">87.5%</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Compliance Items */}
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Normativ Talablar Tekshirish Ro'yxati</Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <VStack spacing={4} align="start">
              {complianceItems.map((item) => (
                <Box key={item.id} w="full" p={4} border="1px" borderColor="gray.200" borderRadius="md">
                  <HStack justify="space-between" mb={2}>
                    <VStack align="start" spacing={0}>
                      <HStack>
                        {getStatusIcon(item.status)}
                        <Text fontWeight="bold">{item.article}</Text>
                        <Badge colorScheme={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm">{item.requirement}</Text>
                    </VStack>
                  </HStack>
                  <HStack justify="space-between" fontSize="xs" color="gray.600">
                    <Text>Tekshirdi: {item.checked_by}</Text>
                    <Text>{item.checked_at}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};
