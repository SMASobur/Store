import express from "express";
import {
  createProductBooks,
  deleteProductBooks,
  getProductsBooks,
  getSingleProductsBooks,
  updateProductBooks,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", getProductsBooks);
router.get("/:id", getSingleProductsBooks);
router.post("/", createProductBooks);
router.put("/:id", updateProductBooks);
router.delete("/:id", deleteProductBooks);

export default router;
