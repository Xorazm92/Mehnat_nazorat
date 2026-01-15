import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  useColorModeValue,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
      toast({
        title: 'Muvaffaqiyatli kirish',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Kirish xatosi',
        description: 'Login yoki parol noto\'g\'ri',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-r, blue.400, purple.500)" display="flex" alignItems="center">
      <Container maxW="sm">
        <Card bg={cardBg}>
          <CardHeader textAlign="center">
            <Heading size="lg">🛡️ Nazoratchi</Heading>
            <Text fontSize="sm" color="gray.600" mt={2}>
              Sanoat Xavfsizligi Inspeksiyasi
            </Text>
          </CardHeader>
          <Divider />
          <CardBody>
            <form onSubmit={handleLogin}>
              <VStack spacing={6}>
                <VStack spacing={2} w="full">
                  <Text fontWeight="bold" alignSelf="start" fontSize="sm">
                    Username
                  </Text>
                  <Input
                    placeholder="Username kiriting"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isDisabled={loading}
                  />
                </VStack>

                <VStack spacing={2} w="full">
                  <Text fontWeight="bold" alignSelf="start" fontSize="sm">
                    Parol
                  </Text>
                  <Input
                    placeholder="Parol kiriting"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isDisabled={loading}
                  />
                </VStack>

                <Button
                  type="submit"
                  colorScheme="blue"
                  w="full"
                  isLoading={loading}
                  loadingText="Kirilmoqda..."
                >
                  Kirish
                </Button>

                <HStack fontSize="xs" color="gray.600" justify="center">
                  <Text>Test hisob:</Text>
                  <Text fontWeight="bold">admin / password</Text>
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};
