export type LiquidacionEstado = "PAGADO" | "PENDIENTE";

export interface Liquidacion {
  id: number;
  anio: number;
  periodo: number;
  estado: LiquidacionEstado;
  saldo: number;
  referencia: string;
  codigo: number;
}

export interface Programa {
  nombre: string;
  estudiantePensum: number;
  liquidaciones: Liquidacion[];
}

export interface Estudiante {
  documento: string;
  nombre: string;
  identificacion: string;
  tipoId: string;
  usuario?: string;
  programas: Programa[];
}


