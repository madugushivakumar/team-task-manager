import { useEffect, useState } from "react";
import API from "../api/axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import SkeletonLoader from "../components/SkeletonLoader";
import Chat from "../components/Chat";

// ==============================
// GET USER
// ==============================
const user =
  JSON.parse(localStorage.getItem("user")) || null;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH TASKS
  // ==============================
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

  // ==============================
  // STATS
  // ==============================
  const total = tasks.length;

  const completed = tasks.filter(
    (t) => t.status === "Completed"
  ).length;

  const pending = tasks.filter(
    (t) => t.status === "Pending"
  ).length;

  const inProgress = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;

  const overdue = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "Completed"
  ).length;

  // ==============================
  // PROGRESS %
  // ==============================
  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  // ==============================
  // UPDATE TASK
  // ==============================
  const handleUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === updatedTask._id
          ? updatedTask
          : t
      )
    );
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <div style={styles.container}>
        
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div style={styles.main}>
          
          <h2 style={styles.heading}>
            📊 Dashboard
          </h2>

          {/* ==============================
              LOADING
          ================================= */}
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              {/* ==============================
                  STATS CARDS
              ================================= */}
              <div style={styles.statsContainer}>

                <div style={styles.card}>
                  📊 Total Tasks: {total}
                </div>

                <div style={styles.card}>
                  ✅ Completed: {completed}
                </div>

                <div style={styles.card}>
                  ⏳ Pending: {pending}
                </div>

                <div style={styles.card}>
                  🚧 In Progress: {inProgress}
                </div>

                <div style={styles.overdueCard}>
                  ⚠ Overdue: {overdue}
                </div>

              </div>

              {/* ==============================
                  PROGRESS BAR
              ================================= */}
              <div style={styles.progressSection}>

                <h3>📈 Project Progress</h3>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p style={styles.progressText}>
                  {progress}% completed
                </p>

              </div>

              {/* ==============================
                  TASK LIST
              ================================= */}
              <h3 style={styles.subheading}>
                📋 Your Tasks
              </h3>

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

              {/* ==============================
                  REAL-TIME PROJECT CHAT
              ================================= */}
              {tasks.length > 0 && (
                <Chat
                  projectId={
                    tasks[0]?.projectId?._id ||
                    tasks[0]?.projectId
                  }
                  user={user}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

/* ==============================
   STYLES
================================= */

const styles = {
  container: {
    display: "flex",
  },

  main: {
    flex: 1,
    padding: "20px",
    background: "var(--bg)",
    minHeight: "100vh",
    color: "var(--text)",
    transition: "0.3s",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "bold",
  },

  subheading: {
    marginTop: "30px",
    marginBottom: "15px",
    fontSize: "22px",
  },

  // ==============================
  // STATS
  // ==============================
  statsContainer: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  card: {
    background: "var(--card)",
    padding: "15px",
    borderRadius: "12px",
    minWidth: "180px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    transition: "0.3s",
  },

  overdueCard: {
    background: "#7f1d1d",
    padding: "15px",
    borderRadius: "12px",
    minWidth: "180px",
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },

  // ==============================
  // PROGRESS
  // ==============================
  progressSection: {
    marginTop: "30px",
    background: "var(--card)",
    padding: "20px",
    borderRadius: "12px",
  },

  progressBar: {
    height: "22px",
    background: "#334155",
    borderRadius: "999px",
    overflow: "hidden",
    marginTop: "12px",
  },

  progressFill: {
    height: "100%",
    background: "#22c55e",
    borderRadius: "999px",
    transition: "width 0.5s ease",
  },

  progressText: {
    marginTop: "10px",
    fontWeight: "bold",
  },
};