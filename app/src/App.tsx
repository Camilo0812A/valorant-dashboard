/**
 * Valorant Improvement Dashboard
 * 
 * Dashboard personalizado para mejorar en Valorant.
 * TODOS los datos provienen de partidas ingresadas MANUALMENTE.
 * No se usa Tracker.gg ni ninguna API externa.
 * 
 * Stack: React + Vite + TypeScript + Tailwind CSS + shadcn/ui + Recharts
 */

import { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Dumbbell,
  Users,
  Brain,
  ClipboardCheck,
  Wifi,
  Target,
  Menu,
  X,
  ChevronRight,
  Plus,
  History,
} from 'lucide-react';
import { useMatchHistory } from '@/hooks/useMatchHistory';
import { Overview } from '@/sections/Overview';
import { StatsInsights } from '@/sections/StatsInsights';
import { TrainingPlan } from '@/sections/TrainingPlan';
import { AgentsMaps } from '@/sections/AgentsMaps';
import { MentalJournal } from '@/sections/MentalJournal';
import { PreGameChecklist } from '@/sections/PreGameChecklist';
import { NetworkTech } from '@/sections/NetworkTech';
import { IngresoPartida } from '@/sections/IngresoPartida';
import { HistorialPartidas } from '@/sections/HistorialPartidas';
import { PERFIL_JUGADOR } from '@/data/constants';

// Configuración de las pestañas/secciones
const SECCIONES = [
  {
    id: 'overview',
    label: 'Resumen',
    icon: LayoutDashboard,
    descripcion: 'Vista general y metas',
  },
  {
    id: 'ingreso',
    label: 'Ingresar Partida',
    icon: Plus,
    descripcion: 'Registrar nueva partida',
    destacado: true,
  },
  {
    id: 'historial',
    label: 'Historial',
    icon: History,
    descripcion: 'Partidas y estadísticas',
  },
  {
    id: 'stats',
    label: 'Estadísticas',
    icon: BarChart3,
    descripcion: 'Análisis detallado',
  },
  {
    id: 'training',
    label: 'Entrenamiento',
    icon: Dumbbell,
    descripcion: 'Plan de práctica',
  },
  {
    id: 'agents',
    label: 'Agentes y Mapas',
    icon: Users,
    descripcion: 'Rendimiento por agente',
  },
  {
    id: 'mental',
    label: 'Mental',
    icon: Brain,
    descripcion: 'Seguimiento de tilt',
  },
  {
    id: 'checklist',
    label: 'Pre-game',
    icon: ClipboardCheck,
    descripcion: 'Checklist antes de ranked',
  },
  {
    id: 'network',
    label: 'Red y Técnico',
    icon: Wifi,
    descripcion: 'Ping y conexión',
  },
];

function App() {
  console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL)
  console.log("ENV COMPLETO:", import.meta.env)
  alert("APP CARGADA EN PRODUCCIÓN");

  console.log("ENV:", import.meta.env);
  // Estado de la pestaña activa
  const [pestanaActiva, setPestanaActiva] = useState('overview');
  
  // Estado del menú móvil
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Hook del historial de partidas (núcleo de datos)
  const { 
    partidas, 
    cargando, 
    estadisticas, 
    insights,
    agregarPartida, 
    actualizarPartida 
  } = useMatchHistory();

  // Obtener la sección activa
  const seccionActiva = SECCIONES.find(s => s.id === pestanaActiva);

  // Renderizar el componente según la pestaña activa
  const renderizarContenido = () => {
    if (cargando) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
        </div>
      );
    }

    switch (pestanaActiva) {
      case 'overview':
        return <Overview estadisticas={estadisticas} partidas={partidas} insights={insights} />;
      case 'ingreso':
        return <IngresoPartida onGuardar={agregarPartida} />;
      case 'historial':
        return <HistorialPartidas partidas={partidas} estadisticas={estadisticas} onActualizar={actualizarPartida} />;
      case 'stats':
        return <StatsInsights estadisticas={estadisticas} partidas={partidas} />;
      case 'training':
        return <TrainingPlan estadisticas={estadisticas} />;
      case 'agents':
        return <AgentsMaps estadisticas={estadisticas} partidas={partidas} />;
      case 'mental':
        return <MentalJournal />;
      case 'checklist':
        return <PreGameChecklist />;
      case 'network':
        return <NetworkTech />;
      default:
        return <Overview estadisticas={estadisticas} partidas={partidas} insights={insights} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header móvil */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-lg">Valorant Dashboard</span>
        </div>
        <button
          onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          {menuMovilAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-zinc-800 bg-zinc-900/30">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">Valorant</h1>
                <p className="text-xs text-zinc-500">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {SECCIONES.map(seccion => {
              const Icon = seccion.icon;
              const activa = pestanaActiva === seccion.id;

              return (
                <button
                  key={seccion.id}
                  onClick={() => setPestanaActiva(seccion.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 text-left
                    ${activa
                      ? 'bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30'
                      : 'hover:bg-zinc-800/50 border border-transparent'
                    }
                    ${seccion.destacado && !activa ? 'bg-cyan-900/10 border-cyan-800/30' : ''}
                  `}
                >
                  <Icon 
                    className={`w-5 h-5 ${activa ? 'text-cyan-400' : seccion.destacado ? 'text-cyan-400' : 'text-zinc-500'}`} 
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${activa ? 'text-white' : 'text-zinc-400'}`}>
                      {seccion.label}
                    </p>
                    <p className="text-xs text-zinc-600">{seccion.descripcion}</p>
                  </div>
                  {activa && <ChevronRight className="w-4 h-4 text-cyan-400" />}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
                {PERFIL_JUGADOR.riotId[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{PERFIL_JUGADOR.riotId}</p>
                <p className="text-xs text-zinc-500">#{PERFIL_JUGADOR.tag}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-2 text-center">
              {partidas.length} partidas registradas
            </p>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {menuMovilAbierto && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
            <div className="absolute right-0 top-0 h-full w-72 bg-zinc-900 border-l border-zinc-800 p-4">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold">Menú</span>
                <button 
                  onClick={() => setMenuMovilAbierto(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {SECCIONES.map(seccion => {
                  const Icon = seccion.icon;
                  const activa = pestanaActiva === seccion.id;

                  return (
                    <button
                      key={seccion.id}
                      onClick={() => {
                        setPestanaActiva(seccion.id);
                        setMenuMovilAbierto(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        transition-all duration-200 text-left
                        ${activa
                          ? 'bg-cyan-600/20 border border-cyan-500/30'
                          : 'hover:bg-zinc-800/50'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${activa ? 'text-cyan-400' : 'text-zinc-500'}`} />
                      <span className={activa ? 'text-white' : 'text-zinc-400'}>
                        {seccion.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <main className="flex-1 min-h-screen">
          {/* Header de la sección */}
          <div className="sticky top-0 lg:top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur border-b border-zinc-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{seccionActiva?.label}</h2>
                <p className="text-sm text-zinc-500">{seccionActiva?.descripcion}</p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-zinc-500">Riot ID:</span>
                <span className="text-sm text-cyan-400 font-medium">{PERFIL_JUGADOR.riotId}#{PERFIL_JUGADOR.tag}</span>
              </div>
            </div>
          </div>

          {/* Contenido de la sección */}
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {renderizarContenido()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
