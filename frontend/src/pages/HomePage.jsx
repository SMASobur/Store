import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";
import React from "react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { BiCreditCardFront } from "react-icons/bi";
import { PiBooksDuotone } from "react-icons/pi";

const HomePage = () => {
  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        <div className="flex justify-between items-center">
          <Text
            fontSize={"30"}
            fontWeight={"bold"}
            bgGradient={"linear(to-r, blue.400, blue.500)"}
            bgClip={"text"}
            textAlign={"center"}
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
        >
          <Box
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
          >
            <Link to={"/cards"}>
              <Flex alignItems={"center"}>
                <Box p={4}>
                  <BiCreditCardFront size="250" color="orange" />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  textAlign={"center"}
                  mb={4}
                  textColor="black"
                >
                  Cards View
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
          >
            <Link to={"/books"}>
              <Flex alignItems={"center"}>
                <Box p={4}>
                  <PiBooksDuotone size="250" color="orange" />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  textAlign={"center"}
                  mb={4}
                  textColor={"orange"}
                >
                  Cards View
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
