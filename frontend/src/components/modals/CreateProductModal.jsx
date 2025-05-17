import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const CreateProductModal = ({ isOpen, onClose, onCreate }) => {
  const initialRef = useRef(null);
  const toast = useToast();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await onCreate(newProduct);
      setNewProduct({ name: "", price: "", image: "" });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                ref={initialRef}
                name="name"
                value={newProduct.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image"
                value={newProduct.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Create
          </Button>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductModal;
