/**
 * Funciones utilitarias para formatear datos
 * Centraliza la lógica de presentación de datos
 */

import { UMBRALES } from '@/data/constants';

/**
 * Formatea un número KDA con 2 decimales
 */
export function formatearKDA(kda: number): string {
  return kda.toFixed(2);
}

/**
 * Formatea un porcentaje
 */
export function formatearPorcentaje(valor: number, decimales = 1): string {
  return `${valor.toFixed(decimales)}%`;
}

/**
 * Formatea tiempo en minutos a formato legible
 */
export function formatearDuracion(minutos: number): string {
  if (minutos < 60) {
    return `${minutos}m`;
  }
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return mins > 0 ? `${horas}h ${mins}m` : `${horas}h`;
}

/**
 * Formatea una fecha a formato local
 */
export function formatearFecha(fechaString: string): string {
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formatea número con separadores de miles
 */
export function formatearNumero(num: number): string {
  return num.toLocaleString('es-ES');
}

/**
 * Obtiene color según el valor KDA usando umbrales
 */
export function getColorKDA(kda: number): string {
  if (kda >= UMBRALES.kda.excelente) return '#10B981';
  if (kda >= UMBRALES.kda.bueno) return '#F59E0B';
  return '#EF4444';
}

/**
 * Obtiene color según winrate usando umbrales
 */
export function getColorWinRate(winrate: number): string {
  if (winrate >= UMBRALES.winrate.excelente) return '#10B981';
  if (winrate >= UMBRALES.winrate.bueno) return '#F59E0B';
  return '#EF4444';
}

/**
 * Obtiene color según HS%
 */
export function getColorHS(hs: number): string {
  if (hs >= UMBRALES.hs.excelente) return '#10B981';
  if (hs >= UMBRALES.hs.bueno) return '#F59E0B';
  return '#EF4444';
}

/**
 * Obtiene color según nivel de tilt
 */
export function getColorTilt(tilt: number): string {
  switch (tilt) {
    case 1: return '#10B981';
    case 2: return '#84CC16';
    case 3: return '#F59E0B';
    case 4: return '#F97316';
    case 5: return '#EF4444';
    default: return '#9CA3AF';
  }
}

/**
 * Obtiene label según nivel de tilt
 */
export function getLabelTilt(tilt: number): string {
  switch (tilt) {
    case 1: return 'Muy Tranquilo';
    case 2: return 'Tranquilo';
    case 3: return 'Neutral';
    case 4: return 'Tilted';
    case 5: return 'Muy Tilted';
    default: return 'Desconocido';
  }
}

/**
 * Obtiene color según el rol del agente
 */
export function getColorRol(rol: string): string {
  switch (rol.toLowerCase()) {
    case 'duelista': return '#FF4655';
    case 'smokes': return '#8B5CF6';
    case 'centinela': return '#10B981';
    case 'iniciador': return '#F59E0B';
    default: return '#9CA3AF';
  }
}

/**
 * Obtiene emoji/icon según el rol
 */
export function getIconRol(rol: string): string {
  switch (rol.toLowerCase()) {
    case 'duelista': return '⚔️';
    case 'smokes': return '☁️';
    case 'centinela': return '🛡️';
    case 'iniciador': return '🔍';
    default: return '❓';
  }
}

/**
 * Formatea resultado de partida
 */
export function formatearResultado(resultado: 'Victoria' | 'Derrota' | 'Empate'): {
  texto: string;
  color: string;
  bgColor: string;
} {
  switch (resultado) {
    case 'Victoria':
      return { texto: 'Victoria', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.2)' };
    case 'Derrota':
      return { texto: 'Derrota', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.2)' };
    case 'Empate':
      return { texto: 'Empate', color: '#9CA3AF', bgColor: 'rgba(156, 163, 175, 0.2)' };
  }
}

/**
 * Trunca texto con ellipsis
 */
export function truncarTexto(texto: string, maxLength: number): string {
  if (texto.length <= maxLength) return texto;
  return texto.slice(0, maxLength) + '...';
}

/**
 * Capitaliza primera letra
 */
export function capitalizar(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Calcula tendencia (subida/bajada) entre dos valores
 */
export function calcularTendencia(actual: number, anterior: number): {
  direccion: 'subida' | 'bajada' | 'igual';
  porcentaje: number;
  color: string;
} {
  const diff = actual - anterior;
  const porcentaje = anterior !== 0 ? (diff / anterior) * 100 : 0;
  
  if (diff > 0) {
    return { direccion: 'subida', porcentaje, color: '#10B981' };
  }
  if (diff < 0) {
    return { direccion: 'bajada', porcentaje: Math.abs(porcentaje), color: '#EF4444' };
  }
  return { direccion: 'igual', porcentaje: 0, color: '#9CA3AF' };
}

/**
 * Obtiene color según ACS
 */
export function getColorACS(acs: number): string {
  if (acs >= UMBRALES.acs.excelente) return '#10B981';
  if (acs >= UMBRALES.acs.bueno) return '#F59E0B';
  return '#EF4444';
}

/**
 * Obtiene color según KAST
 */
export function getColorKAST(kast: number): string {
  if (kast >= UMBRALES.kast.excelente) return '#10B981';
  if (kast >= UMBRALES.kast.bueno) return '#F59E0B';
  return '#EF4444';
}
