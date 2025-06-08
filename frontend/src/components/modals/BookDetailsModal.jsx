import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Box,
  Text,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { PiSlideshowDuotone } from "react-icons/pi";
const OverlayOne = () => (
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);

const BookDetailsModal = ({ book }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <PiSlideshowDuotone
          onClick={() => {
            setOverlay(<OverlayOne />);
            onOpen();
          }}
          className="text-2xl text-green-500 cursor-pointer"
        />
      </motion.div>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        {overlay}

        <ModalContent>
          <ModalHeader>Booke Name: {book.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={4}>
              <Text fontSize="xl" mb={4}>
                <strong>Author:</strong> {book.author}
              </Text>

              <Text fontSize="xl" mb={4}>
                <strong>Publish Year:</strong> {book.publishYear}
              </Text>
              <Text fontSize="xl" mb={4}>
                <strong>Price:</strong> {book.price}
              </Text>
              <Text fontSize="xl" mb={4}>
                <strong>Created by:</strong>{" "}
                {book.createdBy?.name || "Unknown user"}
              </Text>
              <Text fontSize="xl" mb={4}>
                <strong>Updated by:</strong>{" "}
                {book.updatedBy?.name || "Not updated yet"}
              </Text>

              <Text fontSize="xl" mb={4}>
                Created at:{" "}
                {new Date(book.createdAt).toLocaleString("en-SE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </Text>
              <Text fontSize="xl" mb={4}>
                Updated at:{" "}
                {new Date(book.updatedAt).toLocaleString("en-SE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookDetailsModal;
