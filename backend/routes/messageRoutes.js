import express from "express";
import { getMessages } from "../controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/messages/:projectId
router.get("/:projectId", protect, getMessages);

export default router;