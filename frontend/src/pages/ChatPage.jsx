import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const ChatPage = () => {

  // ==============================
  // STATES
  // ==============================
  const [members, setMembers] = useState([]);

  // ==============================
  // CURRENT USER
  // ==============================
  const user =
    JSON.parse(localStorage.getItem("user")) || null;

  // ==============================
  // LOAD TEAM MEMBERS
  // ==============================
  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const res = await API.get("/users");

        setMembers(res.data);

      } catch (error) {

        console.error(
          "Fetch users error:",
          error
        );
      }
    };

    fetchUsers();

  }, []);

  return (
    <>
      <Navbar />

      <div style={styles.container}>

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN */}
        <div style={styles.main}>

          <h1 style={styles.heading}>
            💬 Team Chat
          </h1>

          <div style={styles.chatLayout}>

            {/* ==============================
                TEAM MEMBERS
            ============================== */}
            <div style={styles.membersBox}>

              <h3 style={styles.memberTitle}>
                👥 Team Members
              </h3>

              {members.length === 0 ? (

                <p>No members found</p>

              ) : (

                members.map((member) => (

                  <div
                    key={member._id}
                    style={styles.memberCard}
                  >

                    <div>

                      <h4 style={styles.memberName}>
                        {member.name}
                      </h4>

                      <p style={styles.memberRole}>
                        {member.role}
                      </p>

                    </div>

                    {/* ONLINE DOT */}
                    <span style={styles.onlineDot}>
                      ●
                    </span>

                  </div>
                ))
              )}

            </div>

            {/* ==============================
                CHAT SECTION
            ============================== */}
            <div style={styles.chatSection}>

              <Chat
                projectId="global-chat"
                user={user}
              />

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default ChatPage;

/* ==================================
   STYLES
================================== */

const styles = {

  container: {
    display: "flex",
  },

  main: {
    flex: 1,
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    padding: "20px",
  },

  heading: {
    marginBottom: "20px",
  },

  chatLayout: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "20px",
  },

  /* ==============================
     MEMBERS
  ============================== */

  membersBox: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "20px",
    height: "80vh",
    overflowY: "auto",
  },

  memberTitle: {
    marginBottom: "15px",
  },

  memberCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f172a",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "12px",
  },

  memberName: {
    margin: 0,
    fontSize: "15px",
  },

  memberRole: {
    margin: "5px 0 0",
    opacity: 0.7,
    fontSize: "12px",
  },

  onlineDot: {
    color: "#22c55e",
    fontSize: "18px",
  },

  /* ==============================
     CHAT
  ============================== */

  chatSection: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "20px",
    height: "80vh",
    display: "flex",
    flexDirection: "column",
  },
};