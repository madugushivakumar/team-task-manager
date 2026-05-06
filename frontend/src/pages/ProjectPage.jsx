import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    members: "",
  });

  // 🔥 EDIT MODE
  const [editingId, setEditingId] = useState(null);

  // ==============================
  // FETCH PROJECTS
  // ==============================
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);

    } catch (error) {
      console.error("Fetch projects error:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==============================
  // HANDLE CHANGE
  // ==============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // CREATE / UPDATE PROJECT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: form.title,
        description: form.description,
        members: form.members
          .split(",")
          .map((m) => m.trim()),
      };

      // ==============================
      // UPDATE
      // ==============================
      if (editingId) {

        await API.put(
          `/projects/${editingId}`,
          payload
        );

        setEditingId(null);

      } else {

        // ==============================
        // CREATE
        // ==============================
        await API.post("/projects", payload);
      }

      // RESET FORM
      setForm({
        title: "",
        description: "",
        members: "",
      });

      fetchProjects();

    } catch (error) {
      console.error("Project submit error:", error);
    }
  };

  // ==============================
  // DELETE PROJECT
  // ==============================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${id}`);

      fetchProjects();

    } catch (error) {
      console.error("Delete project error:", error);
    }
  };

  // ==============================
  // EDIT PROJECT
  // ==============================
  const handleEdit = (project) => {

    setEditingId(project._id);

    setForm({
      title: project.title,
      description: project.description,
      members: project.members
        ?.map((m) => m.name || m.email || m)
        .join(", "),
    });

    // SCROLL TOP
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>

        <Sidebar />

        <div style={styles.main}>

          <h1 style={styles.heading}>
            📁 Projects
          </h1>

          {/* ==============================
              FORM
          ================================= */}
          <form
            onSubmit={handleSubmit}
            style={styles.form}
          >

            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
              style={styles.textarea}
            />

            <textarea
              name="members"
              placeholder="Members emails separated by commas"
              value={form.members}
              onChange={handleChange}
              style={styles.textarea}
            />

            <button
              type="submit"
              style={styles.button}
            >
              {editingId
                ? "Update Project"
                : "Create Project"}
            </button>

          </form>

          {/* ==============================
              PROJECT LIST
          ================================= */}
          <div style={styles.projectList}>

            {projects.length === 0 ? (
              <p>No projects found</p>
            ) : (
              projects.map((project) => (

                <div
                  key={project._id}
                  style={styles.projectCard}
                >

                  <h3>{project.title}</h3>

                  <p>
                    {project.description}
                  </p>

                  {/* MEMBERS */}
                  <div style={styles.members}>
                    👥 Members:
                    {project.members?.length > 0 ? (
                      project.members.map((m, index) => (
                        <span
                          key={m._id || index}
                          style={styles.memberTag}
                        >
                          {m.name || m.email}
                        </span>
                      ))
                    ) : (
                      <span> No members</span>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div style={styles.actions}>

                    <button
                      onClick={() =>
                        handleEdit(project)
                      }
                      style={styles.editBtn}
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(project._id)
                      }
                      style={styles.deleteBtn}
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default ProjectPage;

/* ==============================
   STYLES
================================= */

const styles = {
  container: {
    display: "flex",
  },

  main: {
    flex: 1,
    padding: "25px",
    background: "var(--bg)",
    minHeight: "100vh",
    color: "var(--text)",
  },

  heading: {
    marginBottom: "20px",
  },

  form: {
    background: "var(--card)",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "30px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
  },

  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    minHeight: "100px",
  },

  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  projectList: {
    display: "grid",
    gap: "20px",
  },

  projectCard: {
    background: "var(--card)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },

  members: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  memberTag: {
    background: "#2563eb",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    color: "white",
  },

  actions: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },

  editBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#f59e0b",
    color: "white",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
};