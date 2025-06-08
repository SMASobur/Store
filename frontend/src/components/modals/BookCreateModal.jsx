import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useProductStore } from "../../store/book";
import { motion } from "framer-motion";
import { MdAddBox } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const BookCreateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishYear: "",
    price: "",
  });
  const initialRef = useRef(null);
  const toast = useToast();
  const { createProduct, fetchProducts } = useProductStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    setFormData({
      title: "",
      author: "",
      publishYear: "",
      price: "",
    });
    onOpen();
  };

  const handleCreate = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      if (!formData.title || !formData.author || !formData.price) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }

      const result = await createProduct({
        ...formData,
        createdBy: {
          id: user._id,
          name: user.name,
        },
      });

      if (result.success) {
        onClose();
        setFormData({
          title: "",
          author: "",
          publishYear: "",
          price: "",
        });
        toast({
          title: "Book created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        await fetchProducts();
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <MdAddBox
          onClick={handleOpenModal}
          className="text-5xl text-orange-500 cursor-pointer"
        />
      </motion.div>

      <Modal
        key={isOpen ? "open" : "closed"}
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
      >
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
            <FormControl isRequired mt={4}>
              <Text
                px={3}
                py={2}
                bg="gray.200"
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                Creating by: {user?.name || "Unknown User"}
              </Text>
            </FormControl>
          </ModalBody>
          <Text color={"red.500"} px={6}>
            * Fields are mandatory.{" "}
          </Text>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreate}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter> */}

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreate}
              isLoading={isSubmitting}
              loadingText="Creating..."
            >
              Create
            </Button>
            <Button onClick={onClose} isDisabled={isSubmitting}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookCreateModal;
