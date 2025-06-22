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

const DonorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef();

  const { donors, donations, fetchAllSchoolData, deleteDonor, deleteDonation } =
    useSchoolStore();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDonorDelete, setIsDonorDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const donor = donors.find((d) => d.id === id);
  const donorDonations = donations.filter((d) => d.donorId === id);

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  useEffect(() => {
    if (!donors.length || !donations.length) {
      setLoading(true);
      fetchAllSchoolData().finally(() => setLoading(false));
    }
  }, [donors.length, donations.length, fetchAllSchoolData]);

  const showToast = (title, description, status = "info") => {
    toast({
      title,
      description,
      status,
      duration: 4000,
      isClosable: true,
    });
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    const result = isDonorDelete
      ? await deleteDonor(itemToDelete, token)
      : await deleteDonation(itemToDelete, token);

    onClose();

    if (result.success) {
      showToast(
        isDonorDelete ? "Donor deleted" : "Donation deleted",
        undefined,
        "success"
      );
      if (isDonorDelete) navigate("/school");
    } else {
      showToast("Error deleting", result.message, "error");
    }
  };

  const openDeleteDialog = (deleteId, isDonor = false) => {
    setItemToDelete(deleteId);
    setIsDonorDelete(isDonor);
    onOpen();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading || !donors.length) {
    return (
      <Box p={6}>
        <Spinner />
        <Text>Loading donor data...</Text>
      </Box>
    );
  }

  if (!donor) {
    return (
      <Box p={6}>
        <Text>Donor not found.</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading mb={4} color={textColor}>
          Donor: {donor.name}
        </Heading>
        {isAdmin && (
          <Box mb={4} textAlign="right">
            <Button
              colorScheme="red"
              onClick={() => openDeleteDialog(donor.id, true)}
              leftIcon={<DeleteIcon />}
            >
              Delete Donor
            </Button>
          </Box>
        )}
      </Flex>

      <Text mb={2} fontSize="lg" color={textColor}>
        Total Donations: ৳
        {donorDonations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
      </Text>
      <Text mb={6} fontSize="lg" color={textColor}>
        Number of Donations: {donorDonations.length}
      </Text>

      {donorDonations.length === 0 ? (
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Text fontSize="lg">No donations recorded yet</Text>
          </CardBody>
        </Card>
      ) : (
        <Stack spacing={4}>
          {donorDonations.map((donation) => (
            <Card key={donation.id} bg={cardBg}>
              <CardBody>
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontSize="md" color={textColor}>
                    Amount: ৳{donation.amount.toLocaleString()}
                  </Text>
                  {isAdmin && (
                    <Button
                      mt={2}
                      colorScheme="red"
                      size="sm"
                      leftIcon={<DeleteIcon />}
                      onClick={() => openDeleteDialog(donation.id)}
                    >
                      Delete
                    </Button>
                  )}
                </Flex>

                <Text fontSize="sm" color={textColor}>
                  Date: {formatDate(donation.date)}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  Medium: {donation.medium || "N/A"}
                </Text>
              </CardBody>
            </Card>
          ))}
        </Stack>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {isDonorDelete ? "Donor" : "Donation"}
            </AlertDialogHeader>

            <AlertDialogBody>
              {isDonorDelete ? (
                <>
                  Are you sure you want to delete this donor and all their
                  donations? This action cannot be undone.
                </>
              ) : (
                "Are you sure you want to delete this donation? This action cannot be undone."
              )}
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

export default DonorPage;
