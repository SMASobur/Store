import express from "express";
import {
  getDonors,
  createDonor,
  getDonations,
  createDonation,
  getExpenses,
  createExpense,
  getAllSchoolData,
} from "../../controllers/school/school.controller.js";

const router = express.Router();
router.get("/", getAllSchoolData);

router.get("/donors", getDonors);
router.post("/donors", createDonor);

router.get("/donations", getDonations);
router.post("/donations", createDonation);

router.get("/expenses", getExpenses);
router.post("/expenses", createExpense);

export default router;
