import { useEffect, useState } from "react";
import socket from "../socket";
import API from "../api/axios";

const Chat = ({ projectId, user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Load old messages
  useEffect(() => {
    const loadMessages = async () => {
      const res = await API.get(`/api/messages/${projectId}`);
      setMessages(res.data);
    };
    loadMessages();
  }, [projectId]);

  // Join room
  useEffect(() => {
    socket.emit("joinProject", projectId);
  }, [projectId]);

  // Listen for messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  // Send message
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      senderId: user._id,
      projectId,
      content: text,
    });

    setText("");
  };

  return (
    <div>
      <h3>💬 Project Chat</h3>

      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((m) => (
          <div key={m._id}>
            <strong>{m.sender?.name}:</strong> {m.content}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;