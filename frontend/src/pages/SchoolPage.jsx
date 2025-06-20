import React, { useState, useEffect } from "react";
import { useSchoolStore } from "../store/school";
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  SimpleGrid,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

const SchoolPage = () => {
  const {
    donors,
    donations,
    expenses,
    fetchAllSchoolData,
    createDonor,
    createDonation,
  } = useSchoolStore();

  const { user, token } = useAuth();
  const [newDonorName, setNewDonorName] = useState("");
  const [selectedDonorId, setSelectedDonorId] = useState("");
  const [DonorMedium, setDonorMedium] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationDate, setDonationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchAllSchoolData();
  }, []);

  const addNewDonor = async () => {
    if (!newDonorName.trim()) return;

    const result = await createDonor(newDonorName, token);
    console.log("Create Donor Result:", result); // Add this

    if (result.success) {
      setSelectedDonorId(result.data.id); // Use the returned ID
      setNewDonorName("");
      onClose();
    } else {
      alert(result.message || "Failed to create donor.");
    }
  };
  const addDonation = async () => {
    if (!selectedDonorId || !donationAmount) return;

    try {
      const result = await createDonation(
        {
          donorId: selectedDonorId,
          amount: parseFloat(donationAmount),
          medium: DonorMedium,
          date: donationDate,
        },
        token
      );

      console.log("Donation result:", result); // Debugging

      if (result.success) {
        setDonationAmount("");
        setDonorMedium("");
        setDonationDate(new Date().toISOString().split("T")[0]);
        // Optional: Refetch data to ensure consistency
        await fetchAllSchoolData();
      } else {
        alert(result.message || "Failed to add donation.");
      }
    } catch (error) {
      console.error("Donation error:", error);
      alert("An unexpected error occurred");
    }
  };

  const getDonationsByDonor = () => {
    return donors.map((donor) => {
      const donorDonations = donations.filter((d) => d.donorId === donor.id);
      const total = donorDonations.reduce((sum, d) => sum + d.amount, 0);
      return { donor, donations: donorDonations, total };
    });
  };
  const addExpense = async () => {
    if (!expenseDesc || !expenseAmount) return;

    const result = await createExpense(
      {
        description: expenseDesc,
        amount: parseFloat(expenseAmount),
        date: expenseDate,
      },
      token
    );

    if (result.success) {
      setExpenseDesc("");
      setExpenseAmount("");
      setExpenseDate(new Date().toISOString().split("T")[0]);
    } else {
      alert(result.message || "Failed to add expense.");
    }
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalDonations - totalExpenses;
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={5}>
      <Heading textAlign="center" color="teal.600" mb={6}>
        School Financial Records
      </Heading>

      {/* Add Donation Form */}
      <Box mb="10" p="4" bg="gray.50" borderRadius="md">
        <Heading size="md" mb="4">
          Add New Donation
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
          <FormControl>
            <FormLabel>Select Donor</FormLabel>
            <Select
              placeholder="Select donor"
              value={selectedDonorId}
              onChange={(e) => setSelectedDonorId(e.target.value)}
            >
              {donors.map((donor) => (
                <option key={donor.id} value={donor.id}>
                  {donor.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Medium</FormLabel>
            <Input
              type="string"
              value={DonorMedium}
              onChange={(e) => setDonorMedium(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={donationDate}
              onChange={(e) => setDonationDate(e.target.value)}
            />
          </FormControl>
        </SimpleGrid>

        <Box display="flex" justifyContent="space-between">
          <Button colorScheme="blue" onClick={addDonation}>
            Add Donation
          </Button>
          <Button variant="outline" onClick={onOpen}>
            + Add New Donor
          </Button>
        </Box>
      </Box>
      <Box mb="10" p="4" bg="gray.50" borderRadius="md">
        <Heading size="md" mb="4">
          Add New Expense
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              value={expenseDesc}
              onChange={(e) => setExpenseDesc(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
          </FormControl>
        </SimpleGrid>
        <Button colorScheme="red" onClick={addExpense}>
          Add Expense
        </Button>
      </Box>

      {/* Tables */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb="10">
        <Box>
          <Heading size="md" mb="4" color="green.600">
            Donations by Donor
          </Heading>
          <Table size="sm" variant="striped" colorScheme="green">
            <Thead>
              <Tr>
                <Th>Donor</Th>
                <Th isNumeric>Total</Th>
                <Th>Details</Th>
                <Th>Medium</Th>
              </Tr>
            </Thead>
            <Tbody>
              {getDonationsByDonor().map(({ donor, total, donations }) => (
                <Tr key={donor.id}>
                  <Td>{donor.name}</Td>
                  <Td isNumeric>${total.toLocaleString()}</Td>
                  <Td>
                    {donations.map((d) => (
                      <Text key={d.id} fontSize="sm">
                        ${d.amount} on {d.date}
                      </Text>
                    ))}
                  </Td>
                  <Td>
                    {donations.map((d) => (
                      <Text key={d.id} fontSize="sm">
                        {d.medium}
                      </Text>
                    ))}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Text mt="2" textAlign="right" fontWeight="bold">
            Total Donations: ${totalDonations.toLocaleString()}
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb="4" color="red.600">
            Expenses
          </Heading>
          <Table size="sm" variant="striped" colorScheme="red">
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th isNumeric>Amount</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {expenses.map((e) => (
                <Tr key={e.id}>
                  <Td>{e.description}</Td>
                  <Td isNumeric>${e.amount.toLocaleString()}</Td>
                  <Td>{e.date}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Text mt="2" textAlign="right" fontWeight="bold">
            Total Expenses: ${totalExpenses.toLocaleString()}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Summary */}
      <Box p="4" bg="gray.100" borderRadius="md" maxW="container.md" mx="auto">
        <Heading size="md" mb="3" textAlign="center">
          Financial Summary
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} textAlign="center">
          <Box>
            <Text fontSize="sm" color="gray.600">
              Total Donations
            </Text>
            <Text fontWeight="bold" color="green.600">
              ${totalDonations.toLocaleString()}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">
              Total Expenses
            </Text>
            <Text fontWeight="bold" color="red.600">
              ${totalExpenses.toLocaleString()}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">
              Current Balance
            </Text>
            <Text
              fontWeight="bold"
              color={balance >= 0 ? "teal.600" : "red.600"}
            >
              ${balance.toLocaleString()}
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Donor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Donor Name</FormLabel>
              <Input
                value={newDonorName}
                onChange={(e) => setNewDonorName(e.target.value)}
                placeholder="Enter donor name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={addNewDonor} mr={3}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SchoolPage;
