import React, { useState, useEffect } from "react";
import { useSchoolStore } from "../store/school";
import { FcDonate } from "react-icons/fc";
import { FaDonate } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { MdCategory } from "react-icons/md";
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
  Button,
  SimpleGrid,
  useBreakpointValue,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Stack,
  Card,
  CardBody,
  Flex,
} from "@chakra-ui/react";
import { AddDonorModal } from "../components/modals/school/AddDonorModal";
import { AddDonationModal } from "../components/modals/school/AddDonationModal";
import { AddExpenseModal } from "../components/modals/school/AddExpenseModal";
import { AddCategoryModal } from "../components/modals/school/AddCategoryModal";

import { useAuth } from "../context/AuthContext";

const SchoolPage = () => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.500");
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");

  const {
    donors,
    donations,
    expenses,
    fetchAllSchoolData,
    createDonor,
    createDonation,
    createExpense,
    createCategory,
    expenseCategories,
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
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  // Separate modals for donation and expense
  const {
    isOpen: isDonorModalOpen,
    onOpen: onDonorModalOpen,
    onClose: onDonorModalClose,
  } = useDisclosure();
  const {
    isOpen: isDonationModalOpen,
    onOpen: onDonationModalOpen,
    onClose: onDonationModalClose,
  } = useDisclosure();
  const {
    isOpen: isExpenseModalOpen,
    onOpen: onExpenseModalOpen,
    onClose: onExpenseModalClose,
  } = useDisclosure();
  const {
    isOpen: isCategoryModalOpen,
    onOpen: onCategoryModalOpen,
    onClose: onCategoryModalClose,
  } = useDisclosure();

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
      onDonorModalClose();
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
        onDonationModalClose();
        await fetchAllSchoolData();
      } else {
        alert(result.message || "Failed to add donation.");
      }
    } catch (error) {
      console.error("Donation error:", error);
      alert("An unexpected error occurred");
    }
  };
  const openDonationModal = () => {
    setSelectedDonorId("");
    onDonationModalOpen();
  };
  const donorOptions = donors.map((donor) => ({
    value: donor.id,
    label: donor.name,
  }));

  const getDonationsByDonor = () => {
    return donors.map((donor) => {
      const donorDonations = donations.filter((d) => d.donorId === donor.id);
      const total = donorDonations.reduce((sum, d) => sum + d.amount, 0);
      return { donor, donations: donorDonations, total };
    });
  };
  const getExpensesByCategory = () => {
    return expenseCategories.map((category) => {
      const categoryExpenses = expenses.filter(
        (e) => e.category?._id === category._id || e.category === category._id
      );
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return { category, expenses: categoryExpenses, total };
    });
  };
  const addNewCategory = async () => {
    if (!newCategoryName.trim()) return;

    const result = await createCategory(newCategoryName, token);
    if (result.success) {
      setNewCategoryName("");
      onCategoryModalClose();
      await fetchAllSchoolData(); // refresh to update category list if used
    } else {
      alert(result.message || "Failed to create category.");
    }
  };
  const addExpense = async () => {
    if (!expenseDesc || !expenseAmount || !selectedCategoryId) {
      alert("Please fill all fields including category");
      return;
    }

    try {
      const result = await createExpense(
        {
          description: expenseDesc,
          amount: parseFloat(expenseAmount),
          date: expenseDate,
          category: selectedCategoryId,
        },
        token
      );

      if (result.success) {
        // Reset form
        setExpenseDesc("");
        setExpenseAmount("");
        setExpenseDate(new Date().toISOString().split("T")[0]);
        setSelectedCategoryId("");
        onExpenseModalClose();
        await fetchAllSchoolData();
      } else {
        alert(result.message || "Failed to add expense");
      }
    } catch (error) {
      console.error("Expense error:", error);
      alert("Error adding expense: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
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

      {/* Tables Section */}
      <Stack spacing={6}>
        {/* Donations Table  */}
        <Box p="4" bg={cardBg} borderRadius="md" boxShadow="md">
          {/* Action Buttons */}
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Flex justifyContent="center" gap={4} mb={8}>
              <Button
                colorScheme="blue"
                onClick={openDonationModal}
                rightIcon={<span> Donation</span>}
              >
                <FaDonate />
              </Button>

              <Button
                variant="outline"
                colorScheme="orange"
                onClick={onDonorModalOpen}
                rightIcon={<span>Donor</span>}
              >
                <FcDonate />
              </Button>
            </Flex>
          )}
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
                </Tr>
              </Thead>
              <Tbody>
                {getDonationsByDonor().map(({ donor, total, donations }) => (
                  <Tr key={donor.id}>
                    <Td color={textColor}>
                      <a href={`/donors/${donor.id}`} style={{ color: "teal" }}>
                        {donor.name}
                      </a>
                    </Td>
                    <Td isNumeric color={textColor}>
                      ৳{total.toLocaleString()}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Text mt="2" textAlign="right" fontWeight="bold" color={textColor}>
            Total Donations: ৳{totalDonations.toLocaleString()}
          </Text>
        </Box>

        {/*  Expenses Table */}
        <Box p="4" bg={cardBg} borderRadius="md" boxShadow="md">
          {/* Action Buttons */}
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Flex justifyContent="center" gap={4} mb={8}>
              <Button
                colorScheme="red"
                variant="solid"
                onClick={onExpenseModalOpen}
                rightIcon={<span> Expanses</span>}
              >
                <GiExpense />
              </Button>

              <Button
                variant="outline"
                colorScheme="orange"
                onClick={onCategoryModalOpen}
                rightIcon={<span> Category</span>}
              >
                <MdCategory />
              </Button>
            </Flex>
          )}
          <Heading size="md" mb={4} color={textColor}>
            Expenses by Category
          </Heading>
          <Box overflowX="auto">
            <Table
              size="sm"
              variant="striped"
              colorScheme={colorMode === "light" ? "red" : "gray"}
            >
              <Thead>
                <Tr>
                  <Th color={textColor}>Category</Th>
                  <Th isNumeric color={textColor}>
                    Total
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {getExpensesByCategory().map(({ category, total }) => (
                  <Tr key={category._id}>
                    <Td color={textColor}>
                      <a
                        href={`/categories/${category._id}`}
                        style={{ color: "teal" }}
                      >
                        {category.name}
                      </a>
                    </Td>
                    <Td isNumeric color={textColor}>
                      ৳{total.toLocaleString()}
                    </Td>
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
      <AddDonorModal
        isOpen={isDonorModalOpen}
        onClose={onDonorModalClose}
        newDonorName={newDonorName}
        setNewDonorName={setNewDonorName}
        addNewDonor={addNewDonor}
      />

      <AddDonationModal
        isOpen={isDonationModalOpen}
        onClose={onDonationModalClose}
        donorOptions={donorOptions}
        selectedDonorId={selectedDonorId}
        setSelectedDonorId={setSelectedDonorId}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        DonorMedium={DonorMedium}
        setDonorMedium={setDonorMedium}
        donationDate={donationDate}
        setDonationDate={setDonationDate}
        addDonation={addDonation}
      />

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={onExpenseModalClose}
        expenseCategories={expenseCategories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        expenseDesc={expenseDesc}
        setExpenseDesc={setExpenseDesc}
        expenseAmount={expenseAmount}
        setExpenseAmount={setExpenseAmount}
        expenseDate={expenseDate}
        setExpenseDate={setExpenseDate}
        addExpense={addExpense}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={onCategoryModalClose}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        addNewCategory={addNewCategory}
      />
    </Box>
  );
};

export default SchoolPage;
