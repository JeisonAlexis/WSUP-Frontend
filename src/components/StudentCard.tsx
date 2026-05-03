import { useState } from "react";
import type { Estudiante } from "../types/student";
import styles from "./StudentCard.module.css";

interface Props {
  estudiante: Estudiante;
}

function formatSaldo(saldo: number) {
  return saldo.toLocaleString("es-CO", { minimumFractionDigits: 2 });
}

export default function StudentCard({ estudiante }: Props) {
  const [expanded, setExpanded] = useState(false);

  const totalPendiente = estudiante.programas
    .flatMap((p) => p.liquidaciones)
    .filter((l) => l.estado === "PENDIENTE")
    .reduce((acc, l) => acc + l.saldo, 0);

  const totalLiquidaciones = estudiante.programas
    .flatMap((p) => p.liquidaciones).length;

  const hayPendientes = totalPendiente > 0;

  const palabras = estudiante.nombre.split(" ");
  const iniciales =
    palabras.length >= 2
      ? palabras[0][0] + palabras[1][0]
      : palabras[0].slice(0, 2);

  return (
    <div className={`${styles.card} ${hayPendientes ? styles.cardAlert : ""}`}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <div className={`${styles.avatar} ${hayPendientes ? styles.avatarAlert : ""}`}>
          {iniciales}
        </div>

        <div className={styles.headerInfo}>
          <h3 className={styles.nombre}>{estudiante.nombre}</h3>

          <div className={styles.docRow}>
            <span className={styles.docBadge}>{estudiante.tipoId}</span>
            <span className={styles.docNum}>{estudiante.identificacion}</span>
          </div>
          
          {/* usuario */}
          {estudiante.usuario && (
            <div className={styles.userRow}>
              <span className={styles.userLabel}>Usuario:</span>
              <span className={styles.userValue}>
                {estudiante.usuario}
              </span>
            </div>
          )}
        </div>

        {hayPendientes && (
          <div className={styles.alertBadge}>
            <span className={styles.alertDot} />
            Saldo pendiente
          </div>
        )}
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{estudiante.programas.length}</span>
          <span className={styles.statLabel}>
            {estudiante.programas.length === 1 ? "Programa" : "Programas"}
          </span>
        </div>

        <div className={styles.statDivider} />

        <div className={styles.stat}>
          <span className={styles.statValue}>{totalLiquidaciones}</span>
          <span className={styles.statLabel}>Liquidaciones</span>
        </div>

        <div className={styles.statDivider} />

        <div className={`${styles.stat} ${hayPendientes ? styles.statRed : styles.statGreen}`}>
          <span className={styles.statValue}>
            {hayPendientes ? `$${formatSaldo(totalPendiente)}` : "$0,00"}
          </span>
          <span className={styles.statLabel}>Saldo total</span>
        </div>
      </div>

      {/* BODY */}
      {expanded && (
        <div className={styles.body}>
          {estudiante.programas.length === 0 ? (
            <p className={styles.emptyFilter}>Sin programas registrados</p>
          ) : (
            estudiante.programas.map((prog, pi) => (
              <div key={pi} className={styles.programa}>
                <div className={styles.programaHeader}>
                  <div className={styles.programaIcon}>🎓</div>

                  <div>
                    <p className={styles.programaNombre}>{prog.nombre}</p>

                    <p className={styles.programaPensum}>
                      Pensum {prog.estudiantePensum}
                    </p>

                    {/* 🔥 NUEVOS CAMPOS */}
                    <p className={styles.programaExtra}>
                      {prog.jornada || "—"} · {prog.categoria || "—"} · {prog.situacion || "—"}
                    </p>
                  </div>

                  <span className={styles.liqCount}>
                    {prog.liquidaciones.length} registro
                    {prog.liquidaciones.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className={styles.liquidaciones}>
                  {prog.liquidaciones.length === 0 ? (
                    <p className={styles.emptyFilter}>
                      Sin liquidaciones
                    </p>
                  ) : (
                    prog.liquidaciones.map((liq, li) => (
                      <div
                        key={li}
                        className={`${styles.liqRow} ${
                          liq.estado === "PENDIENTE"
                            ? styles.liqPendiente
                            : styles.liqPagado
                        }`}
                      >
                        <div className={styles.liqLeft}>
                          <span
                            className={`${styles.estadoBadge} ${
                              liq.estado === "PENDIENTE"
                                ? styles.estadoPendiente
                                : styles.estadoPagado
                            }`}
                          >
                            {liq.estado === "PAGADO" ? "✓" : "!"} {liq.estado}
                          </span>

                          <span className={styles.liqPeriodo}>
                            {liq.anio} – P{liq.periodo}
                          </span>
                        </div>

                        <div className={styles.liqRight}>
                          <span
                            className={`${styles.liqSaldo} ${
                              liq.saldo > 0
                                ? styles.saldoRed
                                : styles.saldoGreen
                            }`}
                          >
                            ${formatSaldo(liq.saldo)}
                          </span>

                          <span className={styles.liqRef}>
                            {liq.referencia}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TOGGLE */}
      <button
        className={styles.toggleBtn}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded
          ? "Ocultar detalle"
          : `Ver detalle · ${totalLiquidaciones} liquidaciones`}
        <span
          className={`${styles.chevron} ${
            expanded ? styles.chevronUp : ""
          }`}
        >
          ›
        </span>
      </button>
    </div>
  );
}