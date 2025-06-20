import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export const Expense = mongoose.model("Expense", expenseSchema);
