import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

import {
  FaPaperPlane,
  FaSmile,
  FaPhone,
  FaVideo,
  FaSearch,
  FaPaperclip,
  FaMoon,
  FaSun,
  FaUserPlus,
  FaMicrophone,
} from "react-icons/fa";

import API from "../api/axios";
import socket from "../socket";

const ChatPage = () => {
  // ==============================
  // STATES
  // ==============================

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");
  const [search, setSearch] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  const [showEmoji, setShowEmoji] = useState(false);

  const [teamMembers, setTeamMembers] = useState([]);

  const [newMember, setNewMember] = useState("");

  const [recording, setRecording] = useState(false);

  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // ==============================
  // LOAD MESSAGES
  // ==============================

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await API.get("/messages/global-chat");
        setMessages(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadMessages();
  }, []);

  // ==============================
  // SOCKET EVENTS
  // ==============================

  useEffect(() => {
    socket.emit("joinProject", "global-chat");

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("userTyping", (name) => {
      setTyping(`${name} is typing...`);
    });

    socket.on("userStopTyping", () => {
      setTyping("");
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, []);

  // ==============================
  // AUTO SCROLL
  // ==============================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==============================
  // SEND MESSAGE
  // ==============================

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      senderId: user?._id,
      projectId: "global-chat",
      content: text,
    });

    setText("");
    setShowEmoji(false);
  };

  // ==============================
  // EMOJI
  // ==============================

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  // ==============================
  // FILE UPLOAD
  // ==============================

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await API.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      socket.emit("sendMessage", {
        senderId: user?._id,
        projectId: "global-chat",
        content: res.data.fileUrl,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // ADD TEAM MEMBER
  // ==============================

  const addTeamMember = () => {
    if (!newMember.trim()) return;

    const member = {
      id: Date.now(),
      name: newMember,
    };

    setTeamMembers((prev) => [...prev, member]);

    setNewMember("");
  };

  // ==============================
  // VOICE NOTE
  // ==============================

  const toggleRecording = () => {
    setRecording(!recording);

    setTimeout(() => {
      setRecording(false);
    }, 3000);
  };

  // ==============================
  // FILTER MEMBERS
  // ==============================

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        ...styles.container,

        background: darkMode
          ? "#020617"
          : "#f1f5f9",

        color: darkMode
          ? "white"
          : "#0f172a",
      }}
    >
      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          ...styles.sidebar,

          background: darkMode
            ? "#1e293b"
            : "white",
        }}
      >
        {/* TOP */}

        <div style={styles.sidebarTop}>
          <h2>👥 Team</h2>

          <button
            style={styles.themeBtn}
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </button>
        </div>

        {/* SEARCH */}

        <div style={styles.searchBox}>
          <FaSearch />

          <input
            type="text"
            placeholder="Search member..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.searchInput}
          />
        </div>

        {/* ADD MEMBER */}

        <div style={styles.addMemberBox}>
          <input
            type="text"
            placeholder="Add team member..."
            value={newMember}
            onChange={(e) =>
              setNewMember(e.target.value)
            }
            style={styles.addInput}
          />

          <button
            style={styles.addBtn}
            onClick={addTeamMember}
          >
            <FaUserPlus />
          </button>
        </div>

        {/* MEMBER LIST */}

        <div style={styles.memberList}>
          {filteredMembers.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              No team members added
            </p>
          ) : (
            filteredMembers.map((member) => (
              <motion.div
                whileHover={{
                  scale: 1.03,
                }}
                key={member.id}
                style={styles.memberCard}
              >
                <div>
                  <h3>{member.name}</h3>

                  <p>Online</p>
                </div>

                <div style={styles.onlineDot} />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* ========================= */}
      {/* CHAT SECTION */}
      {/* ========================= */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          ...styles.chatSection,

          background: darkMode
            ? "#1e293b"
            : "white",
        }}
      >
        {/* TOP */}

        <div style={styles.chatTop}>
          <div>
            <h2>💬 Team Chat</h2>

            <p style={{ color: "#94a3b8" }}>
              Real-time collaboration
            </p>
          </div>

          {/* CALL BUTTONS */}

          <div style={styles.callButtons}>
            <button style={styles.iconBtn}>
              <FaPhone />
            </button>

            <button style={styles.iconBtn}>
              <FaVideo />
            </button>
          </div>
        </div>

        {/* CHAT AREA */}

        <div style={styles.messages}>
          {messages.map((msg, index) => (
            <motion.div
              key={msg._id || index}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              style={{
                ...styles.message,

                alignSelf:
                  msg.sender?._id === user?._id
                    ? "flex-end"
                    : "flex-start",

                background:
                  msg.sender?._id === user?._id
                    ? "#2563eb"
                    : "#0f172a",
              }}
            >
              <strong>
                {msg.sender?.name || "User"}
              </strong>

              <p>{msg.content}</p>
            </motion.div>
          ))}

          {/* TYPING */}

          {typing && (
            <p style={styles.typing}>
              {typing}
            </p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* EMOJI */}

        {showEmoji && (
          <div style={styles.emojiBox}>
            <EmojiPicker
              onEmojiClick={onEmojiClick}
            />
          </div>
        )}

        {/* INPUT AREA */}

        <div style={styles.inputContainer}>
          {/* FILE */}

          <label style={styles.attachBtn}>
            <FaPaperclip />

            <input
              type="file"
              hidden
              onChange={handleFileUpload}
            />
          </label>

          {/* EMOJI */}

          <button
            style={styles.attachBtn}
            onClick={() =>
              setShowEmoji(!showEmoji)
            }
          >
            <FaSmile />
          </button>

          {/* VOICE */}

          <button
            style={{
              ...styles.attachBtn,

              background: recording
                ? "#dc2626"
                : "#0f172a",
            }}
            onClick={toggleRecording}
          >
            <FaMicrophone />
          </button>

          {/* INPUT */}

          <input
            type="text"
            placeholder="Type message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);

              socket.emit("typing", {
                projectId: "global-chat",
                user: user?.name,
              });

              setTimeout(() => {
                socket.emit(
                  "stopTyping",
                  {
                    projectId:
                      "global-chat",
                  }
                );
              }, 1000);
            }}
            style={styles.input}
          />

          {/* SEND */}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            style={styles.sendBtn}
          >
            <FaPaperPlane />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPage;

// ======================================
// STYLES
// ======================================

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    height: "100vh",
    padding: "20px",
  },

  sidebar: {
    width: "320px",
    borderRadius: "20px",
    padding: "20px",
    overflow: "hidden",
  },

  sidebarTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  themeBtn: {
    background: "#2563eb",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#0f172a",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "15px",
    color: "white",
  },

  searchInput: {
    background: "transparent",
    border: "none",
    color: "white",
    width: "100%",
    outline: "none",
  },

  addMemberBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  addInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none",
  },

  addBtn: {
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    background: "#22c55e",
    color: "white",
    cursor: "pointer",
  },

  memberList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    overflowY: "auto",
    height: "70vh",
  },

  memberCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f172a",
    padding: "15px",
    borderRadius: "15px",
  },

  onlineDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  chatSection: {
    flex: 1,
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },

  chatTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  callButtons: {
    display: "flex",
    gap: "10px",
  },

  iconBtn: {
    background: "#2563eb",
    border: "none",
    color: "white",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "15px",
    background: "#020617",
    borderRadius: "15px",
  },

  message: {
    maxWidth: "60%",
    padding: "15px",
    borderRadius: "15px",
    color: "white",
  },

  typing: {
    color: "#94a3b8",
    fontStyle: "italic",
  },

  emojiBox: {
    marginTop: "10px",
  },

  inputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
  },

  attachBtn: {
    background: "#0f172a",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    cursor: "pointer",
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none",
  },

  sendBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "14px 18px",
    borderRadius: "12px",
    cursor: "pointer",
  },
};