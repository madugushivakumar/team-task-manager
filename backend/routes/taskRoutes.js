import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router(); // ✅ MUST BE FIRST

// GET tasks
router.get("/", authMiddleware, getTasks);

// CREATE task (Admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin"),
  createTask
);

// UPDATE task (Admin + Member)
router.put("/:id", authMiddleware, updateTask);

// DELETE task (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteTask
);

export default router;