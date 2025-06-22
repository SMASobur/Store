import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSchoolStore } from "../store/school";
import {
  Box,
  Heading,
  Text,
  Stack,
  Card,
  CardBody,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";

const ExpensePage = () => {
  const { id } = useParams();
  const { expenses, expenseCategories, fetchAllSchoolData } = useSchoolStore();
  const [loading, setLoading] = useState(false);

  const category = expenseCategories.find((c) => c.id === id);
  const categoryExpenses = expenses.filter(
    (e) => e.category === id || e.category?._id === id
  );

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  useEffect(() => {
    if (!expenses.length || !expenseCategories.length) {
      setLoading(true);
      fetchAllSchoolData().finally(() => setLoading(false));
    }
  }, []);

  if (loading || !expenseCategories.length) {
    return (
      <Box p={6}>
        <Spinner />
        <Text>Loading expense data...</Text>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!category) return <Text>Category not found.</Text>;

  return (
    <Box p={6}>
      <Heading mb={4} color={textColor}>
        Category: {category.name}
      </Heading>
      <Text mb={2} fontSize="lg" color={textColor}>
        Total Expenses: ৳
        {categoryExpenses
          .reduce((sum, e) => sum + e.amount, 0)
          .toLocaleString()}
      </Text>
      <Text mb={6} fontSize="lg" color={textColor}>
        Number of Expenses: {categoryExpenses.length}
      </Text>

      {categoryExpenses.length === 0 && (
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Text fontSize="lg">No expenses recorded yet</Text>
          </CardBody>
        </Card>
      )}

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
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ExpensePage;
