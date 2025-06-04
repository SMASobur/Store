import {
  Box,
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

const HomePage = () => {
  const textColor = useColorModeValue("orange.600", "gray.300");
  const bg = useColorModeValue("white", "gray.600");
  return (
    <Container maxW="container.xl" py={12}>
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
            lg: 2,
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
            _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
            bg={bg}
          >
            <Link to={"/books"}>
              <Flex
                direction={{ base: "column", md: "row" }} // Column on mobile, row on desktop
                alignItems="center"
                justifyContent="center"
                p="4"
                textAlign="center"
              >
                <Box>
                  <PiBooksDuotone size="250" color="orange" />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  mt={{ base: 1, md: 0 }} // Add top margin only on mobile
                  ml={{ md: 4 }} // Add left margin only on desktop
                  color={textColor}
                >
                  Books (Table View)
                </Text>
              </Flex>
            </Link>
          </Box>
          <Box
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
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
                <Box>
                  <BiCreditCardFront size="250" color="orange" />
                </Box>
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
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default HomePage;
