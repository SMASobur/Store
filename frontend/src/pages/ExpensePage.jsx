import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Stack,
  Card,
  CardBody,
  useColorModeValue,
  Spinner,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useSchoolStore } from "../store/school";
import { useAuth } from "../context/AuthContext";

const ExpensePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef();

  const {
    expenses,
    expenseCategories,
    fetchAllSchoolData,
    deleteExpense,
    deleteCategory,
  } = useSchoolStore();

  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isCategoryDelete, setIsCategoryDelete] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  // Find the selected category and filter expenses by it
  const category = expenseCategories.find((c) => c.id === id);
  const categoryExpenses = expenses.filter(
    (e) => e.category === id || e.category?._id === id
  );

  useEffect(() => {
    // Fetch data if not already loaded
    if (!expenses.length || !expenseCategories.length) {
      setLoading(true);
      fetchAllSchoolData().finally(() => setLoading(false));
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    const result = isCategoryDelete
      ? await deleteCategory(itemToDelete, token)
      : await deleteExpense(itemToDelete, token);

    onClose();

    if (result.success) {
      toast({
        title: isCategoryDelete ? "Category deleted" : "Expense deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (isCategoryDelete) {
        navigate("/expenses");
      }
    } else {
      toast({
        title: "Error deleting",
        description: result.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openDeleteDialog = (id, isCategory = false) => {
    setItemToDelete(id);
    setIsCategoryDelete(isCategory);
    onOpen();
  };

  // Loading state
  if (loading || !expenseCategories.length) {
    return (
      <Box p={6}>
        <Spinner />
        <Text mt={2}>Loading expense data...</Text>
      </Box>
    );
  }

  // Category not found
  if (!category) {
    return (
      <Box p={6}>
        <Text fontSize="lg" color="red.500">
          Category not found.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading color={textColor}>Category: {category.name}</Heading>
        {(user?.role === "admin" || user?.role === "superadmin") && (
          <Button
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            onClick={() => openDeleteDialog(category.id, true)}
          >
            Delete Category
          </Button>
        )}
      </Flex>

      {/* Summary */}
      <Text mb={2} fontSize="lg" color={textColor}>
        Total Expenses: ৳
        {categoryExpenses
          .reduce((sum, e) => sum + e.amount, 0)
          .toLocaleString()}
      </Text>
      <Text mb={6} fontSize="lg" color={textColor}>
        Number of Expenses: {categoryExpenses.length}
      </Text>

      {/* No Expenses */}
      {categoryExpenses.length === 0 && (
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Text fontSize="lg">No expenses recorded yet</Text>
          </CardBody>
        </Card>
      )}

      {/* Expenses List */}
      <Stack spacing={4}>
        {categoryExpenses.map((expense) => (
          <Card key={expense.id} bg={cardBg}>
            <CardBody>
              <Text fontSize="md" color={textColor}>
                Description: {expense.description}
              </Text>
              <Text fontSize="md" color={textColor}>
                Amount: ৳{expense.amount.toLocaleString()}
              </Text>
              <Text fontSize="sm" color={textColor}>
                Date: {formatDate(expense.date)}
              </Text>

              {(user?.role === "admin" || user?.role === "superadmin") && (
                <Button
                  mt={2}
                  size="sm"
                  colorScheme="red"
                  leftIcon={<DeleteIcon />}
                  onClick={() => openDeleteDialog(expense.id)}
                >
                  Delete Expense
                </Button>
              )}
            </CardBody>
          </Card>
        ))}
      </Stack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {isCategoryDelete ? "Category" : "Expense"}
            </AlertDialogHeader>

            <AlertDialogBody>
              {isCategoryDelete
                ? "Are you sure you want to delete this category and all its expenses? This action cannot be undone."
                : "Are you sure you want to delete this expense? This action cannot be undone."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ExpensePage;
