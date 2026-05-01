import express from "express";
import { signup, login } from "../controllers/authController.js";
import { validateSignup } from "../middleware/validationMiddleware.js";

const router = express.Router(); // ✅ FIRST define router

// ==============================
// AUTH ROUTES
// ==============================

// Signup (with validation)
router.post("/signup", validateSignup, signup);

// Login
router.post("/login", login);

export default router;