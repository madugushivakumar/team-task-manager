import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import { AuthContext } from "../context/AuthContext";

const TaskPage = () => {
  const { id } = useParams(); // projectId
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);

  // =============================
  // FETCH DATA
  // =============================
  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks?projectId=${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
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
    fetchTasks();
    fetchUsers();
  }, [id]);

  // =============================
  // HANDLE FORM
  // =============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/tasks", {
        ...form,
        projectId: id,
      });

      setTasks((prev) => [...prev, res.data]);

      setForm({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
      });
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // UPDATE TASK
  // =============================
  const handleUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <Sidebar />

        <div style={styles.main}>
          <h2>Project Tasks</h2>

          {/* =============================
              CREATE TASK (ADMIN ONLY)
          ============================= */}
          {user?.role === "Admin" && (
            <form onSubmit={handleCreate} style={styles.form}>
              <input
                type="text"
                name="title"
                placeholder="Task Title"
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

              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Assign User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                style={styles.input}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Task"}
              </button>
            </form>
          )}

          {/* =============================
              TASK LIST
          ============================= */}
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TaskPage;

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
};