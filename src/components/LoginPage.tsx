import { useState } from "react";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      if (remember) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      navigate("/home");

    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ── LEFT PANEL ── */}
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoIcon} aria-hidden="true">▪</span>
          <span className={styles.logoText}>WSUP</span>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.heading}>
            Holla,<br />Welcome Back
          </h1>
          <p className={styles.subheading}>
            Hey, welcome back to your special place
          </p>
        </div>

        {/* FORM */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <input
              type="text"
              className={styles.input}
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className={styles.row}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className={styles.checkboxHidden}
              />
              Recordarme
            </label>
          </div>

          <button
            type="submit"
            className={styles.signIn}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={styles.right}>
        <img
          src="/login.webp"
          alt="Fingerprint auth illustration"
          className={styles.illustration}
        />

        {/* Nubes decorativas */}
        <div className={`${styles.cloud} ${styles.cloudTL}`} />
        <div className={`${styles.cloud} ${styles.cloudTR}`} />
        <div className={`${styles.cloud} ${styles.cloudBL}`} />
        <div className={`${styles.cloud} ${styles.cloudBR}`} />
      </div>
    </div>
  );
}