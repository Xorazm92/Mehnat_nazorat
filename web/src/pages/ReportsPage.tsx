import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

export const ReportsPage = () => {
  const cardBg = useColorModeValue('white', 'gray.800');

  const reports = [
    {
      id: '1',
      name: 'Januar aylik hisobot',
      organization: 'Qo\'qon MTU',
      date: '2024-01-31',
      status: 'COMPLETED',
    },
    {
      id: '2',
      name: 'Xavfsizlik inspeksiyasi hisobot',
      organization: 'Temiryo\'l Kargo',
      date: '2024-01-25',
      status: 'PENDING',
    },
  ];

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Box bg={useColorModeValue('white', 'gray.800')} borderBottom="1px" borderColor="gray.200">
        <Container maxW="6xl" py={6}>
          <Heading size="lg">📄 Hisobotlar va Tahlillar</Heading>
        </Container>
      </Box>

      <Container maxW="6xl" py={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {reports.map((report) => (
            <Card key={report.id} bg={cardBg}>
              <CardHeader>
                <VStack align="start" spacing={2}>
                  <Heading size="md">{report.name}</Heading>
                  <Text fontSize="sm" color="gray.600">
                    {report.organization}
                  </Text>
                </VStack>
              </CardHeader>
              <Divider />
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Text>{report.date}</Text>
                  <HStack>
                    <Button leftIcon={<DownloadIcon />} colorScheme="blue">
                      PDF Yuklab olish
                    </Button>
                    <Button leftIcon={<DownloadIcon />} colorScheme="green">
                      Excel Yuklab olish
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
