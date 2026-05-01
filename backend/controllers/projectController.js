import Project from "../models/Project.js";

// ==============================
// CREATE PROJECT (Admin)
// ==============================
export const createProject = async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const project = await Project.create({
      title,
      description,
      teamMembers,
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET PROJECTS (User Based)
// ==============================
export const getProjects = async (req, res) => {
  try {
    let projects;

    // Admin → all projects
    if (req.user.role === "Admin") {
      projects = await Project.find()
        .populate("teamMembers", "name email")
        .populate("createdBy", "name email");
    } else {
      // Member → only assigned projects
      projects = await Project.find({
        teamMembers: req.user.id,
      })
        .populate("teamMembers", "name email")
        .populate("createdBy", "name email");
    }

    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// DELETE PROJECT (Admin)
// ==============================
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateProject = async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.teamMembers = teamMembers || project.teamMembers;

    const updated = await project.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};