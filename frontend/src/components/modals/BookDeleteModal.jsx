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
  useToast,
} from "@chakra-ui/react";
import { MdOutlineDelete } from "react-icons/md";
import { useProductStore } from "../../store/book";
import { motion } from "framer-motion";
import { useState } from "react";

const Overlay = () => (
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);

const BookDeleteModal = ({ book }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteProduct } = useProductStore();
  const toast = useToast();
  const [overlay, setOverlay] = useState(<Overlay />);

  const handleDelete = async () => {
    try {
      const result = await deleteProduct(book._id);

      if (result.success) {
        toast({
          title: "Book deleted",
          description: `${book.title} has been removed`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Delete failed",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <MdOutlineDelete
          onClick={() => {
            setOverlay(<Overlay />);
            onOpen();
          }}
          className="text-2xl text-red-500 cursor-pointer"
        />
      </motion.div>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        {overlay}
        <ModalContent>
          <ModalHeader alignSelf="center">
            <motion.div
              animate={{
                y: [0, -10, 0], // up then down
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <MdOutlineDelete className="text-8xl text-red-600 cursor-pointer" />
            </motion.div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={4}>
              <Text fontSize="xl" mb={4}>
                <strong>Are you sure?</strong>
              </Text>

              <Text fontSize="xl" mb={4}>
                Delete the book: <strong>{book.title}</strong>
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <MdOutlineDelete className="text-4xl cursor-pointer" />
              </motion.div>
            </Button>

            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookDeleteModal;
