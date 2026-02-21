/**
 * Sección Plan de Entrenamiento
 * Adaptado según las estadísticas reales del jugador
 */

import { useState } from 'react';
import { 
  Dumbbell, 
  Target, 
  Crosshair, 
  Brain, 
  CheckCircle2, 
  Clock,
  Calendar,
  RotateCcw,
  Trophy,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TAREAS_ENTRENAMIENTO_DEFAULT, UMBRALES } from '@/data/constants';
import type { EstadisticasAgregadas } from '@/types';

interface Props {
  estadisticas: EstadisticasAgregadas;
}

// Tipo para las tareas de entrenamiento
interface TareaEntrenamiento {
  id: string;
  nombre: string;
  categoria: 'aim' | 'range' | 'dm' | 'mental' | 'review';
  duracion: number;
  completada: boolean;
  descripcion: string;
}

// Configuración de categorías
const configCategorias = {
  aim: { 
    label: 'Aim Lab', 
    color: '#F59E0B', 
    icon: Crosshair,
    bgColor: 'bg-amber-900/20',
    borderColor: 'border-amber-800'
  },
  range: { 
    label: 'Range', 
    color: '#10B981', 
    icon: Target,
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-800'
  },
  dm: { 
    label: 'Deathmatch', 
    color: '#EF4444', 
    icon: Crosshair,
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-800'
  },
  mental: { 
    label: 'Mental', 
    color: '#8B5CF6', 
    icon: Brain,
    bgColor: 'bg-purple-900/20',
    borderColor: 'border-purple-800'
  },
  review: { 
    label: 'Revisión', 
    color: '#06B6D4', 
    icon: TrendingUp,
    bgColor: 'bg-cyan-900/20',
    borderColor: 'border-cyan-800'
  },
};

export function TrainingPlan({ estadisticas }: Props) {
  // Estado del día actual
  const [tareas, setTareas] = useState<TareaEntrenamiento[]>(
    TAREAS_ENTRENAMIENTO_DEFAULT.map(t => ({ ...t, completada: false }))
  );
  const [notas, setNotas] = useState('');
  const [racha] = useState(5);

  // Generar recomendaciones basadas en estadísticas
  const recomendaciones = [];
  
  if (estadisticas.promedioHS < UMBRALES.hs.bueno) {
    recomendaciones.push({
      tipo: 'alerta',
      titulo: 'HS% Bajo',
      mensaje: `Tu HS% es ${estadisticas.promedioHS.toFixed(1)}%. Aumenta el tiempo de Range (headshots only).`,
      accion: '+10 min Range'
    });
  }
  
  if (estadisticas.ratioPrimerasKillsMuertes < 1) {
    recomendaciones.push({
      tipo: 'alerta',
      titulo: 'Muchas Primeras Muertes',
      mensaje: 'Mueres primero más veces de las que consigues first blood.',
      accion: 'Practicar jiggle peek en DM'
    });
  }
  
  if (estadisticas.promedioKAST < UMBRALES.kast.bueno) {
    recomendaciones.push({
      tipo: 'advertencia',
      titulo: 'KAST Bajo',
      mensaje: 'Tu impacto en rondas es limitado.',
      accion: 'Enfocarse en trades y utilidad'
    });
  }

  // Toggle de tarea completada
  const toggleTarea = (id: string) => {
    setTareas(prev => prev.map(t =>
      t.id === id ? { ...t, completada: !t.completada } : t
    ));
  };

  // Resetear día
  const resetearDia = () => {
    if (confirm('¿Resetear todas las tareas?')) {
      setTareas(prev => prev.map(t => ({ ...t, completada: false })));
    }
  };

  // Calcular estadísticas
  const tareasCompletadas = tareas.filter(t => t.completada).length;
  const tiempoCompletado = tareas.filter(t => t.completada).reduce((acc, t) => acc + t.duracion, 0);
  const tiempoTotal = tareas.reduce((acc, t) => acc + t.duracion, 0);
  const progreso = tareas.length > 0 ? (tareasCompletadas / tareas.length) * 100 : 0;

  // Agrupar tareas por categoría
  const tareasAgrupadas = tareas.reduce((acc, tarea) => {
    if (!acc[tarea.categoria]) acc[tarea.categoria] = [];
    acc[tarea.categoria].push(tarea);
    return acc;
  }, {} as Record<string, TareaEntrenamiento[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Dumbbell className="w-7 h-7 text-cyan-400" />
              Plan de Entrenamiento
            </h1>
            <p className="text-zinc-400 mt-1">
              Adaptado según tus estadísticas
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-zinc-400 text-sm">Racha Actual</p>
              <p className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
                <Trophy className="w-5 h-5" />
                {racha} días
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones basadas en stats */}
      {recomendaciones.length > 0 && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Recomendaciones Basadas en tus Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recomendaciones.map((rec, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg border ${
                  rec.tipo === 'alerta' 
                    ? 'bg-red-900/10 border-red-800/50' 
                    : 'bg-yellow-900/10 border-yellow-800/50'
                }`}
              >
                <p className={`font-medium ${rec.tipo === 'alerta' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {rec.titulo}
                </p>
                <p className="text-zinc-400 text-sm mt-1">{rec.mensaje}</p>
                <p className="text-cyan-400 text-sm mt-2">→ {rec.accion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats del día */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Tareas Hechas</p>
          <p className="text-2xl font-bold text-white">
            {tareasCompletadas}/{tareas.length}
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Tiempo Completado</p>
          <p className="text-2xl font-bold text-cyan-400">
            {tiempoCompletado}m
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Tiempo Total</p>
          <p className="text-2xl font-bold text-zinc-300">
            {tiempoTotal}m
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Progreso</p>
          <p className="text-2xl font-bold text-emerald-400">
            {Math.round(progreso)}%
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-300 font-medium">Progreso de Hoy</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetearDia}
            className="text-zinc-500 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
        <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="text-zinc-500 text-sm mt-2">
          {progreso === 100 
            ? '¡Todas las tareas completadas! Buen trabajo.' 
            : `${Math.round(progreso)}% completado - ${tareas.length - tareasCompletadas} tareas pendientes`
          }
        </p>
      </div>

      {/* Tareas agrupadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(Object.keys(tareasAgrupadas) as Array<keyof typeof configCategorias>).map(categoria => {
          const config = configCategorias[categoria];
          const tareasCat = tareasAgrupadas[categoria];
          const completadasCat = tareasCat.filter(t => t.completada).length;
          const Icon = config.icon;

          return (
            <div 
              key={categoria}
              className={`bg-zinc-900 rounded-xl border ${config.borderColor} overflow-hidden`}
            >
              <div className={`${config.bgColor} p-4 border-b ${config.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                    <h3 className="font-semibold text-white">{config.label}</h3>
                  </div>
                  <span className="text-sm text-zinc-400">
                    {completadasCat}/{tareasCat.length}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {tareasCat.map(tarea => (
                  <label
                    key={tarea.id}
                    className={`
                      flex items-start gap-3 p-3 rounded-lg cursor-pointer
                      transition-all duration-200
                      ${tarea.completada 
                        ? 'bg-zinc-800/50 border border-zinc-700' 
                        : 'bg-zinc-800/30 border border-zinc-800 hover:border-zinc-700'
                      }
                    `}
                  >
                    <button
                      onClick={() => toggleTarea(tarea.id)}
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                        transition-all duration-200
                        ${tarea.completada
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-zinc-600 hover:border-zinc-500'
                        }
                      `}
                    >
                      {tarea.completada && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className={`
                            font-medium text-sm
                            ${tarea.completada ? 'text-zinc-500 line-through' : 'text-zinc-200'}
                          `}
                        >
                          {tarea.nombre}
                        </span>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tarea.duracion}m
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${tarea.completada ? 'text-zinc-600' : 'text-zinc-500'}`}>
                        {tarea.descripcion}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notas del día */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Notas de la Sesión
        </h3>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Escribe tus notas sobre el entrenamiento de hoy..."
          className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-zinc-300 placeholder-zinc-500 resize-none focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>
    </div>
  );
}
