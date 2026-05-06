import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // ✅ FIXED (removed /api)
      const res = await API.post("/auth/signup", form);

      // Save token
    // Save token
localStorage.setItem("token", res.data.token);

// ✅ SAVE USER ALSO
localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

// Save user in context
setUser(res.data.user);

      // Redirect
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Signup</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

/* ===============================
   STYLES
================================= */

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "30px",
    borderRadius: "10px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    textAlign: "center",
    color: "white",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
  },
  button: {
    padding: "10px",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  text: {
    fontSize: "13px",
    color: "#cbd5f5",
    textAlign: "center",
  },
  link: {
    color: "#60a5fa",
    textDecoration: "none",
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    textAlign: "center",
  },
};