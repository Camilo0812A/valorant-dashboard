/**
 * Constantes y configuración del dashboard
 * Valores de referencia y configuraciones base
 */

import type { Agente, Mapa, Umbrales, PerfilJugador } from '@/types';

// ============================================
// PERFIL DEL JUGADOR (EDITAR AQUÍ)
// ============================================

export const PERFIL_JUGADOR: PerfilJugador = {
  riotId: 'hola0812A',
  tag: 'LAN',
  region: 'LATAM',
  meta: {
    rangoObjetivo: 'Diamond',
    plazo: '6 meses',
    agentesFoco: ['Chamber', 'Jett', 'Omen'],
    rolPrincipal: 'Entry / Support',
  },
};

// ============================================
// AGENTES DISPONIBLES
// ============================================

export const AGENTES: Agente[] = [
  { nombre: 'Chamber', rol: 'Centinela', color: '#D4AF37' },
  { nombre: 'Jett', rol: 'Duelista', color: '#87CEEB' },
  { nombre: 'Omen', rol: 'Smokes', color: '#4B0082' },
  { nombre: 'Sova', rol: 'Iniciador', color: '#1E90FF' },
  { nombre: 'Sage', rol: 'Centinela', color: '#00CED1' },
  { nombre: 'Phoenix', rol: 'Duelista', color: '#FF4500' },
  { nombre: 'Raze', rol: 'Duelista', color: '#FF6347' },
  { nombre: 'Killjoy', rol: 'Centinela', color: '#FFD700' },
  { nombre: 'Cypher', rol: 'Centinela', color: '#708090' },
  { nombre: 'Reyna', rol: 'Duelista', color: '#8B008B' },
  { nombre: 'Breach', rol: 'Iniciador', color: '#FF8C00' },
  { nombre: 'Brimstone', rol: 'Smokes', color: '#8B4513' },
  { nombre: 'Viper', rol: 'Smokes', color: '#00FF7F' },
  { nombre: 'Skye', rol: 'Iniciador', color: '#90EE90' },
  { nombre: 'Yoru', rol: 'Duelista', color: '#4169E1' },
  { nombre: 'Astra', rol: 'Smokes', color: '#9370DB' },
  { nombre: 'KAY/O', rol: 'Iniciador', color: '#FF4500' },
  { nombre: 'Neon', rol: 'Duelista', color: '#00FFFF' },
  { nombre: 'Fade', rol: 'Iniciador', color: '#800080' },
  { nombre: 'Harbor', rol: 'Smokes', color: '#20B2AA' },
  { nombre: 'Gekko', rol: 'Iniciador', color: '#7CFC00' },
  { nombre: 'Deadlock', rol: 'Centinela', color: '#C0C0C0' },
  { nombre: 'Iso', rol: 'Duelista', color: '#9932CC' },
  { nombre: 'Clove', rol: 'Smokes', color: '#FF69B4' },
  { nombre: 'Vyse', rol: 'Centinela', color: '#B8860B' },
  { nombre: 'Waylay', rol: 'Duelista', color: '#FF1493' },
];

// ============================================
// MAPAS ACTIVOS
// ============================================

export const MAPAS: Mapa[] = [
  { nombre: 'Ascent', sites: ['A', 'B'], activo: true },
  { nombre: 'Bind', sites: ['A', 'B'], activo: true },
  { nombre: 'Haven', sites: ['A', 'B', 'C'], activo: true },
  { nombre: 'Split', sites: ['A', 'B'], activo: true },
  { nombre: 'Icebox', sites: ['A', 'B'], activo: true },
  { nombre: 'Breeze', sites: ['A', 'B'], activo: true },
  { nombre: 'Fracture', sites: ['A', 'B'], activo: true },
  { nombre: 'Pearl', sites: ['A', 'B'], activo: true },
  { nombre: 'Lotus', sites: ['A', 'B', 'C'], activo: true },
  { nombre: 'Sunset', sites: ['A', 'B'], activo: true },
  { nombre: 'Abyss', sites: ['A', 'B'], activo: true },
];

// ============================================
// RANGOS DE VALORANT
// ============================================

export const RANGOS = [
  'Iron 1', 'Iron 2', 'Iron 3',
  'Bronze 1', 'Bronze 2', 'Bronze 3',
  'Silver 1', 'Silver 2', 'Silver 3',
  'Gold 1', 'Gold 2', 'Gold 3',
  'Platinum 1', 'Platinum 2', 'Platinum 3',
  'Diamond 1', 'Diamond 2', 'Diamond 3',
  'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
  'Immortal 1', 'Immortal 2', 'Immortal 3',
  'Radiant',
];

// ============================================
// UMBRALES (THRESHOLDS) PARA ANÁLISIS
// ============================================
// Estos valores definen qué se considera bueno, regular o malo
// Puedes ajustarlos según tus estándares personales

export const UMBRALES: Umbrales = {
  kda: {
    excelente: 1.5,   // KDA >= 1.5
    bueno: 1.0,       // 1.0 <= KDA < 1.5
    regular: 0.8,     // KDA < 1.0
  },
  acs: {
    excelente: 250,   // ACS >= 250
    bueno: 200,       // 200 <= ACS < 250
    regular: 150,     // ACS < 200
  },
  hs: {
    excelente: 25,    // HS% >= 25%
    bueno: 20,        // 20% <= HS% < 25%
    regular: 15,      // HS% < 20%
  },
  kast: {
    excelente: 75,    // KAST >= 75%
    bueno: 65,        // 65% <= KAST < 75%
    regular: 55,      // KAST < 65%
  },
  winrate: {
    excelente: 55,    // WR >= 55%
    bueno: 48,        // 48% <= WR < 55%
    regular: 45,      // WR < 48%
  },
};

// ============================================
// COLORES POR ESTADO
// ============================================

export const COLORES = {
  // Estados
  exito: '#10B981',
  advertencia: '#F59E0B',
  peligro: '#EF4444',
  info: '#3B82F6',
  
  // Roles
  duelista: '#FF4655',
  smokes: '#8B5CF6',
  centinela: '#10B981',
  iniciador: '#F59E0B',
  
  // UI
  fondo: '#0a0a0a',
  superficie: '#1a1a1a',
  borde: '#333333',
  texto: '#FFFFFF',
  textoSuave: '#9CA3AF',
  acento: '#06B6D4',      // Cyan
  acentoSecundario: '#8B5CF6', // Morado
};

// ============================================
// CLAVES DE LOCALSTORAGE
// ============================================

export const CLAVES_STORAGE = {
  historialPartidas: 'valorant-match-history',
  sesionesMentales: 'valorant-mental-sessions',
  checklistPreGame: 'valorant-pregame-checklist',
  notasAgentes: 'valorant-agent-notes',
  configuracionRed: 'valorant-network-config',
};

// ============================================
// TAREAS DE ENTRENAMIENTO POR DEFECTO
// ============================================

export const TAREAS_ENTRENAMIENTO_DEFAULT = [
  {
    id: 'aim-range-hs',
    nombre: 'Range - Solo Headshots',
    categoria: 'range' as const,
    duracion: 10,
    completada: false,
    descripcion: 'Bots fáciles, solo headshots, enfocado en crosshair placement',
  },
  {
    id: 'aim-range-spray',
    nombre: 'Range - Control de Spray',
    categoria: 'range' as const,
    duracion: 5,
    completada: false,
    descripcion: 'Practicar patrones de spray de Vandal y Phantom',
  },
  {
    id: 'aim-lab-flicks',
    nombre: 'Aim Lab - Flicks',
    categoria: 'aim' as const,
    duracion: 10,
    completada: false,
    descripcion: 'Gridshot o similar para entrenar flicks',
  },
  {
    id: 'aim-lab-tracking',
    nombre: 'Aim Lab - Tracking',
    categoria: 'aim' as const,
    duracion: 10,
    completada: false,
    descripcion: 'Escenarios de tracking suave',
  },
  {
    id: 'dm-peek',
    nombre: 'DM - Práctica de Peek',
    categoria: 'dm' as const,
    duracion: 15,
    completada: false,
    descripcion: 'Enfocado en jiggle peek y wide swings',
  },
  {
    id: 'dm-crosshair',
    nombre: 'DM - Crosshair Placement',
    categoria: 'dm' as const,
    duracion: 15,
    completada: false,
    descripcion: 'Mantener crosshair a nivel de cabeza siempre',
  },
  {
    id: 'review-vod',
    nombre: 'Revisión de VOD',
    categoria: 'review' as const,
    duracion: 20,
    completada: false,
    descripcion: 'Revisar última partida, identificar 3 errores',
  },
  {
    id: 'mental-respiracion',
    nombre: 'Ejercicio de Respiración',
    categoria: 'mental' as const,
    duracion: 5,
    completada: false,
    descripcion: '5 minutos de respiración enfocada antes de ranked',
  },
];

// ============================================
// CHECKLIST PRE-GAME POR DEFECTO
// ============================================

export const CHECKLIST_PRE_GAME_DEFAULT = [
  {
    id: 'warmup-1',
    text: 'Calentamiento de aim completado (Range/DM)',
    category: 'warmup' as const,
    completed: false,
    order: 1,
  },
  {
    id: 'warmup-2',
    text: 'Práctica de control de spray (30s por arma)',
    category: 'warmup' as const,
    completed: false,
    order: 2,
  },
  {
    id: 'tech-1',
    text: 'Verificar ping al servidor',
    category: 'tech' as const,
    completed: false,
    order: 3,
  },
  {
    id: 'tech-2',
    text: 'Cerrar aplicaciones en segundo plano',
    category: 'tech' as const,
    completed: false,
    order: 4,
  },
  {
    id: 'tech-3',
    text: 'Pausar descargas y streaming',
    category: 'tech' as const,
    completed: false,
    order: 5,
  },
  {
    id: 'config-1',
    text: 'Verificar configuración de crosshair',
    category: 'config' as const,
    completed: false,
    order: 6,
  },
  {
    id: 'config-2',
    text: 'Verificar sensibilidad y DPI',
    category: 'config' as const,
    completed: false,
    order: 7,
  },
  {
    id: 'config-3',
    text: 'Configuración de audio optimizada',
    category: 'config' as const,
    completed: false,
    order: 8,
  },
  {
    id: 'mental-1',
    text: 'Establecer objetivos de la sesión',
    category: 'mental' as const,
    completed: false,
    order: 9,
  },
  {
    id: 'mental-2',
    text: 'Recordar: No tilteo, jugar inteligente',
    category: 'mental' as const,
    completed: false,
    order: 10,
  },
  {
    id: 'mental-3',
    text: 'Enfocarse en un área de mejora',
    category: 'mental' as const,
    completed: false,
    order: 11,
  },
];
