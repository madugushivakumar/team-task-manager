import { useState } from "react";
import API from "../api/axios";

const TaskCard = ({ task, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      setLoading(true);

      const res = await API.put(`/tasks/${task._id}`, {
        status: newStatus,
      });

      // update parent state
      onUpdate(res.data);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 overdue logic
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed";

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{task.title}</h3>

      <p style={styles.desc}>{task.description}</p>

      <div style={styles.row}>
        <span style={styles.label}>
          📌 Status:
        </span>

        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={loading}
          style={styles.select}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>👤 Assigned:</span>
        <span>{task.assignedTo?.name || "N/A"}</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>📅 Due:</span>
        <span>
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No date"}
        </span>
      </div>

      {/* 🔥 Overdue indicator */}
      {isOverdue && <p style={styles.overdue}>⚠ Overdue</p>}
    </div>
  );
};

export default TaskCard;

/* ===============================
   STYLES
================================= */

const styles = {
  card: {
    backgroundColor: "#1e293b",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "18px",
  },
  desc: {
    fontSize: "14px",
    color: "#cbd5f5",
    marginBottom: "10px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    fontSize: "14px",
  },
  label: {
    color: "#94a3b8",
  },
  select: {
    padding: "4px",
    borderRadius: "5px",
    border: "none",
  },
  overdue: {
    marginTop: "10px",
    color: "#ef4444",
    fontWeight: "bold",
  },
};