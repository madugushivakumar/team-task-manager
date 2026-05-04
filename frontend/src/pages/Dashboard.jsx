import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import SkeletonLoader from "../components/SkeletonLoader";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔥 Stats calculation
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;

  const overdue = tasks.filter(
    t =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "Completed"
  ).length;

  // 🔥 Progress %
  const progress =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  // Handle task update
  const handleUpdate = (updatedTask) => {
    setTasks(prev =>
      prev.map(t => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <Sidebar />

        <div style={styles.main}>
          <h2 style={styles.heading}>📊 Dashboard</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* 🔥 Stats Cards */}
              <div style={styles.statsContainer}>
                <div style={styles.card}>📊 Total: {total}</div>
                <div style={styles.card}>✅ Completed: {completed}</div>
                <div style={styles.card}>⏳ Pending: {pending}</div>
                <div style={styles.card}>🚧 In Progress: {inProgress}</div>
                <div style={styles.overdueCard}>⚠ Overdue: {overdue}</div>
              </div>

              {/* 🔥 Progress Bar */}
              <div style={styles.progressSection}>
                <h3>Project Progress</h3>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${progress}%`,
                    }}
                  />
                </div>
                <p>{progress}% completed</p>
              </div>

              {/* Task List */}
              <h3 style={styles.subheading}>Your Tasks</h3>

              {tasks.length === 0 ? (
                <p>No tasks found</p>
              ) : (
                tasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdate={handleUpdate}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

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
  heading: {
    marginBottom: "20px",
  },
  subheading: {
    marginTop: "20px",
    marginBottom: "10px",
  },
  statsContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "12px",
    borderRadius: "8px",
    minWidth: "150px",
  },
  overdueCard: {
    backgroundColor: "#7f1d1d",
    padding: "12px",
    borderRadius: "8px",
    minWidth: "150px",
  },

  // 🔥 NEW STYLES
  progressSection: {
    marginTop: "25px",
  },
  progressBar: {
    height: "20px",
    backgroundColor: "#334155",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "10px",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
};