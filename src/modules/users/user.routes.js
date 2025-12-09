import express from "express";
import {
  getUsers,
  getUserById,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "./user.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { validate } from "../../middleware/validateRequest.js";
import {
  createUserSchema,
  updateUserSchema,
} from "./user.schemas.js";

const router = express.Router();

// All routes here require:
// - authenticated user
// - role: superadmin
router.use(authMiddleware);
router.use(requireRole("superadmin"));

// GET /users
router.get("/", getUsers);

// GET /users/:id
router.get("/:id", getUserById);

// POST /users
router.post(
  "/",
  validate(createUserSchema, "body"),
  createUserByAdmin
);

// PUT /users/:id
router.put(
  "/:id",
  validate(updateUserSchema, "body"), 
  updateUserByAdmin
);

// DELETE /users/:id
router.delete("/:id", deleteUserByAdmin);

export default router;
