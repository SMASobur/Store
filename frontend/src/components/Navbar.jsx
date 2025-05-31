import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
  Image,
  Stack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom"; // If using React Router
import { Link } from "react-router-dom";
import { PiBooksDuotone } from "react-icons/pi";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { BiCreditCardFront } from "react-icons/bi";
import { MdOutlineDeveloperMode } from "react-icons/md";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      bg={useColorModeValue("gray.300", "gray.700")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container maxW="fit" px={4} py={4}>
        <Flex
          h={20}
          alignItems={"center"}
          justifyContent={{
            base: "center", // Center on mobile
            sm: "space-between", // Space between on larger screens
          }}
          flexDir={{
            base: "column",
            sm: "row",
          }}
          gap={{ base: 4, sm: 0 }} // Add gap between logo and buttons on mobile
        >
          <Text
            fontSize={{ base: "22", sm: "38" }}
            fontWeight={"bold"}
            textTransform={"uppercase"}
            textAlign={"center"}
            bgGradient={"linear(to-r, orange.400, yellow.400)"}
            bgClip={"text"}
          >
            <Flex direction="row" align="center">
              <ChakraLink
                as={RouterLink}
                to="/"
                display="flex"
                alignItems="center"
                justifyContent="center" // Ensure center alignment
              >
                <Image
                  boxSize={{ base: "40px", sm: "50px" }} // Smaller on mobile
                  objectFit="cover"
                  src="/fav.png"
                  alt="Logo"
                  mx={2} // Adds margin on left & right
                />
                KnitNox
              </ChakraLink>
            </Flex>
          </Text>

          <HStack spacing={2} alignItems={"center"}>
            <Link to={"/cards"}>
              <Button>
                <BiCreditCardFront fontSize={20} />
              </Button>
            </Link>
            <Link to={"/books"}>
              <Button>
                <PiBooksDuotone fontSize={20} />
              </Button>
            </Link>
            <Link to={"/about"}>
              <Button>
                <MdOutlineDeveloperMode size={30} />
              </Button>
            </Link>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
export default Navbar;
