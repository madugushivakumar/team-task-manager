import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} style={styles.btn}>
      🌗
    </button>
  );
};

export default ThemeToggle;

const styles = {
  btn: {
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};