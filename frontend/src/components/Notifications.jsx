import { useEffect, useState } from "react";
import socket from "../socket";
import API from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Load existing
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/api/notifications");
      setNotifications(res.data);
    };
    fetchData();
  }, []);

  // 🔥 REAL-TIME LISTENER
  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [
        { message: data.message, createdAt: new Date() },
        ...prev,
      ]);
    });

    return () => socket.off("notification");
  }, []);

  return (
    <div>
      <h3>🔔 Notifications</h3>
      {notifications.map((n, i) => (
        <div key={i}>
          <p>{n.message}</p>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Notifications;