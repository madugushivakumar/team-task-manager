import Task from "../models/Task.js";

// ==============================
// CREATE TASK (Admin)
// ==============================
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    if (!title || !description || !projectId || !assignedTo) {
      return res.status(400).json({ message: "All fields required" });
    }

 const task = await Task.create({
  title,
  description,
  projectId,
  assignedTo,
  dueDate,
  status: "Pending", // explicit
});

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET TASKS (ROLE BASED)
// ==============================
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    let query = {};

    // Filter by project if provided
    if (projectId) {
      query.projectId = projectId;
    }

    // Member → only assigned tasks
    if (req.user.role === "Member") {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("projectId", "title");

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// UPDATE TASK (STATUS)
// ==============================
export const updateTask = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only assigned user or admin can update
    if (
      req.user.role !== "Admin" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = status || task.status;

    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id)
      .populate("assignedTo", "name email")
      .populate("projectId", "title");

    res.json(populatedTask);
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// DELETE TASK (Admin)
// ==============================
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};