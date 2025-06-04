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
  Link as ChakraLink,
  Tooltip,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { PiBooksDuotone } from "react-icons/pi";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { CiLogout, CiLogin } from "react-icons/ci";
import { BiCreditCardFront } from "react-icons/bi";
import { MdOutlineDeveloperMode } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            base: "center",
            sm: "space-between",
          }}
          flexDir={{
            base: "column",
            sm: "row",
          }}
          gap={{ base: 4, sm: 0 }}
        >
          <Box
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
                justifyContent="center"
              >
                <Image
                  boxSize={{ base: "40px", sm: "50px" }}
                  objectFit="cover"
                  src="/fav.png"
                  alt="Logo"
                  mx={2}
                />
                KnitNox
              </ChakraLink>
            </Flex>
          </Box>

          <HStack spacing={2} alignItems={"center"}>
            <RouterLink to="/cards">
              <Button>
                <BiCreditCardFront fontSize={20} />
              </Button>
            </RouterLink>
            <RouterLink to="/books">
              <Button>
                <PiBooksDuotone fontSize={20} />
              </Button>
            </RouterLink>
            <RouterLink to="/about">
              <Button>
                <MdOutlineDeveloperMode size={30} />
              </Button>
            </RouterLink>

            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
            </Button>

            {user ? (
              <>
                <Text fontSize="sm">Hi, {user.name}</Text>
                <Tooltip
                  label="Logout"
                  rounded="lg"
                  fontSize={{ base: "15", sm: "18" }}
                >
                  <Button onClick={handleLogout}>
                    <CiLogout />
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <RouterLink to="/login">
                  <Tooltip
                    label="Login"
                    rounded="lg"
                    fontSize={{ base: "15", sm: "18" }}
                  >
                    <Button>
                      <CiLogin />
                    </Button>
                  </Tooltip>
                </RouterLink>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
