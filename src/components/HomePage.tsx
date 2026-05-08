import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StudentCard from "./StudentCard";
import styles from "./HomePage.module.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estudiantes, setEstudiantes] = useState<any[]>([]);

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    window.onpopstate = () => {
      handleLogout();
    };
  }, []);

  const timeoutRef = useRef<any>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      alert("Sesión expirada por inactividad");
      handleLogout();
    }, 5 * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setBuscado(true);
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/estudiantes/search?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setEstudiantes([]);
        setLoading(false);
        return;
      }

      const adaptado = data.map((item: any) => ({
        documento: item.estudiante.documento,
        nombre: item.estudiante.nombre,
        identificacion: item.estudiante.documento,
        tipoId: "CC",

        usuario: item.estudiante.usuario,

        correo: item.estudiante.correo,
        telefono: item.estudiante.telefono,

        foto: item.estudiante.foto
          ? `${API_URL}/uploads/${item.estudiante.foto}`
          : null,

        programas: item.programas.map((p: any) => ({
          nombre: p.nombre,
          estudiantePensum: p.estudiantePensum,

          jornada: p.jornada,
          categoria: p.categoria,
          situacion: p.situacion,

          liquidaciones: p.liquidaciones.map((l: any) => ({
            anio: l.anio,
            periodo: l.periodo,
            estado: l.estado,
            saldo: l.saldo,
            referencia: l.referencia,
          })),
        })),
      }));

      setEstudiantes(adaptado);
    } catch (error) {
      console.error(error);
      setEstudiantes([]);
    }

    setLoading(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setQuery("");
    setBuscado(false);
    setEstudiantes([]);
  };

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <span className={styles.navLogoIcon}>▪</span>
          <span className={styles.navLogoText}>WSUP</span>
        </div>

        <button
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </nav>

      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Consulta de Estudiantes
          </h1>

          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Busca según nombre, código, usuario o programa"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={handleSearch}
              className={styles.searchBtn}
            >
              Buscar
            </button>

            {query && (
              <button
                onClick={handleClear}
                className={styles.clearBtn}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {loading && (
          <p className={styles.loading}>
            Cargando...
          </p>
        )}

        {buscado && !loading && estudiantes.length === 0 && (
          <p className={styles.empty}>
            No encontrado
          </p>
        )}

        {estudiantes.length > 0 && (
          <div className={styles.grid}>
            {estudiantes.map((est) => (
              <StudentCard
                key={est.documento}
                estudiante={est}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}