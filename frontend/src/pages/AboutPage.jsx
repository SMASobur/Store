import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  AbsoluteCenter,
  Box,
  Container,
  Divider,
  Heading,
  Highlight,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { FaUser } from "react-icons/fa";
const AboutPage = () => {
  return (
    <Container px={4} p={5}>
      <Heading>
        <Box position="relative" padding="10" p={5}>
          <Divider />
          <AbsoluteCenter px="4">About</AbsoluteCenter>
        </Box>
      </Heading>

      <Text textAlign={"center"} p={5}>
        <Highlight
          query="KnitNox"
          styles={{ px: "2", py: "1", rounded: "full", bg: "green.200" }}
        >
          Proudly made by KnitNox
        </Highlight>
      </Text>

      <Tooltip label="Developer" fontSize={{ base: "15", sm: "18" }}>
        <IconButton textAlign={"right"} mr={3} icon={<FaUser />} /> Md Abdus
        Sobur Sikdar
      </Tooltip>

      <Divider orientation="horizontal" />

      <Container p={2} px={0}>
        <Tooltip fontSize={{ base: "15", sm: "18" }}>
          <IconButton
            aria-label="Call Sage"
            textAlign={"right"}
            icon={<PhoneIcon />}
            mr={3}
          />{" "}
          +46 738 752 094
        </Tooltip>
        <Divider orientation="horizontal" />
        <Tooltip fontSize={{ base: "15", sm: "18" }}>
          <IconButton
            aria-label="Call Sage"
            textAlign={"right"}
            mr={3}
            icon={<EmailIcon />}
          />{" "}
          mdabdussobursikdar@gmail.com
        </Tooltip>
      </Container>
    </Container>
  );
};

export default AboutPage;
