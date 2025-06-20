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
  useColorMode,
  useColorModeValue,
  Stack,
  Card,
  CardBody,
  Flex,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

const SchoolPage = () => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    donors,
    donations,
    expenses,
    fetchAllSchoolData,
    createDonor,
    createDonation,
    createExpense,
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
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchAllSchoolData();
  }, []);

  const addNewDonor = async () => {
    if (!newDonorName.trim()) return;

    const result = await createDonor(newDonorName, token);
    console.log("Create Donor Result:", result);

    if (result.success) {
      setSelectedDonorId(result.data.id);
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

      if (result.success) {
        setDonationAmount("");
        setDonorMedium("");
        setDonationDate(new Date().toISOString().split("T")[0]);
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

    try {
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
        await fetchAllSchoolData();
      } else {
        alert(result.message || "Failed to add expense.");
      }
    } catch (error) {
      console.error("Expense error:", error);
      alert("An unexpected error occurred while adding expense");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Option 1: dd-mm-yy format
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;

    // Option 2: Day Month Year format (e.g., "15 Jan 2023")
    // return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalDonations - totalExpenses;

  return (
    <Box p={isMobile ? 3 : 5} bg={bgColor} minH="100vh">
      <Heading
        textAlign="center"
        color={useColorModeValue("teal.600", "teal.300")}
        mb={6}
        size={isMobile ? "lg" : "xl"}
      >
        School Financial Records
      </Heading>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} mb={6}>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="sm" color={textColor}>
              Total Donations
            </Text>
            <Heading
              size="md"
              color={useColorModeValue("green.600", "green.300")}
            >
              ৳{totalDonations.toLocaleString()}
            </Heading>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="sm" color={textColor}>
              Total Expenses
            </Text>
            <Heading size="md" color={useColorModeValue("red.600", "red.300")}>
              ৳{totalExpenses.toLocaleString()}
            </Heading>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="sm" color={textColor}>
              Current Balance
            </Text>
            <Heading
              size="md"
              color={
                balance >= 0
                  ? useColorModeValue("teal.600", "teal.300")
                  : useColorModeValue("red.600", "red.300")
              }
            >
              ৳{balance.toLocaleString()}
            </Heading>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Forms Section */}
      <Stack spacing={6} mb={8}>
        {/* Add Donation Form */}
        <Box p="4" bg={cardBg} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4} color={textColor}>
            Add New Donation
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
            <FormControl>
              <FormLabel color={textColor}>Select Donor</FormLabel>
              <Select
                placeholder="Select donor"
                value={selectedDonorId}
                onChange={(e) => setSelectedDonorId(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              >
                {donors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Amount</FormLabel>
              <Input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Medium</FormLabel>
              <Input
                type="string"
                value={DonorMedium}
                onChange={(e) => setDonorMedium(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
            <FormControl>
              <FormLabel color={textColor}>Date</FormLabel>
              <Input
                type="date"
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>
          </SimpleGrid>

          <Flex justifyContent="space-between">
            <Button
              colorScheme="blue"
              onClick={addDonation}
              isFullWidth={isMobile}
              mb={isMobile ? 2 : 0}
            >
              Add Donation
            </Button>
            <Button variant="outline" onClick={onOpen} isFullWidth={isMobile}>
              + Add New Donor
            </Button>
          </Flex>
        </Box>

        {/* Add Expense Form */}
        <Box p="4" bg={cardBg} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4} color={textColor}>
            Add New Expense
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
            <FormControl>
              <FormLabel color={textColor}>Description</FormLabel>
              <Input
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Amount</FormLabel>
              <Input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Date</FormLabel>
              <Input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>
          </SimpleGrid>
          <Button colorScheme="red" onClick={addExpense} isFullWidth={isMobile}>
            Add Expense
          </Button>
        </Box>
      </Stack>

      {/* Tables Section */}
      <Stack spacing={6}>
        {/* Donations Table */}
        <Box p="4" bg={cardBg} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4} color={textColor}>
            Donations by Donor
          </Heading>
          <Box overflowX="auto">
            <Table
              size="sm"
              variant="striped"
              colorScheme={colorMode === "light" ? "green" : "gray"}
            >
              <Thead>
                <Tr>
                  <Th color={textColor}>Donor</Th>
                  <Th isNumeric color={textColor}>
                    Total
                  </Th>
                  {!isMobile && (
                    <>
                      <Th color={textColor}>Details</Th>
                      <Th color={textColor}>Medium</Th>
                    </>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {getDonationsByDonor().map(({ donor, total, donations }) => (
                  <Tr key={donor.id}>
                    <Td color={textColor}>{donor.name}</Td>
                    <Td isNumeric color={textColor}>
                      ৳{total.toLocaleString()}
                    </Td>
                    {!isMobile && (
                      <>
                        <Td color={textColor}>
                          {donations.map((d) => (
                            <Text key={d.id} fontSize="sm">
                              ৳{d.amount} on {formatDate(d.date)}
                            </Text>
                          ))}
                        </Td>
                        <Td color={textColor}>
                          {donations.map((d) => (
                            <Text key={d.id} fontSize="sm">
                              {d.medium}
                            </Text>
                          ))}
                        </Td>
                      </>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Text mt="2" textAlign="right" fontWeight="bold" color={textColor}>
            Total Donations: ৳{totalDonations.toLocaleString()}
          </Text>
        </Box>

        {/* Expenses Table */}
        <Box p="4" bg={cardBg} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4} color={textColor}>
            Expenses
          </Heading>
          <Box overflowX="auto">
            <Table
              size="sm"
              variant="striped"
              colorScheme={colorMode === "light" ? "red" : "gray"}
            >
              <Thead>
                <Tr>
                  <Th color={textColor}>Description</Th>
                  <Th isNumeric color={textColor}>
                    Amount
                  </Th>
                  <Th color={textColor}>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {expenses.map((e) => (
                  <Tr key={e.id}>
                    <Td color={textColor}>{e.description}</Td>
                    <Td isNumeric color={textColor}>
                      ৳{e.amount.toLocaleString()}
                    </Td>
                    <Td color={textColor}>{formatDate(e.date)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Text mt="2" textAlign="right" fontWeight="bold" color={textColor}>
            Total Expenses: ৳{totalExpenses.toLocaleString()}
          </Text>
        </Box>
      </Stack>

      {/* Add Donor Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>Add New Donor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel color={textColor}>Donor Name</FormLabel>
              <Input
                value={newDonorName}
                onChange={(e) => setNewDonorName(e.target.value)}
                placeholder="Enter donor name"
                bg={cardBg}
                borderColor={borderColor}
                color={textColor}
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
