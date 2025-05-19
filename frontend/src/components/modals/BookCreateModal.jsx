import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Box,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useToast,
  IconButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useProductStore } from "../../store/book";
import { motion } from "framer-motion";
import { MdAddBox } from "react-icons/md";

const BookCreateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishYear: "",
    price: "",
  });
  const initialRef = useRef(null);
  const toast = useToast();
  const { createProduct, fetchProducts } = useProductStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      // Ensure all fields are filled
      if (!formData.title || !formData.author || !formData.price) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const result = await createProduct({
        title: formData.title,
        author: formData.author,
        publishYear: formData.publishYear,
        price: formData.price,
      });

      if (result.success) {
        toast({
          title: "Book created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        await fetchProducts();
        setFormData({ title: "", author: "", publishYear: "", price: "" });
        onClose();
      } else {
        toast({
          title: "Creation failed",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
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
        <MdAddBox
          onClick={onOpen}
          className="text-5xl text-orange-500 cursor-pointer"
        />
      </motion.div>

      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter book title"
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Author</FormLabel>
              <Input
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Publish Year</FormLabel>
              <Input
                name="publishYear"
                value={formData.publishYear}
                onChange={handleInputChange}
                placeholder="Enter publish year"
                type="number"
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Price</FormLabel>
              <Input
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                type="number"
              />
            </FormControl>
          </ModalBody>
          <Text color={"red.500"} px={6}>
            * Fields are mandatory.{" "}
          </Text>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreate}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookCreateModal;
