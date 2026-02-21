/**
 * Sección Overview - Resumen general del jugador
 * Basado únicamente en partidas ingresadas manualmente
 */

import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  User, 
  Award, 
  Zap,
  Brain,
  Crosshair,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { StatCard } from '@/components/ui/custom/StatCard';
import { LinearProgress, CircularProgress } from '@/components/ui/custom/ProgressBar';
import { PERFIL_JUGADOR } from '@/data/constants';
import type { EstadisticasAgregadas, Partida } from '@/types';

interface Props {
  estadisticas: EstadisticasAgregadas;
  partidas: Partida[];
  insights: { tipo: 'fortaleza' | 'debilidad' | 'alerta'; mensaje: string; recomendacion: string }[];
}

export function Overview({ estadisticas, partidas, insights }: Props) {
  const { meta } = PERFIL_JUGADOR;

  // Obtener última partida para rango actual
  const ultimaPartida = partidas[0];
  const rangoActual = ultimaPartida 
    ? `${ultimaPartida.rangoAntes} (${ultimaPartida.trsAntes + ultimaPartida.deltaTRS} RR)`
    : 'Sin datos';

  // Calcular progreso hacia Diamond (aproximado)
  const rrProgreso = ultimaPartida ? ultimaPartida.trsAntes + ultimaPartida.deltaTRS : 0;
  const progresoMeta = Math.min((rrProgreso / 300) * 100, 100);

  // Métricas de habilidad basadas en stats reales
  const metricasHabilidad = [
    { nombre: 'Aim (HS%)', actual: estadisticas.promedioHS, meta: 25, maximo: 40 },
    { nombre: 'Impacto (KAST)', actual: estadisticas.promedioKAST, meta: 70, maximo: 100 },
    { nombre: 'Rendimiento (ACS)', actual: estadisticas.promedioACS, meta: 220, maximo: 300 },
    { nombre: 'Consistencia (KDA)', actual: estadisticas.promedioKDA, meta: 1.2, maximo: 2 },
  ];

  // Separar insights por tipo
  const fortalezas = insights.filter(i => i.tipo === 'fortaleza');
  const debilidades = insights.filter(i => i.tipo === 'debilidad' || i.tipo === 'alerta');

  return (
    <div className="space-y-6">
      {/* Header con info del jugador */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {PERFIL_JUGADOR.riotId}
                <span className="text-zinc-500 text-lg">#{PERFIL_JUGADOR.tag}</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-zinc-400 text-sm">{PERFIL_JUGADOR.region}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-zinc-400 text-sm">Rango Actual</p>
              <p className="text-xl font-bold text-white">{rangoActual}</p>
            </div>
          </div>
        </div>

        {/* Objetivo principal */}
        <div className="mt-6 pt-6 border-t border-zinc-700/50">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-cyan-400" />
              <span className="text-zinc-300">Meta principal:</span>
              <span className="text-white font-semibold">
                Llegar a {meta.rangoObjetivo} en {meta.plazo}
              </span>
            </div>
            <div className="flex items-center gap-2 md:ml-auto">
              <span className="text-zinc-500 text-sm">Agentes foco:</span>
              <div className="flex gap-2">
                {meta.agentesFoco.map(agente => (
                  <span 
                    key={agente}
                    className="px-2 py-1 bg-zinc-800 rounded text-xs text-cyan-400 font-medium"
                  >
                    {agente}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progreso hacia la meta */}
          {partidas.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Progreso hacia {meta.rangoObjetivo}</span>
                <span className="text-cyan-400">{progresoMeta.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progresoMeta}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="KDA Promedio"
          value={estadisticas.promedioKDA.toFixed(2)}
          subtitle={`${partidas.length} partidas`}
          icon={<Crosshair className="w-5 h-5" />}
          color={estadisticas.promedioKDA >= 1.2 ? 'success' : estadisticas.promedioKDA >= 1.0 ? 'warning' : 'danger'}
        />
        <StatCard
          title="Win Rate"
          value={`${estadisticas.winrateGeneral.toFixed(1)}%`}
          subtitle={`${estadisticas.victorias}V - ${estadisticas.derrotas}D`}
          icon={<TrendingUp className="w-5 h-5" />}
          color={estadisticas.winrateGeneral >= 50 ? 'success' : 'warning'}
        />
        <StatCard
          title="HS% Promedio"
          value={`${estadisticas.promedioHS.toFixed(1)}%`}
          subtitle="Headshots"
          icon={<Target className="w-5 h-5" />}
          color={estadisticas.promedioHS >= 20 ? 'success' : 'warning'}
        />
        <StatCard
          title="ACS Promedio"
          value={Math.round(estadisticas.promedioACS).toString()}
          subtitle="Combat Score"
          icon={<Zap className="w-5 h-5" />}
          color={estadisticas.promedioACS >= 200 ? 'success' : 'warning'}
        />
      </div>

      {/* Métricas de habilidad y Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Métricas de habilidad */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Métricas de Habilidad
          </h2>
          <p className="text-zinc-500 text-sm mb-6">
            Basado en tus {partidas.length} partidas registradas
          </p>
          
          <div className="space-y-5">
            {metricasHabilidad.map((metrica, index) => (
              <LinearProgress
                key={index}
                value={metrica.actual}
                max={metrica.maximo}
                label={metrica.nombre}
                sublabel={`Meta: ${metrica.meta}`}
                color={metrica.actual >= metrica.meta ? '#10B981' : '#06B6D4'}
                size="md"
              />
            ))}
          </div>

          {/* Resumen de fortalezas/debilidades */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Análisis de Rendimiento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-emerald-400 font-medium mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Fortalezas
                </p>
                {fortalezas.slice(0, 2).map((f, i) => (
                  <p key={i} className="text-xs text-zinc-400">• {f.mensaje}</p>
                ))}
                {fortalezas.length === 0 && (
                  <p className="text-xs text-zinc-600">Juega más partidas para identificar fortalezas</p>
                )}
              </div>
              <div>
                <p className="text-xs text-red-400 font-medium mb-2 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Áreas de mejora
                </p>
                {debilidades.slice(0, 2).map((d, i) => (
                  <p key={i} className="text-xs text-zinc-400">• {d.mensaje}</p>
                ))}
                {debilidades.length === 0 && (
                  <p className="text-xs text-zinc-600">Juega más partidas para identificar áreas de mejora</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Insights y Recomendaciones
          </h2>
          <p className="text-zinc-500 text-sm mb-6">
            Generado automáticamente desde tus estadísticas
          </p>
          
          <div className="space-y-3">
            {insights.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">Registra al menos 3 partidas para generar insights</p>
              </div>
            ) : (
              insights.map((insight, index) => (
                <div 
                  key={index}
                  className={`
                    p-4 rounded-lg border
                    ${insight.tipo === 'fortaleza' 
                      ? 'bg-emerald-900/10 border-emerald-800' 
                      : insight.tipo === 'alerta'
                        ? 'bg-yellow-900/10 border-yellow-800'
                        : 'bg-red-900/10 border-red-800'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {insight.tipo === 'fortaleza' && <Trophy className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                    {insight.tipo === 'alerta' && <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
                    {insight.tipo === 'debilidad' && <TrendingDown className="w-5 h-5 text-red-400 flex-shrink-0" />}
                    <div>
                      <p className={`text-sm font-medium ${
                        insight.tipo === 'fortaleza' ? 'text-emerald-400' : 
                        insight.tipo === 'alerta' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {insight.mensaje}
                      </p>
                      <p className="text-zinc-500 text-xs mt-1">{insight.recomendacion}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Estado actual vs Meta */}
      {partidas.length > 0 && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            Estado Actual vs Meta ({meta.plazo})
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metricasHabilidad.map((metrica, index) => (
              <div key={index} className="text-center">
                <CircularProgress
                  value={metrica.actual}
                  max={metrica.maximo}
                  size={100}
                  strokeWidth={8}
                  color={metrica.actual >= metrica.meta ? '#10B981' : '#06B6D4'}
                  label={metrica.nombre}
                  sublabel={`${metrica.actual.toFixed(1)}/${metrica.meta}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
