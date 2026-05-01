import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import TaskPage from "./pages/TaskPage";

// ==============================
// 🔐 PROTECTED ROUTE COMPONENT
// ==============================
const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // Role check (if provided)
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// ==============================
// ROUTES
// ==============================
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Admin Only */}
      <Route
        path="/projects"
        element={
          <PrivateRoute role="Admin">
            <ProjectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/projects/:id/tasks"
        element={
          <PrivateRoute>
            <TaskPage />
          </PrivateRoute>
        }
      />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;