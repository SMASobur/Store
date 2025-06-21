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

const DonorPage = () => {
  const { id } = useParams();
  const { donors, donations, fetchAllSchoolData } = useSchoolStore();
  const [loading, setLoading] = useState(false);

  const donor = donors.find((d) => d.id === id);
  const donorDonations = donations.filter((d) => d.donorId === id);

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  useEffect(() => {
    if (!donors.length || !donations.length) {
      setLoading(true);
      fetchAllSchoolData().finally(() => setLoading(false));
    }
  }, []);

  if (loading || !donors.length) {
    return (
      <Box p={6}>
        <Spinner />
        <Text>Loading donor data...</Text>
      </Box>
    );
  }

  if (!donor) return <Text>Donor not found.</Text>;

  return (
    <Box p={6}>
      <Heading mb={4} color={textColor}>
        Donor: {donor.name}
      </Heading>
      <Text mb={6} fontSize="lg" color={textColor}>
        Total Donations: ৳
        {donorDonations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
      </Text>

      <Stack spacing={4}>
        {donorDonations.map((donation) => (
          <Card key={donation.id} bg={cardBg}>
            <CardBody>
              <Text fontSize="md" color={textColor}>
                Amount: ৳{donation.amount.toLocaleString()}
              </Text>
              <Text fontSize="sm" color={textColor}>
                Date: {new Date(donation.date).toLocaleDateString()}
              </Text>
              <Text fontSize="sm" color={textColor}>
                Medium: {donation.medium}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default DonorPage;
