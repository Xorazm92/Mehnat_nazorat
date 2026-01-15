import React, { useState } from 'react';
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
  Badge,
  useColorModeValue,
  Select,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

export const PlansPage = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [plans] = useState([
    {
      id: '1',
      organization: 'Qo\'qon MTU',
      month: 'Januar',
      status: 'APPROVED',
      items: 24,
      completed: 18,
    },
    {
      id: '2',
      organization: 'Temiryo\'l Kargo',
      month: 'Januar',
      status: 'PENDING',
      items: 20,
      completed: 12,
    },
  ]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'green';
      case 'PENDING':
        return 'yellow';
      case 'REJECTED':
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Box bg={useColorModeValue('white', 'gray.800')} borderBottom="1px" borderColor="gray.200">
        <Container maxW="6xl" py={6}>
          <HStack justify="space-between">
            <Heading size="lg">📋 Reja Boshqaruvi</Heading>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
              Yangi Reja Yaratish
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Filters */}
      <Container maxW="6xl" py={6}>
        <Card bg={cardBg} mb={6}>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>Tashkilot</Text>
                <Select placeholder="Tashkilot tanlang">
                  <option>Qo'qon MTU</option>
                  <option>Temiryo'l Kargo</option>
                  <option>O'zvagonta'mir</option>
                </Select>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>Oy</Text>
                <Select placeholder="Oy tanlang">
                  <option>Januar</option>
                  <option>Fevral</option>
                  <option>Mart</option>
                </Select>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>Status</Text>
                <Select placeholder="Status tanlang">
                  <option>APPROVED</option>
                  <option>PENDING</option>
                  <option>REJECTED</option>
                </Select>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Plans Table */}
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Rejalar</Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Tashkilot</Th>
                    <Th>Oy</Th>
                    <Th>Status</Th>
                    <Th isNumeric>Bajarilgan</Th>
                    <Th>Harakatlar</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {plans.map((plan) => (
                    <Tr key={plan.id}>
                      <Td>{plan.organization}</Td>
                      <Td>{plan.month}</Td>
                      <Td>
                        <Badge colorScheme={statusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                      </Td>
                      <Td isNumeric>
                        {plan.completed}/{plan.items}
                      </Td>
                      <Td>
                        <HStack>
                          <Button size="sm" leftIcon={<EditIcon />}>
                            Ko'rish
                          </Button>
                          <Button size="sm" leftIcon={<DeleteIcon />} colorScheme="red">
                            O'chirish
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Container>

      {/* Create Plan Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yangi Reja Yaratish</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="full">
                <Text fontWeight="bold" mb={2}>Tashkilot</Text>
                <Select placeholder="Tashkilot tanlang">
                  <option>Qo'qon MTU</option>
                  <option>Temiryo'l Kargo</option>
                </Select>
              </Box>
              <Box w="full">
                <Text fontWeight="bold" mb={2}>Oy</Text>
                <Select placeholder="Oy tanlang">
                  <option>Januar</option>
                  <option>Fevral</option>
                </Select>
              </Box>
              <Button colorScheme="blue" w="full">
                Yaratish
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
