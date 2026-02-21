/**
 * Tipos principales para el Dashboard de Valorant
 * Toda la información se basa en partidas ingresadas manualmente
 */

// ============================================
// PARTIDA MANUAL - Núcleo del sistema
// ============================================

export interface Partida {
  id: string;
  fecha: string;        // YYYY-MM-DD
  hora: string;         // HH:MM
  episodio: string;     // Ej: "9"
  acto: string;         // Ej: "1"
  mapa: string;
  agente: string;
  rol: Rol;
  
  // Rango y resultado
  rangoAntes: string;   // Ej: "Platinum 1"
  trsAntes: number;     // Puntos de rango antes de la partida
  deltaTRS: number;     // Puntos ganados (+) o perdidos (-)
  resultado: 'Victoria' | 'Derrota' | 'Empate';
  
  // Estadísticas de rendimiento
  kills: number;
  deaths: number;
  assists: number;
  acs: number;          // Average Combat Score
  adr: number;          // Average Damage per Round
  ddDelta: number;      // Damage Delta
  kast: number;         // Porcentaje
  hsPorcentaje: number; // Headshot %
  primerasKills: number;
  primerasMuertes: number;
  multiKills: number;   // Total de multi-kills
  ratingEconomico: number;
  
  // Campos calculados (se generan automáticamente)
  kd: number;
  kda: number;
}

// ============================================
// ESTADÍSTICAS AGREGADAS
// ============================================

export interface EstadisticasAgregadas {
  // Totales
  totalPartidas: number;
  victorias: number;
  derrotas: number;
  empates: number;
  
  // Promedios generales
  promedioKDA: number;
  promedioACS: number;
  promedioADR: number;
  promedioDDDelta: number;
  promedioKAST: number;
  promedioHS: number;
  promedioMultiKills: number;
  
  // Ratios
  winrateGeneral: number;
  ratioPrimerasKillsMuertes: number;
  
  // Por mapa
  porMapa: Record<string, {
    partidas: number;
    victorias: number;
    winrate: number;
    kdaPromedio: number;
  }>;
  
  // Por agente
  porAgente: Record<string, {
    partidas: number;
    victorias: number;
    winrate: number;
    kdaPromedio: number;
    acsPromedio: number;
  }>;
  
  // Por rol
  porRol: Record<string, {
    partidas: number;
    victorias: number;
    winrate: number;
    kdaPromedio: number;
  }>;
  
  // Por franja horaria
  porHorario: {
    manana: { partidas: number; winrate: number; kda: number };
    tarde: { partidas: number; winrate: number; kda: number };
    noche: { partidas: number; winrate: number; kda: number };
    madrugada: { partidas: number; winrate: number; kda: number };
  };
  
  // Tendencia (últimas partidas)
  tendenciaTRS: number[];
  tendenciaKDA: number[];
}

// ============================================
// PERFIL DEL JUGADOR (configurable manualmente)
// ============================================

export interface PerfilJugador {
  riotId: string;
  tag: string;
  region: string;
  meta: {
    rangoObjetivo: string;
    plazo: string;
    agentesFoco: string[];
    rolPrincipal: string;
  };
}

// ============================================
// AGENTES Y MAPAS
// ============================================

export type Rol = 'Duelista' | 'Centinela' | 'Iniciador' | 'Smokes';

export interface Agente {
  nombre: string;
  rol: Rol;
  color: string;
}

export interface Mapa {
  nombre: string;
  sites: string[];
  activo: boolean;
}

// ============================================
// PLAN DE ENTRENAMIENTO
// ============================================

export interface TareaEntrenamiento {
  id: string;
  nombre: string;
  categoria: 'aim' | 'range' | 'dm' | 'mental' | 'review';
  duracion: number;
  completada: boolean;
  descripcion: string;
}

export interface DiaEntrenamiento {
  fecha: string;
  tareas: TareaEntrenamiento[];
  tiempoTotal: number;
  tiempoCompletado: number;
  notas: string;
}

// ============================================
// MENTAL Y JOURNAL
// ============================================

export interface SesionMental {
  id: string;
  fecha: string;
  nivelTilt: number;
  trollsPercibidos: number;
  smurfsPercibidos: number;
  estadoAnimo: 'excelente' | 'bueno' | 'neutral' | 'malo' | 'terrible';
  duracionSesion: number;
  partidasJugadas: number;
  victorias: number;
  derrotas: number;
  notas: string;
}

// ============================================
// CHECKLIST PRE-GAME
// ============================================

export interface ItemChecklist {
  id: string;
  texto: string;
  categoria: ChecklistCategory;
  completado: boolean;
  orden: number;
}

export type ChecklistCategory = 'warmup' | 'tech' | 'mental' | 'config';

// ============================================
// CONFIGURACIÓN DE RED
// ============================================

export interface ConfiguracionRed {
  bogota: DatosPing;
  miami: DatosPing;
  tipoConexion: 'ethernet' | 'wifi';
}

export interface DatosPing {
  promedio: number;
  minimo: number;
  maximo: number;
  perdidaPaquetes: number;
  jitter: number;
  ultimaPrueba: string;
}

// ============================================
// INSIGHTS Y ANÁLISIS
// ============================================

export interface Insight {
  id: string;
  tipo: 'fortaleza' | 'debilidad' | 'oportunidad' | 'alerta';
  categoria: string;
  mensaje: string;
  recomendacion: string;
  prioridad: number;
}

// ============================================
// DATOS PARA GRÁFICAS
// ============================================

export interface DatoGrafica {
  etiqueta: string;
  valor: number;
  color?: string;
}

// ============================================
// CONSTANTES DE UMBRALES (thresholds)
// ============================================

export interface Umbrales {
  kda: { excelente: number; bueno: number; regular: number };
  acs: { excelente: number; bueno: number; regular: number };
  hs: { excelente: number; bueno: number; regular: number };
  kast: { excelente: number; bueno: number; regular: number };
  winrate: { excelente: number; bueno: number; regular: number };
}
