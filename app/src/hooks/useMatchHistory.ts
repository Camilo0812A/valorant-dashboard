/**
 * Hook para gestionar el historial de partidas
 * Todas las partidas se almacenan en localStorage
 * Este es el núcleo de datos del dashboard
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Partida, EstadisticasAgregadas } from '@/types';

// Clave para localStorage
const STORAGE_KEY = 'valorant-match-history';

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useMatchHistory() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar partidas desde localStorage al iniciar
  useEffect(() => {
    const cargarPartidas = () => {
      try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        if (guardado) {
          const parseado = JSON.parse(guardado);
          // Ordenar por fecha y hora (más reciente primero)
          const ordenado = parseado.sort((a: Partida, b: Partida) => {
            const fechaA = new Date(`${a.fecha}T${a.hora}`);
            const fechaB = new Date(`${b.fecha}T${b.hora}`);
            return fechaB.getTime() - fechaA.getTime();
          });
          setPartidas(ordenado);
        }
      } catch (error) {
        console.error('Error al cargar historial de partidas:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarPartidas();
  }, []);

  // Guardar en localStorage cuando cambian las partidas
  useEffect(() => {
    if (!cargando) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(partidas));
    }
  }, [partidas, cargando]);

  // ============================================
  // OPERACIONES CRUD
  // ============================================

  /**
   * Agregar una nueva partida
   * Calcula automáticamente KD y KDA
   */
  const agregarPartida = useCallback((datos: Omit<Partida, 'id' | 'kd' | 'kda'>) => {
    const nuevaPartida: Partida = {
      ...datos,
      id: Date.now().toString(),
      kd: datos.deaths > 0 ? datos.kills / datos.deaths : datos.kills,
      kda: datos.deaths > 0 ? (datos.kills + datos.assists) / datos.deaths : datos.kills + datos.assists,
    };

    setPartidas(prev => [nuevaPartida, ...prev]);
    return nuevaPartida;
  }, []);

  /**
   * Actualizar una partida existente
   */
  const actualizarPartida = useCallback((id: string, datos: Partial<Partida>) => {
    setPartidas(prev => prev.map(p => {
      if (p.id !== id) return p;
      
      const actualizada = { ...p, ...datos };
      // Recalcular KD y KDA si cambiaron kills, deaths o assists
      if (datos.kills !== undefined || datos.deaths !== undefined || datos.assists !== undefined) {
        const kills = datos.kills ?? p.kills;
        const deaths = datos.deaths ?? p.deaths;
        const assists = datos.assists ?? p.assists;
        actualizada.kd = deaths > 0 ? kills / deaths : kills;
        actualizada.kda = deaths > 0 ? (kills + assists) / deaths : kills + assists;
      }
      return actualizada;
    }));
  }, []);

  /**
   * Eliminar una partida
   */
  const eliminarPartida = useCallback((id: string) => {
    setPartidas(prev => prev.filter(p => p.id !== id));
  }, []);

  /**
   * Obtener una partida por ID
   */
  const obtenerPartida = useCallback((id: string) => {
    return partidas.find(p => p.id === id);
  }, [partidas]);

  // ============================================
  // ESTADÍSTICAS AGREGADAS
  // ============================================

  const estadisticas: EstadisticasAgregadas = useMemo(() => {
    if (partidas.length === 0) {
      return {
        totalPartidas: 0,
        victorias: 0,
        derrotas: 0,
        empates: 0,
        promedioKDA: 0,
        promedioACS: 0,
        promedioADR: 0,
        promedioDDDelta: 0,
        promedioKAST: 0,
        promedioHS: 0,
        promedioMultiKills: 0,
        winrateGeneral: 0,
        ratioPrimerasKillsMuertes: 0,
        porMapa: {},
        porAgente: {},
        porRol: {},
        porHorario: {
          manana: { partidas: 0, winrate: 0, kda: 0 },
          tarde: { partidas: 0, winrate: 0, kda: 0 },
          noche: { partidas: 0, winrate: 0, kda: 0 },
          madrugada: { partidas: 0, winrate: 0, kda: 0 },
        },
        tendenciaTRS: [],
        tendenciaKDA: [],
      };
    }

    const victorias = partidas.filter(p => p.resultado === 'Victoria').length;
    const derrotas = partidas.filter(p => p.resultado === 'Derrota').length;
    const empates = partidas.filter(p => p.resultado === 'Empate').length;

    // Promedios
    const promedioKDA = partidas.reduce((acc, p) => acc + p.kda, 0) / partidas.length;
    const promedioACS = partidas.reduce((acc, p) => acc + p.acs, 0) / partidas.length;
    const promedioADR = partidas.reduce((acc, p) => acc + p.adr, 0) / partidas.length;
    const promedioDDDelta = partidas.reduce((acc, p) => acc + p.ddDelta, 0) / partidas.length;
    const promedioKAST = partidas.reduce((acc, p) => acc + p.kast, 0) / partidas.length;
    const promedioHS = partidas.reduce((acc, p) => acc + p.hsPorcentaje, 0) / partidas.length;
    const promedioMultiKills = partidas.reduce((acc, p) => acc + p.multiKills, 0) / partidas.length;

    // Por mapa
    const porMapa: Record<string, { partidas: number; victorias: number; winrate: number; kdaPromedio: number }> = {};
    partidas.forEach(p => {
      if (!porMapa[p.mapa]) {
        porMapa[p.mapa] = { partidas: 0, victorias: 0, winrate: 0, kdaPromedio: 0 };
      }
      porMapa[p.mapa].partidas++;
      if (p.resultado === 'Victoria') porMapa[p.mapa].victorias++;
      porMapa[p.mapa].kdaPromedio += p.kda;
    });
    Object.keys(porMapa).forEach(mapa => {
      porMapa[mapa].winrate = (porMapa[mapa].victorias / porMapa[mapa].partidas) * 100;
      porMapa[mapa].kdaPromedio /= porMapa[mapa].partidas;
    });

    // Por agente
    const porAgente: Record<string, { partidas: number; victorias: number; winrate: number; kdaPromedio: number; acsPromedio: number }> = {};
    partidas.forEach(p => {
      if (!porAgente[p.agente]) {
        porAgente[p.agente] = { partidas: 0, victorias: 0, winrate: 0, kdaPromedio: 0, acsPromedio: 0 };
      }
      porAgente[p.agente].partidas++;
      if (p.resultado === 'Victoria') porAgente[p.agente].victorias++;
      porAgente[p.agente].kdaPromedio += p.kda;
      porAgente[p.agente].acsPromedio += p.acs;
    });
    Object.keys(porAgente).forEach(agente => {
      porAgente[agente].winrate = (porAgente[agente].victorias / porAgente[agente].partidas) * 100;
      porAgente[agente].kdaPromedio /= porAgente[agente].partidas;
      porAgente[agente].acsPromedio /= porAgente[agente].partidas;
    });

    // Por rol
    const porRol: Record<string, { partidas: number; victorias: number; winrate: number; kdaPromedio: number }> = {};
    partidas.forEach(p => {
      if (!porRol[p.rol]) {
        porRol[p.rol] = { partidas: 0, victorias: 0, winrate: 0, kdaPromedio: 0 };
      }
      porRol[p.rol].partidas++;
      if (p.resultado === 'Victoria') porRol[p.rol].victorias++;
      porRol[p.rol].kdaPromedio += p.kda;
    });
    Object.keys(porRol).forEach(rol => {
      porRol[rol].winrate = (porRol[rol].victorias / porRol[rol].partidas) * 100;
      porRol[rol].kdaPromedio /= porRol[rol].partidas;
    });

    // Por franja horaria
    const porHorario = {
      manana: { partidas: 0, victorias: 0, kdaTotal: 0, winrate: 0, kda: 0 },
      tarde: { partidas: 0, victorias: 0, kdaTotal: 0, winrate: 0, kda: 0 },
      noche: { partidas: 0, victorias: 0, kdaTotal: 0, winrate: 0, kda: 0 },
      madrugada: { partidas: 0, victorias: 0, kdaTotal: 0, winrate: 0, kda: 0 },
    };

    partidas.forEach(p => {
      const hora = parseInt(p.hora.split(':')[0]);
      let franja: keyof typeof porHorario;
      
      if (hora >= 6 && hora < 12) franja = 'manana';
      else if (hora >= 12 && hora < 18) franja = 'tarde';
      else if (hora >= 18 && hora < 24) franja = 'noche';
      else franja = 'madrugada';

      porHorario[franja].partidas++;
      if (p.resultado === 'Victoria') porHorario[franja].victorias++;
      porHorario[franja].kdaTotal += p.kda;
    });

    const porHorarioFinal = {
      manana: { 
        partidas: porHorario.manana.partidas, 
        winrate: porHorario.manana.partidas > 0 ? (porHorario.manana.victorias / porHorario.manana.partidas) * 100 : 0,
        kda: porHorario.manana.partidas > 0 ? porHorario.manana.kdaTotal / porHorario.manana.partidas : 0
      },
      tarde: { 
        partidas: porHorario.tarde.partidas, 
        winrate: porHorario.tarde.partidas > 0 ? (porHorario.tarde.victorias / porHorario.tarde.partidas) * 100 : 0,
        kda: porHorario.tarde.partidas > 0 ? porHorario.tarde.kdaTotal / porHorario.tarde.partidas : 0
      },
      noche: { 
        partidas: porHorario.noche.partidas, 
        winrate: porHorario.noche.partidas > 0 ? (porHorario.noche.victorias / porHorario.noche.partidas) * 100 : 0,
        kda: porHorario.noche.partidas > 0 ? porHorario.noche.kdaTotal / porHorario.noche.partidas : 0
      },
      madrugada: { 
        partidas: porHorario.madrugada.partidas, 
        winrate: porHorario.madrugada.partidas > 0 ? (porHorario.madrugada.victorias / porHorario.madrugada.partidas) * 100 : 0,
        kda: porHorario.madrugada.partidas > 0 ? porHorario.madrugada.kdaTotal / porHorario.madrugada.partidas : 0
      },
    };

    // Tendencias (últimas 20 partidas, orden cronológico)
    const partidasOrdenadas = [...partidas].sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`);
      const fechaB = new Date(`${b.fecha}T${b.hora}`);
      return fechaA.getTime() - fechaB.getTime();
    });

    const tendenciaTRS = partidasOrdenadas.slice(-20).map(p => p.trsAntes + p.deltaTRS);
    const tendenciaKDA = partidasOrdenadas.slice(-20).map(p => p.kda);

    // Ratio primeras kills/muertes
    const totalPrimerasKills = partidas.reduce((acc, p) => acc + p.primerasKills, 0);
    const totalPrimerasMuertes = partidas.reduce((acc, p) => acc + p.primerasMuertes, 0);
    const ratioPrimerasKillsMuertes = totalPrimerasMuertes > 0 ? totalPrimerasKills / totalPrimerasMuertes : totalPrimerasKills;

    return {
      totalPartidas: partidas.length,
      victorias,
      derrotas,
      empates,
      promedioKDA,
      promedioACS,
      promedioADR,
      promedioDDDelta,
      promedioKAST,
      promedioHS,
      promedioMultiKills,
      winrateGeneral: (victorias / partidas.length) * 100,
      ratioPrimerasKillsMuertes,
      porMapa,
      porAgente,
      porRol,
      porHorario: porHorarioFinal,
      tendenciaTRS,
      tendenciaKDA,
    };
  }, [partidas]);

  // ============================================
  // INSIGHTS AUTOMÁTICOS
  // ============================================

  const insights = useMemo(() => {
    const lista: { tipo: 'fortaleza' | 'debilidad' | 'alerta'; mensaje: string; recomendacion: string }[] = [];

    if (partidas.length < 3) return lista;

    // Analizar HS%
    if (estadisticas.promedioHS < 15) {
      lista.push({
        tipo: 'debilidad',
        mensaje: 'Tu porcentaje de headshots está por debajo del 15%',
        recomendacion: 'Dedica más tiempo a entrenamiento de aim en Range (headshots only)',
      });
    } else if (estadisticas.promedioHS > 25) {
      lista.push({
        tipo: 'fortaleza',
        mensaje: 'Excelente porcentaje de headshots (más del 25%)',
        recomendacion: 'Mantén este nivel, tu aim está muy bien',
      });
    }

    // Analizar primeras muertes
    if (estadisticas.ratioPrimerasKillsMuertes < 0.8) {
      lista.push({
        tipo: 'debilidad',
        mensaje: 'Mueres primero más veces de las que consigues first blood',
        recomendacion: 'Trabaja en timings de peek, jiggle peeking y no peekes seco',
      });
    }

    // Analizar KAST
    if (estadisticas.promedioKAST < 60) {
      lista.push({
        tipo: 'alerta',
        mensaje: 'Tu KAST está por debajo del 60%',
        recomendacion: 'Intenta participar más en rondas: trades, asistencias, plantas, etc.',
      });
    }

    // Analizar winrate por horario
    const mejoresHorarios = Object.entries(estadisticas.porHorario)
      .filter(([, data]) => data.partidas >= 5)
      .sort((a, b) => b[1].winrate - a[1].winrate);
    
    if (mejoresHorarios.length > 0 && mejoresHorarios[0][1].winrate > 55) {
      const horarioNombre: Record<string, string> = {
        manana: 'la mañana',
        tarde: 'la tarde',
        noche: 'la noche',
        madrugada: 'la madrugada',
      };
      lista.push({
        tipo: 'fortaleza',
        mensaje: `Rindes mejor en ${horarioNombre[mejoresHorarios[0][0]]} (${mejoresHorarios[0][1].winrate.toFixed(1)}% WR)`,
        recomendacion: 'Intenta jugar más partidas en este horario',
      });
    }

    // Analizar agentes
    const agentesOrdenados = Object.entries(estadisticas.porAgente)
      .sort((a, b) => b[1].winrate - a[1].winrate);
    
    if (agentesOrdenados.length >= 2) {
      const mejor = agentesOrdenados[0];
      const peor = agentesOrdenados[agentesOrdenados.length - 1];
      
      if (mejor[1].partidas >= 5 && mejor[1].winrate > 55) {
        lista.push({
          tipo: 'fortaleza',
          mensaje: `${mejor[0]} es tu mejor agente (${mejor[1].winrate.toFixed(1)}% WR)`,
          recomendacion: 'Prioriza jugar este agente cuando sea posible',
        });
      }
      
      if (peor[1].partidas >= 5 && peor[1].winrate < 45) {
        lista.push({
          tipo: 'alerta',
          mensaje: `Tu winrate con ${peor[0]} es bajo (${peor[1].winrate.toFixed(1)}%)`,
          recomendacion: 'Considera evitar este agente o practicarlo más en DM',
        });
      }
    }

    return lista;
  }, [estadisticas, partidas.length]);

  return {
    partidas,
    cargando,
    estadisticas,
    insights,
    agregarPartida,
    actualizarPartida,
    eliminarPartida,
    obtenerPartida,
  };
}
