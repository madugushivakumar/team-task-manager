export const validateTask = (req, res, next) => {
  const { title, description, projectId, assignedTo } = req.body;

  if (!title || !description || !projectId || !assignedTo) {
    return res.status(400).json({ message: "All fields required" });
  }

  next();
};