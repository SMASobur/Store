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

export const AddExpenseModal = ({
  isOpen,
  onClose,
  expenseCategories,
  selectedCategoryId,
  setSelectedCategoryId,
  expenseDesc,
  setExpenseDesc,
  expenseAmount,
  setExpenseAmount,
  expenseDate,
  setExpenseDate,
  addExpense,
}) => {
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={cardBg}>
        <ModalHeader color={textColor}>Add New Expense</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={1} spacing={4}>
            <FormControl>
              <FormLabel color={textColor}>Category</FormLabel>
              <Select
                options={expenseCategories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                placeholder="Select category"
                value={
                  expenseCategories.find((c) => c.id === selectedCategoryId)
                    ? {
                        value: selectedCategoryId,
                        label: expenseCategories.find(
                          (c) => c.id === selectedCategoryId
                        ).name,
                      }
                    : null
                }
                onChange={(selected) => setSelectedCategoryId(selected?.value)}
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
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Description</FormLabel>
              <Input
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Date</FormLabel>
              <Input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </FormControl>
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={addExpense} mr={3}>
            Add Expanse
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
