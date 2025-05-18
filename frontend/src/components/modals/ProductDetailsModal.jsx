import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Heading,
  Image,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const textColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Product Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            src={product.image}
            alt={product.name}
            h={400}
            w="full"
            objectFit="cover"
          />
          <Heading textAlign="center" p={4} as="h3" size="md" mb={2}>
            {product.name}
          </Heading>
          <Text
            textAlign="center"
            fontWeight="bold"
            fontSize="xl"
            color={textColor}
            mb={4}
          >
            {product.price} :-
          </Text>
          <Flex
            align="center"
            justify="center"
            fontWeight="bold"
            fontSize="xl"
            color={textColor}
            mb={4}
            gap={2}
            flexWrap="wrap"
          >
            <Text>This is {product.name}</Text>
            <Image
              src={product.image}
              alt={product.name}
              h={10}
              w={10}
              objectFit="cover"
              borderRadius="md"
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductDetailsModal;
