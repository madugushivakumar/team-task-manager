import express from "express";
import Notification from "../models/Notification.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get notifications
router.get("/", protect, async (req, res) => {
  const data = await Notification.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(data);
});

export default router;