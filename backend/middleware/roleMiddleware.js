// ==============================
// ROLE-BASED ACCESS MIDDLEWARE
// ==============================
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists (from authMiddleware)
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check role
      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied: insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
};

export default roleMiddleware;