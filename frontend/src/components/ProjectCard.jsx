import { useState } from "react";
import API from "../api/axios";

const ProjectCard = ({ project, onDelete, onSelect }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await API.delete(`/projects/${project._id}`);

      onDelete(project._id);
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{project.title}</h3>

        <button
          onClick={handleDelete}
          style={styles.deleteBtn}
          disabled={loading}
        >
          🗑
        </button>
      </div>

      {/* Description */}
      <p style={styles.desc}>{project.description}</p>

      {/* Team Members */}
      <div style={styles.section}>
        <span style={styles.label}>👥 Team:</span>
        <div style={styles.members}>
          {project.teamMembers?.length > 0 ? (
            project.teamMembers.map((member) => (
              <span key={member._id} style={styles.member}>
                {member.name}
              </span>
            ))
          ) : (
            <span>No members</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.created}>
          Created by: {project.createdBy?.name || "Unknown"}
        </span>

        <button
          style={styles.viewBtn}
          onClick={() => onSelect(project)}
        >
          View Tasks →
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;

/* ===============================
   STYLES
================================= */

const styles = {
  card: {
    backgroundColor: "#1e293b",
    color: "white",
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "16px",
  },
  desc: {
    fontSize: "14px",
    color: "#cbd5f5",
    margin: "10px 0",
  },
  section: {
    marginBottom: "10px",
  },
  label: {
    fontSize: "13px",
    color: "#94a3b8",
  },
  members: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "5px",
  },
  member: {
    backgroundColor: "#334155",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  created: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  viewBtn: {
    padding: "6px 10px",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
};