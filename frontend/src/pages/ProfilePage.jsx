import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
} from "@chakra-ui/react";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setName(data.name);
      setEmail(data.email);
    };

    fetchProfile();
  }, []);

  const updateName = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    toast({
      title: data.message,
      status: res.ok ? "success" : "error",
      duration: 3000,
    });
  };

  const changePass = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/auth/me/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    toast({
      title: data.message,
      status: res.ok ? "success" : "error",
      duration: 3000,
    });
  };

  return (
    <Box maxW="lg" mx="auto" mt={10} p={5} shadow="md" borderRadius="md">
      <Heading size="md" mb={5}>
        Your Profile
      </Heading>

      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input value={email} isReadOnly />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Button mt={2} onClick={updateName}>
          Update Name
        </Button>
      </FormControl>

      <Heading size="sm" mt={6}>
        Change Password
      </Heading>
      <FormControl mt={2}>
        <FormLabel>Current Password</FormLabel>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </FormControl>

      <FormControl mt={2}>
        <FormLabel>New Password</FormLabel>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button mt={2} onClick={changePass}>
          Change Password
        </Button>
      </FormControl>
    </Box>
  );
};

export default ProfilePage;
