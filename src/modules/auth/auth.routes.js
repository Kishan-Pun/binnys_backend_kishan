import express from "express";
import { register, login } from "./auth.controller.js";
import { validate } from "../../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "./auth.schemas.js";

const router = express.Router();

router.post("/register", validate(registerSchema, "body"), register);

router.post("/login", validate(loginSchema, "body"), login);

export default router;
