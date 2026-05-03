import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"; // ✅ NEW

// MODELS
import Message from "./models/Message.js"; // ✅ NEW

dotenv.config();
connectDB();

const app = express();

// ==============================
// CREATE HTTP SERVER
// ==============================
const server = http.createServer(app);

// ==============================
// SOCKET.IO SETUP
// ==============================
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ==============================
// STORE ONLINE USERS
// ==============================
const onlineUsers = new Map();

// ==============================
// SOCKET EVENTS
// ==============================
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // 🔥 REGISTER USER (for notifications)
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // ==============================
  // 💬 JOIN PROJECT ROOM (CHAT)
  // ==============================
  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User joined project room: ${projectId}`);
  });

  // ==============================
  // 💬 SEND MESSAGE (CHAT)
  // ==============================
  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, projectId, content } = data;

      // SAVE MESSAGE TO DB
      const message = await Message.create({
        sender: senderId,
        projectId,
        content,
      });

      // POPULATE SENDER INFO
      const populatedMessage = await Message.findById(message._id).populate(
        "sender",
        "name email"
      );

      // SEND TO ALL USERS IN THAT PROJECT ROOM
      io.to(projectId).emit("receiveMessage", populatedMessage);

    } catch (error) {
      console.error("❌ Chat error:", error.message);
    }
  });

  // ==============================
  // DISCONNECT
  // ==============================
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    for (let [userId, id] of onlineUsers) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
      }
    }
  });
});

// ==============================
// MIDDLEWARE
// ==============================

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ==============================
// ROUTES
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes); // ✅ NEW

// ==============================
// HEALTH CHECK
// ==============================

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ==============================
// EXPORTS
// ==============================
export { onlineUsers };