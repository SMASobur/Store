import React, { useState, useEffect } from "react";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  SimpleGrid,
  useBreakpointValue,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const SchoolPage = () => {
  // State for donors and donations
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Form states
  const [newDonorName, setNewDonorName] = useState("");
  const [selectedDonorId, setSelectedDonorId] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationDate, setDonationDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Modal controls
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Load sample data
  useEffect(() => {
    // Sample initial donors
    const initialDonors = [
      { id: 1, name: "John Doe Miah" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Acme Corp" },
    ];

    // Sample initial donations
    const initialDonations = [
      { id: 1, donorId: 1, amount: 500, date: "2023-05-15" },
      { id: 2, donorId: 2, amount: 300, date: "2023-06-20" },
      { id: 3, donorId: 1, amount: 200, date: "2023-07-10" },
      { id: 4, donorId: 3, amount: 1000, date: "2023-08-05" },
    ];

    // Sample expenses
    const initialExpenses = [
      {
        id: 1,
        description: "School Supplies",
        amount: 200,
        date: "2023-05-18",
      },
      {
        id: 2,
        description: "Building Maintenance",
        amount: 450,
        date: "2023-06-25",
      },
    ];

    setDonors(initialDonors);
    setDonations(initialDonations);
    setExpenses(initialExpenses);
  }, []);

  // Calculate totals
  const totalDonations = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const balance = totalDonations - totalExpenses;

  // Get donations grouped by donor
  const getDonationsByDonor = () => {
    return donors.map((donor) => {
      const donorDonations = donations.filter((d) => d.donorId === donor.id);
      const total = donorDonations.reduce((sum, d) => sum + d.amount, 0);

      return {
        donor,
        donations: donorDonations,
        total,
      };
    });
  };

  // Add new donor
  const addNewDonor = () => {
    if (newDonorName.trim() === "") return;

    const newDonor = {
      id: donors.length > 0 ? Math.max(...donors.map((d) => d.id)) + 1 : 1,
      name: newDonorName.trim(),
    };

    setDonors([...donors, newDonor]);
    setNewDonorName("");
    onClose();
    setSelectedDonorId(newDonor.id); // Auto-select the new donor
  };

  // Add new donation
  const addDonation = () => {
    if (!selectedDonorId || !donationAmount) return;

    const amount = parseFloat(donationAmount);
    if (isNaN(amount)) return;

    const newDonation = {
      id:
        donations.length > 0 ? Math.max(...donations.map((d) => d.id)) + 1 : 1,
      donorId: parseInt(selectedDonorId),
      amount,
      date: donationDate,
    };

    setDonations([...donations, newDonation]);
    setDonationAmount("");
    setDonationDate(new Date().toISOString().split("T")[0]);
  };

  // Responsive layout
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p="5">
      <Heading mb="8" textAlign="center" color="teal.600">
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
            <FormLabel>Amount ($)</FormLabel>
            <Input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount"
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

      {/* Tables Container */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb="10">
        {/* Donors Table */}
        <Box>
          <Heading size="md" mb="4" color="green.600">
            Donations by Donor
          </Heading>
          <Table variant="striped" colorScheme="green" size="sm">
            <Thead>
              <Tr>
                <Th>Donor</Th>
                <Th isNumeric>Total</Th>
                <Th>Donations</Th>
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
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Text mt="3" fontWeight="bold" textAlign="right">
            Total Donations: ${totalDonations.toLocaleString()}
          </Text>
        </Box>

        {/* Expenses Table */}
        <Box>
          <Heading size="md" mb="4" color="red.600">
            Expenses List
          </Heading>
          <Table variant="striped" colorScheme="red" size="sm">
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th isNumeric>Amount</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {expenses.map((expense) => (
                <Tr key={expense.id}>
                  <Td>{expense.description}</Td>
                  <Td isNumeric>${expense.amount.toLocaleString()}</Td>
                  <Td>{expense.date}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Text mt="3" fontWeight="bold" textAlign="right">
            Total Expenses: ${totalExpenses.toLocaleString()}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Balance Summary */}
      <Box p="4" bg="gray.100" borderRadius="md" maxW="container.md" mx="auto">
        <Heading size="md" mb="2" textAlign="center">
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

      {/* Add New Donor Modal */}
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
            <Button colorScheme="blue" mr={3} onClick={addNewDonor}>
              Save Donor
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
