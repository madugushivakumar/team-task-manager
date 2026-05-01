import { createContext, useEffect, useState } from "react";

// Create Context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // LOAD USER FROM LOCAL STORAGE
  // ============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode JWT (basic)
        const payload = JSON.parse(atob(token.split(".")[1]));

        setUser({
          _id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        });
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  // ============================
  // LOGIN FUNCTION
  // ============================
  const login = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  // ============================
  // LOGOUT FUNCTION
  // ============================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};