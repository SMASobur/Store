import React, { useState, useEffect } from "react";

import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

import { useSchoolStore } from "../store/school";
import { FcDonate } from "react-icons/fc";
import { FaDonate } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { MdCategory, MdAccountBalance } from "react-icons/md";
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
  useToast,
  Icon,
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

  const toast = useToast();
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
  const [donationSearch, setDonationSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");

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
    const trimmedName = newDonorName.trim();

    if (!trimmedName) return;

    // Check for existing donor with the same name (case-insensitive)
    const isDuplicate = donors.some(
      (donor) => donor.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Donor",
        description: "A donor with this name already exists.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await createDonor(trimmedName, token);
    console.log("Create Donor Result:", result);

    if (result.success) {
      toast({
        title: "Donor added.",
        description: `${trimmedName} has been added successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
        toast({
          title: "Donation added.",
          description: "Donation recorded successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
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
    const filteredDonors = donors.filter((donor) =>
      donor.name.toLowerCase().includes(donationSearch.toLowerCase())
    );

    return filteredDonors.map((donor) => {
      const donorDonations = donations.filter((d) => d.donorId === donor.id);
      const total = donorDonations.reduce((sum, d) => sum + d.amount, 0);
      return { donor, donations: donorDonations, total };
    });
  };

  const getExpensesByCategory = () => {
    const filteredCategories = expenseCategories.filter((category) =>
      category.name.toLowerCase().includes(expenseSearch.toLowerCase())
    );

    return filteredCategories.map((category) => {
      const categoryExpenses = expenses.filter(
        (e) => e.category?._id === category._id || e.category === category._id
      );
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return { category, expenses: categoryExpenses, total };
    });
  };

  const addNewCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) return;

    // Check for duplicate category
    const isDuplicate = expenseCategories.some(
      (category) => category.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Category",
        description: "A category with this name already exists.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await createCategory(trimmedName, token);

    if (result.success) {
      toast({
        title: "Category Added",
        description: `${trimmedName} has been successfully added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewCategoryName("");
      onCategoryModalClose();
      await fetchAllSchoolData(); // Refresh category list
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
        toast({
          title: "Expense added.",
          description: "Expense recorded successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
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
  const groupByMonth = (items) => {
    const monthlyData = {};

    items.forEach((item) => {
      const date = new Date(item.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += item.amount;
    });

    return Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([month, amount]) => ({
        month,
        amount,
      }));
  };

  // Add this to your component
  const monthlyDonations = groupByMonth(donations);
  const monthlyExpenses = groupByMonth(expenses);

  const topDonors = getDonationsByDonor()
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  const chartHeight = useBreakpointValue({ base: 250, md: 300 });
  const chartWidth = useBreakpointValue({ base: "100%", md: "100%" });
  return (
    <Box p={isMobile ? 3 : 5} bg={bgColor} minH="80vh">
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
          <CardBody textAlign="center">
            <FaDonate size="2em" color="#38A169" />
            <Text fontSize="sm" color={textColor} mt={2}>
              Total Donations
            </Text>
            <Heading size="md" color="green.500">
              ৳{totalDonations.toLocaleString()}
            </Heading>
            <Text fontSize="xs" color="gray.500">
              {donations.length} transactions
            </Text>
          </CardBody>
        </Card>

        {/* Total Expenses Card */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <GiExpense size="2em" color="#E53E3E" />
            <Text fontSize="sm" color={textColor} mt={2}>
              Total Expenses
            </Text>
            <Heading size="md" color="red.500">
              ৳{totalExpenses.toLocaleString()}
            </Heading>
            <Text fontSize="xs" color="gray.500">
              {expenses.length} transactions
            </Text>
          </CardBody>
        </Card>

        {/* Total Expenses Card */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <Icon
              as={MdAccountBalance}
              w="2em"
              h="2em"
              color={balance >= 0 ? "teal.600" : "red.600"}
              _dark={{ color: balance >= 0 ? "teal.300" : "red.300" }}
            />
            <Text fontSize="sm" color={textColor} mt={2}>
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
      {/* Summary Chart */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
        {/* Donations vs Expenses Comparison */}
        <Card bg={cardBg} p={4}>
          <Heading size="sm" mb={4}>
            Donations vs Expenses
          </Heading>
          <Bar
            data={{
              labels: ["Total"],
              datasets: [
                {
                  label: "Donations",
                  data: [totalDonations],
                  backgroundColor: "#38A169",
                },
                {
                  label: "Expenses",
                  data: [totalExpenses],
                  backgroundColor: "#E53E3E",
                },
              ],
            }}
          />
        </Card>

        {/* Expense Breakdown */}
        <Card bg={cardBg} p={4}>
          <Heading size="sm" mb={4}>
            Expense Categories
          </Heading>
          <Box height="250px" position="relative">
            {" "}
            {/* Container with fixed height */}
            <Pie
              data={{
                labels: getExpensesByCategory().map(
                  (item) => item.category.name
                ),
                datasets: [
                  {
                    data: getExpensesByCategory().map((item) => item.total),
                    backgroundColor: [
                      "#DD6B20",
                      "#3182CE",
                      "#805AD5",
                      "#D53F8C",
                      "#0BC5EA",
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false, // This allows custom sizing
                plugins: {
                  legend: {
                    position: "right", // Moves legend to the right to save vertical space
                  },
                },
              }}
            />
          </Box>
        </Card>
        <Card bg={cardBg} p={4} mb={6}>
          <Heading size="sm" mb={4}>
            Monthly Financial Trends
          </Heading>
          <Line
            data={{
              labels: monthlyDonations.map((item) => item.month),
              datasets: [
                {
                  label: "Donations",
                  data: monthlyDonations.map((item) => item.amount),
                  borderColor: "#38A169",
                  tension: 0.1,
                },
                {
                  label: "Expenses",
                  data: monthlyExpenses.map((item) => item.amount),
                  borderColor: "#E53E3E",
                  tension: 0.1,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Card>

        <Card bg={cardBg} p={4} mb={6}>
          <Heading size="sm" mb={4}>
            Top 5 Donors
          </Heading>
          <Bar
            data={{
              labels: topDonors.map((item) => item.donor.name),
              datasets: [
                {
                  label: "Amount",
                  data: topDonors.map((item) => item.total),
                  backgroundColor: "#4299E1",
                },
              ],
            }}
            options={{
              indexAxis: "y",
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
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
          <Box mb={4}>
            <input
              type="text"
              placeholder="Search Donors"
              value={donationSearch}
              onChange={(e) => setDonationSearch(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                borderRadius: "4px",
                border: "1px solid lightgray",
              }}
            />
          </Box>

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
          <Box mb={4}>
            <input
              type="text"
              placeholder="Search Categories"
              value={expenseSearch}
              onChange={(e) => setExpenseSearch(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                borderRadius: "4px",
                border: "1px solid lightgray",
              }}
            />
          </Box>

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
