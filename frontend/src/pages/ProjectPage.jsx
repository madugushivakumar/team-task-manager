import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProjectPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    teamMembers: [],
  });

  const [loading, setLoading] = useState(false);

  // =============================
  // FETCH DATA
  // =============================
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // =============================
  // HANDLE FORM
  // =============================
  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;

    if (name === "teamMembers") {
      const values = Array.from(selectedOptions, (opt) => opt.value);
      setForm({ ...form, teamMembers: values });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/projects", form);

      setProjects((prev) => [...prev, res.data]);

      setForm({
        title: "",
        description: "",
        teamMembers: [],
      });
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // DELETE PROJECT
  // =============================
  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  // =============================
  // NAVIGATE TO TASKS
  // =============================
  const handleSelect = (project) => {
    navigate(`/projects/${project._id}/tasks`);
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <Sidebar />

        <div style={styles.main}>
          <h2>Projects</h2>

          {/* =============================
              CREATE PROJECT (ADMIN ONLY)
          ============================= */}
          {user?.role === "Admin" && (
            <form onSubmit={handleCreate} style={styles.form}>
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={form.title}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
                style={styles.input}
              />

              {/* Multi Select Users */}
              <select
                name="teamMembers"
                multiple
                onChange={handleChange}
                style={styles.select}
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Project"}
              </button>
            </form>
          )}

          {/* =============================
              PROJECT LIST
          ============================= */}
          {projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDelete}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectPage;

/* ===============================
   STYLES
================================= */

const styles = {
  container: {
    display: "flex",
  },
  main: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#020617",
    minHeight: "100vh",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    backgroundColor: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "none",
  },
  select: {
    padding: "8px",
    borderRadius: "5px",
  },
};