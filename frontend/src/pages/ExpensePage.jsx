import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
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
  Input,
  FormControl,
  FormLabel,
  SimpleGrid,
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
  const [confirmationText, setConfirmationText] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const category = expenseCategories.find((c) => c.id === id);
  const categoryExpenses = expenses.filter(
    (e) => e.category === id || e.category?._id === id
  );

  useEffect(() => {
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
    setIsConfirming(true);

    const result = isCategoryDelete
      ? await deleteCategory(itemToDelete, token)
      : await deleteExpense(itemToDelete, token);

    setIsConfirming(false);
    onClose();
    setConfirmationText("");

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
    setConfirmationText("");
    onOpen();
  };

  const isDeleteDisabled = isCategoryDelete
    ? confirmationText !== category?.name
    : false;

  if (loading || !expenseCategories.length) {
    return (
      <Box p={6}>
        <Spinner />
        <Text mt={2}>Loading expense data...</Text>
      </Box>
    );
  }

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
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        textAlign="center"
      >
        <Heading mb={4} color={useColorModeValue("orange.400", "orange.300")}>
          {category.name}
        </Heading>
        {(user?.role === "admin" || user?.role === "superadmin") && (
          <Box mb={4} textAlign="right">
            <Button
              colorScheme="red"
              leftIcon={<DeleteIcon />}
              onClick={() => openDeleteDialog(category.id, true)}
            >
              Delete Category
            </Button>
          </Box>
        )}
      </Flex>

      <Text mb={2} fontSize="lg" textAlign="center" color={textColor}>
        Total Expenses: ৳
        {categoryExpenses
          .reduce((sum, e) => sum + e.amount, 0)
          .toLocaleString()}
      </Text>
      <Text mb={6} fontSize="lg" textAlign="center" color={textColor}>
        Number of Expenses: {categoryExpenses.length}
      </Text>

      {categoryExpenses.length === 0 ? (
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Text fontSize="lg">No expenses recorded yet</Text>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {categoryExpenses.map((expense) => (
            <Card key={expense.id} bg={cardBg}>
              <CardBody position="relative">
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontSize="md" fontWeight="bold" color={textColor}>
                    Amount: ৳{expense.amount.toLocaleString()}
                  </Text>
                  {(user?.role === "admin" || user?.role === "superadmin") && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      leftIcon={<DeleteIcon />}
                      onClick={() => openDeleteDialog(expense.id)}
                    >
                      Delete
                    </Button>
                  )}
                </Flex>

                <Text fontSize="sm" color={textColor}>
                  Date: {formatDate(expense.date)}
                </Text>
                <Text fontSize="md" color={textColor} mb={2}>
                  {expense.description}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

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
              {isCategoryDelete ? (
                <>
                  <Text mb={4}>
                    Are you sure you want to delete the category "
                    {category.name}" and all its expenses? This action cannot be
                    undone.
                  </Text>
                  <FormControl>
                    <FormLabel>
                      Type the category name to confirm deletion:
                    </FormLabel>
                    <Input
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder={`Type "${category.name}" to confirm`}
                    />
                  </FormControl>
                </>
              ) : (
                "Are you sure you want to delete this expense? This action cannot be undone."
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isConfirming}
                isDisabled={isDeleteDisabled}
              >
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
