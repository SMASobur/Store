import { Donor } from "../../models/school/donor.model.js";
import { Donation } from "../../models/school/donation.model.js";
import { Expense } from "../../models/school/expense.model.js";
import { ExpenseCategory } from "../../models/school/expenseCategory.model.js";

// Get all donors
export const getDonors = async (req, res) => {
  const donors = await Donor.find();
  res.json(donors);
};

// Add new donor
export const createDonor = async (req, res) => {
  try {
    const { name } = req.body;
    const donor = new Donor({ name });
    const savedDonor = await donor.save();

    // Make sure to return this exact structure
    res.status(201).json({
      success: true,
      message: "Donor created successfully",
      data: savedDonor, // Ensure this includes _id
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all donations
export const getDonations = async (req, res) => {
  const donations = await Donation.find().populate("donorId", "name");
  res.json(donations);
};

// Add donation
export const createDonation = async (req, res) => {
  try {
    const { donorId, amount, medium, date } = req.body;
    const donation = new Donation({ donorId, amount, medium, date });
    const savedDonation = await donation.save();

    // Ensure this response structure matches what frontend expects
    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: {
        ...savedDonation.toObject(), // Convert Mongoose doc to plain object
        id: savedDonation._id, // Explicitly include id field
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all expenses
export const getExpenses = async (req, res) => {
  const expenses = await Expense.find().populate("category", "name");
  res.json(expenses);
};

// Add expense
export const createExpense = async (req, res) => {
  try {
    const { description, amount, date, category } = req.body;
    const expense = new Expense({ description, amount, date, category });
    const savedExpense = await expense.save();

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: savedExpense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSchoolData = async (req, res) => {
  try {
    const [donors, donations, expenses] = await Promise.all([
      Donor.find(),
      Donation.find(),
      Expense.find(),
    ]);

    res.json({ donors, donations, expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all expense categories
export const getExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new expense category
export const createExpenseCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new ExpenseCategory({ name });
    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: "Expense category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
