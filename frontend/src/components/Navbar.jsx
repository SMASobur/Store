import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
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
      bg={useColorModeValue("gray.300", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container maxW="fit" px={4}>
        <Flex
          h={20}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDir={{
            base: "column",
            sm: "row",
          }}
        >
          <Text
            fontSize={{ base: "22", sm: "38" }}
            fontWeight={"bold"}
            textTransform={"uppercase"}
            textAlign={"center"}
            bgGradient={"linear(to-r, orange.400, yellow.400)"}
            bgClip={"text"}
          >
            <Link to={"/"}> KnitNox</Link>
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
