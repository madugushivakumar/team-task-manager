// ==============================
// FORMAT DATE
// ==============================
export const formatDate = (date) => {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ==============================
// CHECK IF TASK IS OVERDUE
// ==============================
export const isOverdue = (task) => {
  if (!task?.dueDate) return false;

  return (
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed"
  );
};

// ==============================
// GET STATUS COLOR
// ==============================
export const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "#22c55e"; // green
    case "In Progress":
      return "#f59e0b"; // yellow
    case "Pending":
      return "#ef4444"; // red
    default:
      return "#94a3b8";
  }
};

// ==============================
// CAPITALIZE TEXT
// ==============================
export const capitalize = (text) => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
};

// ==============================
// TRUNCATE TEXT
// ==============================
export const truncate = (text, length = 50) => {
  if (!text) return "";

  return text.length > length
    ? text.substring(0, length) + "..."
    : text;
};