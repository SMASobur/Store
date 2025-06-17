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
  Link,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Badge,
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
                {/* Admin/Superadmin badge */}
                {user?.role === "admin" && (
                  <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
                {user?.role === "superadmin" && (
                  <Badge
                    ml={2}
                    colorScheme="red"
                    fontSize="0.6em"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                  >
                    SUPER
                  </Badge>
                )}
              </ChakraLink>
            </Flex>
          </Box>
          <HStack spacing={2} alignItems={"center"}>
            {/* Always visible links */}
            <RouterLink to={user ? "/my-books" : "/books"}>
              <Button
              // leftIcon={<PiBooksDuotone fontSize={20} />}
              >
                📚 Books
              </Button>
            </RouterLink>
            <RouterLink to="/cards">
              <Button
              // leftIcon={<BiCreditCardFront fontSize={20} />}
              >
                🗂️ Cards
              </Button>
            </RouterLink>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
            </Button>

            {/* Authenticated user menu */}
            {user ? (
              <Menu>
                <MenuButton>
                  <Avatar name={user.name} size="sm" />
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">
                    👨‍🔧 Profile
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/about">
                    👨‍💻 Developer
                  </MenuItem>
                  {(user.role === "admin" || user.role === "superadmin") && (
                    <MenuItem as={RouterLink} to="/admin">
                      🛠 Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={toggleColorMode}>
                    <Flex align="center" gap={2}>
                      {colorMode === "light" ? <IoMoon /> : <LuSun />}
                      <Text>
                        {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                      </Text>
                    </Flex>
                  </MenuItem>

                  <MenuItem onClick={handleLogout}> 🚪 Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <RouterLink to="/login">
                <Tooltip label="Login">
                  <Button>
                    <CiLogin />
                  </Button>
                </Tooltip>
              </RouterLink>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
