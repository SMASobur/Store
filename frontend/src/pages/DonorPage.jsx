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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  if (!donor) return <Text>Donor not found.</Text>;

  return (
    <Box p={6}>
      <Heading mb={4} color={textColor}>
        Donor: {donor.name}
      </Heading>
      <Text mb={2} fontSize="lg" color={textColor}>
        Total Donations: ৳
        {donorDonations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
      </Text>
      <Text mb={6} fontSize="lg" color={textColor}>
        Number of Donations:
        {donorDonations.length}
      </Text>

      {donorDonations.length === 0 && (
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Text fontSize="lg">No donations recorded yet</Text>
          </CardBody>
        </Card>
      )}

      {/* <Box mb={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Heading size="md" mb={2}>
              Donation Summary
            </Heading>
            <Text>
              <strong>Total Donations:</strong> ৳
              {donorDonations
                .reduce((sum, d) => sum + d.amount, 0)
                .toLocaleString()}
            </Text>
            <Text>
              <strong>Number of Donations:</strong> {donorDonations.length}
            </Text>
            <Text>
              <strong>Average Donation:</strong> ৳
              {donorDonations.length > 0
                ? (
                    donorDonations.reduce((sum, d) => sum + d.amount, 0) /
                    donorDonations.length
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : 0}
            </Text>
          </CardBody>
        </Card>
      </Box> */}

      <Stack spacing={4}>
        {donorDonations.map((donation) => (
          <Card key={donation.id} bg={cardBg}>
            <CardBody>
              <Text fontSize="md" color={textColor}>
                Amount: ৳{donation.amount.toLocaleString()}
              </Text>
              <Text fontSize="sm" color={textColor}>
                Date: {formatDate(donation.date)}
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
