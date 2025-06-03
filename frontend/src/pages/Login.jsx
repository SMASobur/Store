import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { Button, Input, Box, Text, VStack } from "@chakra-ui/react";
import { CiLogin } from "react-icons/ci";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <Box maxW="md" mx="auto" p={6}>
      {message && (
        <Text color="red.500" mb={4}>
          {message}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            Login
          </Text>
          {err && <Text color="red.500">{err}</Text>}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            focusBorderColor="blue.500"
            fontSize="lg"
            py={5}
            borderRadius="md"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            focusBorderColor="blue.500"
            fontSize="lg"
            py={5}
            borderRadius="md"
          />
          <Button
            colorScheme="blue"
            type="submit"
            leftIcon={<CiLogin size={20} />}
          >
            Login
          </Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        Don&apos;t have an account?{" "}
        <RouterLink to="/register">
          <Text
            as="span"
            color="blue.600"
            textDecoration="underline"
            cursor="pointer"
          >
            Register here
          </Text>
        </RouterLink>
      </Text>
    </Box>
  );
}
