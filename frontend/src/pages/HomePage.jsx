import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react";
import { BiCreditCardFront } from "react-icons/bi";
import { PiBooksDuotone } from "react-icons/pi";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const textColor = useColorModeValue("orange.600", "gray.300");
  const bg = useColorModeValue("white", "gray.600");
  const cardBg = useColorModeValue("orange.100", "orange.400");

  const { user } = useAuth();
  return (
    <Container maxW="container.xl" py={12}>
      {!user && (
        <Card
          maxW="md"
          mx="auto"
          my={6}
          boxShadow="lg"
          borderRadius="xl"
          bg={cardBg}
        >
          <CardHeader fontSize="xl" fontWeight="bold" textAlign="center">
            Test Login Credentials
          </CardHeader>
          <CardBody>
            <Box mb={2}>
              <Text>
                To test the functionality of this web application, please use
                the following credentials:
              </Text>
            </Box>
            <Box mt={2}>
              <Text>
                <strong>Email:</strong> tester@knitnox.com
              </Text>
              <Text>
                <strong>Password:</strong> Tester123456
              </Text>
            </Box>
          </CardBody>
        </Card>
      )}
      <VStack spacing={8}>
        <div className="flex justify-between ">
          <Text
            fontSize={"30"}
            fontWeight={"bold"}
            bgColor="orange.400"
            bgClip={"text"}
          >
            View Port
          </Text>
        </div>
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
          }}
          spacing={10}
          w={"full"}
          alignItems={"center"}
          p="2"
        >
          <Box
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-15px)", shadow: "xl" }}
            bg={bg}
          >
            <Link
              to={user ? "/my-books" : "/books"}
              aria-label={user ? "Navigate to my books" : "Navigate to books"}
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                alignItems="center"
                justifyContent="center"
                p="4"
                textAlign="center"
              >
                <Box fontSize="150px" color="orange.400">
                  📚
                </Box>
                {/* <Box>
                  <PiBooksDuotone size="250" color="orange" />
                </Box> */}
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  mt={{ base: 1, md: 0 }}
                  ml={{ md: 4 }}
                  color={textColor}
                >
                  {user ? "My Books (Table View)" : "Books (Table View)"}
                </Text>
              </Flex>
            </Link>
          </Box>
          <Box
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-15px)", shadow: "xl" }}
            bg={bg}
          >
            <Link to={"/cards"}>
              <Flex
                direction={{ base: "column", md: "row" }} // Column on mobile, row on desktop
                alignItems="center"
                justifyContent="center"
                p="4"
                textAlign="center"
              >
                <Box fontSize="150px" color="orange.400">
                  🗂️
                </Box>

                {/* <BiCreditCardFront size="250" color="orange" /> */}

                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  mt={{ base: 1, md: 0 }} // Add top margin only on mobile
                  ml={{ md: 4 }} // Add left margin only on desktop
                  color={textColor}
                >
                  Store (Cards View)
                </Text>
              </Flex>
            </Link>
          </Box>
          <Box
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-15px)", shadow: "xl" }}
            bg={bg}
          >
            <Link to={"/notes"}>
              <Flex
                direction={{ base: "column", md: "row" }} // Column on mobile, row on desktop
                alignItems="center"
                justifyContent="center"
                p="4"
                textAlign="center"
              >
                <Box fontSize="150px" color="orange.400">
                  📒
                </Box>

                {/* <BiCreditCardFront size="250" color="orange" /> */}

                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  mt={{ base: 1, md: 0 }} // Add top margin only on mobile
                  ml={{ md: 4 }} // Add left margin only on desktop
                  color={textColor}
                >
                  Note (List View)
                </Text>
              </Flex>
            </Link>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default HomePage;
