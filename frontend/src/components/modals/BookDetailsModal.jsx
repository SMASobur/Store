import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import { BsInfoCircle } from "react-icons/bs";

const BookDetailsModal = ({ book }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <BsInfoCircle
        onClick={onOpen}
        className="text-2xl text-green-800 cursor-pointer"
      />

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
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
                <strong>ID:</strong> {book._id}
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookDetailsModal;
