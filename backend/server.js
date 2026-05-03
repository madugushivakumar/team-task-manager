import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ==============================
// LOAD ENV VARIABLES
// ==============================
dotenv.config();

// ==============================
// CONNECT DATABASE
// ==============================
connectDB();

// ==============================
// INIT APP
// ==============================
const app = express();

// ==============================
// MIDDLEWARE
// ==============================

// Parse JSON
app.use(express.json());

// ✅ FIXED CORS (IMPORTANT)
app.use(
  cors({
    origin: true, // allows all origins (fixes Vercel preview URLs issue)
    credentials: true,
  })
);

// ==============================
// ROUTES
// ==============================

// Auth routes
app.use("/api/auth", authRoutes);

// Project routes
app.use("/api/projects", projectRoutes);

// Task routes
app.use("/api/tasks", taskRoutes);

// User routes
app.use("/api/users", userRoutes);

// ==============================
// HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ==============================
// GLOBAL ERROR HANDLER (OPTIONAL BUT GOOD)
// ==============================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    message: err.message || "Server Error",
  });
});

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});