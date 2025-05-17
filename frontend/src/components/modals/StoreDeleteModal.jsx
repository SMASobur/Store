import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineDelete } from "react-icons/md";

const StoreDeleteModal = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isLoading,
}) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await onConfirm(product._id);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader alignSelf="center">
          <MdOutlineDelete className="text-8xl align-middle text-red-800 cursor-pointer" />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="xl" mb={4}>
            <strong>Are you sure?</strong>
          </Text>

          <Text fontSize="xl" mb={4}>
            Delete the book: <strong>{product.name}</strong>
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={handleDelete}
            isLoading={isLoading}
          >
            Delete
          </Button>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StoreDeleteModal;
