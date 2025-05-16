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
} from "@chakra-ui/react";
import { useState } from "react";
import { TbListDetails } from "react-icons/tb";
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
      <TbListDetails
        onClick={() => {
          setOverlay(<OverlayOne />);
          onOpen();
        }}
        className="text-2xl text-green-800 cursor-pointer"
      />

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
