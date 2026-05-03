import AppRoutes from "./routes";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import socket from "./socket";

function App() {
  const { loading, user } = useContext(AuthContext);

  // 🔥 Register user with socket (REAL-TIME)
  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user._id);
    }
  }, [user]);

  // ⏳ Prevent rendering before auth loads
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return <AppRoutes />;
}

export default App;