import React from 'react';
import {
  Box,
  Container,
  HStack,
  Text,
  Button,
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Progress,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

export const InventoryPage = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const alertBg = useColorModeValue('orange.50', 'orange.900');

  const inventoryItems = [
    {
      id: '1',
      name: 'Xavfsizlik dubulg\'asi',
      code: 'HELMET-001',
      total: 100,
      issued: 75,
      damaged: 5,
      available: 20,
      expiry: '2025-12-31',
    },
    {
      id: '2',
      name: 'Qaytariluvchi ko\'ylak',
      code: 'VEST-001',
      total: 150,
      issued: 120,
      damaged: 3,
      available: 27,
      expiry: '2025-06-30',
    },
    {
      id: '3',
      name: 'Talon (Respirator)',
      code: 'RESPIRATOR-001',
      total: 300,
      issued: 250,
      damaged: 0,
      available: 50,
      expiry: '2024-06-30',
    },
  ];

  const inventoryStatus = {
    total_items: 550,
    in_stock: 97,
    issued_out: 445,
    damaged: 8,
    expiring_soon: 2,
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Box bg={useColorModeValue('white', 'gray.800')} borderBottom="1px" borderColor="gray.200">
        <Container maxW="6xl" py={6}>
          <HStack justify="space-between">
            <Heading size="lg">📦 Talon va Maxsus Kiyim Boshqaruvi</Heading>
            <HStack>
              <Button leftIcon={<AddIcon />} colorScheme="green">
                Berish
              </Button>
              <Button leftIcon={<AddIcon />} colorScheme="blue">
                Qaytarish
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Statistics */}
      <Container maxW="6xl" py={6}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Jami Predmetlar</StatLabel>
                <StatNumber fontSize="3xl">{inventoryStatus.total_items}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Saqlanib Turgan</StatLabel>
                <StatNumber fontSize="3xl">{inventoryStatus.in_stock}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Berilgan</StatLabel>
                <StatNumber fontSize="3xl">{inventoryStatus.issued_out}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Shikastlangan</StatLabel>
                <StatNumber fontSize="3xl">{inventoryStatus.damaged}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Expiring Soon Alert */}
        {inventoryStatus.expiring_soon > 0 && (
          <Card bg={alertBg} mb={6}>
            <CardBody>
              <HStack>
                <Text fontWeight="bold">⚠️ Eskirayotgan Predmetlar:</Text>
                <Text>{inventoryStatus.expiring_soon} ta predmet 30 kun ichida eskiraydi</Text>
              </HStack>
            </CardBody>
          </Card>
        )}

        {/* Inventory Items Table */}
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Inventar Ro'yxati</Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Nomi</Th>
                    <Th>Kod</Th>
                    <Th isNumeric>Jami</Th>
                    <Th isNumeric>Berilgan</Th>
                    <Th isNumeric>Mavjud</Th>
                    <Th isNumeric>Shikastlangan</Th>
                    <Th>Eskirish Muddati</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inventoryItems.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.name}</Td>
                      <Td>{item.code}</Td>
                      <Td isNumeric>{item.total}</Td>
                      <Td isNumeric>{item.issued}</Td>
                      <Td isNumeric>
                        <Box>
                          <Text>{item.available}</Text>
                          <Progress
                            value={(item.available / item.total) * 100}
                            size="xs"
                            colorScheme={item.available < 20 ? 'red' : 'green'}
                          />
                        </Box>
                      </Td>
                      <Td isNumeric>{item.damaged}</Td>
                      <Td>
                        <Badge colorScheme={item.expiry < '2024-06-30' ? 'red' : 'green'}>
                          {item.expiry}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};
