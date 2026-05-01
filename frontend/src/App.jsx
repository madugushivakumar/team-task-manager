import AppRoutes from "./routes";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { loading } = useContext(AuthContext);

  // ⏳ Prevent rendering before auth loads
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return <AppRoutes />;
}

export default App;