import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import ThemeToggle from "../components/ThemeToggle";
import ParticleBg from "../components/ParticleBg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Home = () => {
  return (
    <div style={styles.container}>
      
      {/* NAVBAR */}
      <div style={styles.nav}>
        <h2>🚀 Team Task Manager</h2>
        <div>
             <ThemeToggle />
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/signup" style={styles.button}>Get Started</Link>
        </div>
      </div>

      {/* HERO */}
      <ParticleBg />
      <motion.div 
        style={styles.hero}
        initial="hidden"
        animate="show"
        variants={fadeUp}
      >
        <h1 style={styles.heroTitle}>
          Manage Work Like a Pro 🚀
        </h1>

        <p style={styles.heroText}>
          Collaborate, assign tasks, track progress and boost productivity —
          all in one modern platform.
        </p>

        <div style={styles.heroButtons}>
          <Link to="/signup" style={styles.ctaPrimary}>
            Start Free 🚀
          </Link>

          <Link to="/login" style={styles.ctaSecondary}>
            Login
          </Link>
        </div>
      </motion.div>

      {/* FEATURES */}
      <div style={styles.features}>
        {[
          "📁 Project Management",
          "✅ Task Tracking",
          "💬 Team Chat",
          "🔔 Notifications"
        ].map((item, i) => (
          <motion.div
            key={i}
            style={styles.card}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3>{item}</h3>
            <p>Powerful and simple to use.</p>
          </motion.div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <motion.div 
        style={styles.section}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2>How It Works</h2>

        <div style={styles.grid}>
          <div>1️⃣ Signup</div>
          <div>2️⃣ Create Project</div>
          <div>3️⃣ Assign Tasks</div>
          <div>4️⃣ Track Progress</div>
        </div>
      </motion.div>

      {/* TESTIMONIALS */}
      <motion.div 
        style={styles.sectionDark}
        initial="hidden"
        whileInView="show"
        variants={fadeUp}
      >
        <h2>What Users Say</h2>

        <div style={styles.testimonials}>
          <div style={styles.testimonialCard}>
            ⭐⭐⭐⭐⭐
            <p>"This app improved our workflow!"</p>
          </div>

          <div style={styles.testimonialCard}>
            ⭐⭐⭐⭐⭐
            <p>"Best team task manager ever."</p>
          </div>

          <div style={styles.testimonialCard}>
            ⭐⭐⭐⭐⭐
            <p>"Clean UI and powerful features."</p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div 
        style={styles.ctaSection}
        initial="hidden"
        whileInView="show"
        variants={fadeUp}
      >
        <h2>Ready to boost productivity?</h2>

        <Link to="/signup" style={styles.ctaBig}>
          Get Started Now 🚀
        </Link>
      </motion.div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>© 2026 Team Task Manager</p>
      </div>
    </div>
  );
};

export default Home;

// ======================
// STYLES (UPGRADED UI)
// ======================

const styles = {
  container: {
    fontFamily: "sans-serif",
    background: "linear-gradient(to bottom, #020617, #020617)",
    color: "white",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    background: "rgba(15,23,42,0.8)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
  },

  link: {
    marginRight: "15px",
    color: "#cbd5f5",
    textDecoration: "none",
  },
  

  button: {
    background: "linear-gradient(45deg,#2563eb,#3b82f6)",
    padding: "8px 15px",
    borderRadius: "6px",
    color: "white",
    textDecoration: "none",
  },

  hero: {
    textAlign: "center",
    padding: "100px 20px",
  },

  heroTitle: {
    fontSize: "48px",
    fontWeight: "bold",
  },

  heroText: {
    marginTop: "15px",
    fontSize: "18px",
    opacity: 0.8,
  },

  heroButtons: {
    marginTop: "25px",
  },

  ctaPrimary: {
    padding: "12px 25px",
    background: "linear-gradient(45deg,#22c55e,#16a34a)",
    borderRadius: "8px",
    color: "white",
    marginRight: "10px",
    textDecoration: "none",
  },

  ctaSecondary: {
    padding: "12px 25px",
    border: "1px solid white",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    padding: "40px",
  },
container: {
  background: "var(--bg)",
  color: "var(--text)",
},
  card: {
    background: "rgba(30,41,59,0.6)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    transition: "0.3s",
  },

  section: {
    padding: "60px 20px",
    textAlign: "center",
  },

  sectionDark: {
    padding: "60px 20px",
    background: "#0f172a",
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  testimonials: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  testimonialCard: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
  },

  ctaSection: {
    textAlign: "center",
    padding: "80px 20px",
  },

  ctaBig: {
    marginTop: "20px",
    display: "inline-block",
    padding: "15px 30px",
    background: "#22c55e",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },

  footer: {
    textAlign: "center",
    padding: "20px",
    background: "#0f172a",
  },
  
};