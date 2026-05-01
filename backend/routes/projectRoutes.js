import express from "express";

import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router(); // ✅ MUST BE FIRST

// ==============================
// PROJECT ROUTES
// ==============================

// 🔍 Get all projects (Admin → all, Member → assigned)
router.get("/", authMiddleware, getProjects);

// ➕ Create project (Admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin"),
  createProject
);

// ✏️ Update project (Admin only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  updateProject
);

// 🗑 Delete project (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteProject
);

export default router;