import express from "express";
import {
  getDonors,
  createDonor,
  getDonations,
  createDonation,
  getExpenses,
  createExpense,
  getAllSchoolData,
  getExpenseCategories,
  createExpenseCategory,
} from "../../controllers/school/school.controller.js";

import { ExpenseCategory } from "../../models/school/expenseCategory.model.js";

const router = express.Router();
router.get("/", getAllSchoolData);

router.get("/donors", getDonors);
router.post("/donors", createDonor);

router.get("/donations", getDonations);
router.post("/donations", createDonation);

router.get("/expense-categories", getExpenseCategories);
router.post("/expense-categories", createExpenseCategory);

router.get("/expenses", getExpenses);
router.post("/expenses", createExpense);

export default router;
