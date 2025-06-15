import express from "express";
import {
  getAllUsers,
  updateUserRole,
} from "../controllers/admin.controller.js";
import authMiddleware, { requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/admin/users
router.get("/users", authMiddleware, requireRole("admin"), getAllUsers);
router.put(
  "/users/:id/role",
  authMiddleware,
  requireRole("admin"),
  updateUserRole
);

export default router;
