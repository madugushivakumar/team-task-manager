import { useEffect, useState } from "react";
import socket from "../socket";
import API from "../api/axios";

const Chat = ({ projectId, user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ==============================
  // LOAD OLD MESSAGES
  // ==============================
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await API.get(`/messages/${projectId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Load messages error:", error);
      }
    };

    if (projectId) {
      loadMessages();
    }
  }, [projectId]);

  // ==============================
  // JOIN ROOM
  // ==============================
  useEffect(() => {
    if (projectId) {
      socket.emit("joinProject", projectId);
    }
  }, [projectId]);

  // ==============================
  // RECEIVE MESSAGES
  // ==============================
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  // ==============================
  // SEND MESSAGE
  // ==============================
  const sendMessage = () => {

  if (!text.trim()) return;

  // ✅ USER SAFETY CHECK
  if (!user || !user._id) {
    console.error("User not found");
    return;
  }

  socket.emit("sendMessage", {
    senderId: user._id,
    projectId,
    content: text,
  });

  setText("");
};

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>💬 Project Chat</h3>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((m) => (
         <div
  key={m._id}
  style={{
    ...styles.message,

    alignSelf:
      m.sender?._id === user?._id
        ? "flex-end"
        : "flex-start",

    background:
      m.sender?._id === user?._id
        ? "#2563eb"
        : "#1e293b",
  }}
>
  <strong>
    {m.sender?.name}
  </strong>

  <p style={{ marginTop: "5px" }}>
    {m.content}
  </p>
</div>
        ))}
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          style={styles.input}
        />

        <button
  onClick={sendMessage}
  style={styles.button}
  disabled={!user}
>
  Send
</button>
      </div>
    </div>
  );
};

export default Chat;

/* ==============================
   STYLES
================================= */

const styles = {
  container: {
    marginTop: "30px",
    background: "var(--card)",
    padding: "20px",
    borderRadius: "10px",
  },

  heading: {
    marginBottom: "15px",
  },

 messages: {
  maxHeight: "400px",
  overflowY: "auto",
  background: "#0f172a",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "15px",

  display: "flex",
  flexDirection: "column",
  gap: "10px",
},

 message: {
  padding: "12px",
  borderRadius: "12px",
  color: "white",
  maxWidth: "70%",
  wordBreak: "break-word",
},

  inputContainer: {
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #334155",
  },

  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
};
