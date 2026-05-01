import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load env variables
dotenv.config();

// Connect Database
connectDB();

const app = express(); // ✅ MUST COME BEFORE app.use

// ==============================
// MIDDLEWARE
// ==============================

// Parse JSON
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ==============================
// ROUTES
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes); // ✅ moved to correct place

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});