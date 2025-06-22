import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import Select from "react-select";

export const AddDonationModal = ({
  isOpen,
  onClose,
  donorOptions,
  selectedDonorId,
  setSelectedDonorId,
  donationAmount,
  setDonationAmount,
  DonorMedium,
  setDonorMedium,
  donationDate,
  setDonationDate,
  addDonation,
}) => {
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={cardBg}>
        <ModalHeader color={textColor}>Add New Donation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={1} spacing={4}>
            <FormControl>
              <FormLabel color={textColor}>Select Donor</FormLabel>
              <Select
                options={donorOptions}
                placeholder="Select donor"
                value={
                  donorOptions.find(
                    (option) => option.value === selectedDonorId
                  ) || null
                }
                onChange={(selectedOption) =>
                  setSelectedDonorId(
                    selectedOption ? selectedOption.value : null
                  )
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: cardBg,
                    borderColor: borderColor,
                    color: textColor,
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: textColor,
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Amount</FormLabel>
              <Input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Medium</FormLabel>
              <Input
                type="string"
                value={DonorMedium}
                onChange={(e) => setDonorMedium(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Date</FormLabel>
              <Input
                type="date"
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={addDonation} mr={3}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
