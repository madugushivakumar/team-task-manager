import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Menu</h2>

      {/* Dashboard */}
      <Link
        to="/dashboard"
        style={{
          ...styles.link,
          ...(isActive("/dashboard") && styles.active),
        }}
      >
        📊 Dashboard
      </Link>

      {/* Admin Only */}
      {user?.role === "Admin" && (
        <>
          <Link
            to="/projects"
            style={{
              ...styles.link,
              ...(isActive("/projects") && styles.active),
            }}
          >
            📁 Projects
          </Link>

          <Link
            to="/tasks"
            style={{
              ...styles.link,
              ...(isActive("/tasks") && styles.active),
            }}
          >
            📝 Manage Tasks
          </Link>
          <Link
      to="/chat"
      style={{
        ...styles.link,
        ...(isActive("/chat") && styles.active),
      }}
    >
      💬 Team Chat
    </Link>

        </>
      )}

      {/* Member */}
      {user?.role === "Member" && (
        <Link
          to="/tasks"
          style={{
            ...styles.link,
            ...(isActive("/tasks") && styles.active),
          }}
        >
          📝 My Tasks
        </Link>
      )}
    </div>
  );
};

export default Sidebar;

/* ===============================
   STYLES
================================= */

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  title: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  link: {
    textDecoration: "none",
    color: "#cbd5f5",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px",
  },
  active: {
    backgroundColor: "#2563eb",
    color: "white",
  },
};