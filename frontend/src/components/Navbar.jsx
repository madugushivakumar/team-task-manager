import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      {/* Left Section */}
      <div style={styles.logo}>
        <Link to="/dashboard" style={styles.link}>
          TeamTask 🚀
        </Link>
      </div>

      {/* Right Section */}
      <div style={styles.right}>
        {user ? (
          <>
            <span style={styles.user}>
              👤 {user.name} ({user.role})
            </span>

            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>

            {user.role === "Admin" && (
              <Link to="/projects" style={styles.link}>
                Projects
              </Link>
            )}

            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.link}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

/* ===============================
   STYLES (Keep simple for now)
================================= */

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "#1e293b",
    color: "white",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
  },
  user: {
    fontSize: "14px",
    color: "#cbd5f5",
  },
  logoutBtn: {
    padding: "6px 12px",
    backgroundColor: "#ef4444",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
};