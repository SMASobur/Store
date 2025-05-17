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

const BookDeleteModal = ({ book }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteProduct } = useProductStore();
  const toast = useToast();
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
      <MdOutlineDelete
        onClick={onOpen}
        className="text-2xl text-red-800 cursor-pointer"
      />

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader alignSelf="center">
            <MdOutlineDelete className="text-8xl align-middle text-red-800 cursor-pointer" />
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
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookDeleteModal;
