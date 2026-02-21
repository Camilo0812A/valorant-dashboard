/**
 * Sección Agentes y Mapas
 * Muestra rendimiento por agente y mapa basado en datos reales
 */

import { useState, useEffect } from 'react';
import { 
  Users, 
  Map, 
  Save, 
  Target, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MapPin,
  Zap,
  Edit3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AGENTES } from '@/data/constants';
import type { EstadisticasAgregadas, Partida } from '@/types';

interface Props {
  estadisticas: EstadisticasAgregadas;
  partidas: Partida[];
}

// Agentes foco del jugador
const AGENTES_FOCO = ['Chamber', 'Jett', 'Omen'];

export function AgentsMaps({ estadisticas, partidas }: Props) {
  const [agenteSeleccionado, setAgenteSeleccionado] = useState('Chamber');
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [seccionesExpandidas, setSeccionesExpandidas] = useState<Record<string, boolean>>({});

  // Cargar notas desde localStorage
  useEffect(() => {
    const guardado = localStorage.getItem('valorant-agent-notes');
    if (guardado) {
      setNotas(JSON.parse(guardado));
    }
  }, []);

  // Guardar notas
  const guardarNotas = () => {
    localStorage.setItem('valorant-agent-notes', JSON.stringify(notas));
  };

  // Actualizar nota
  const actualizarNota = (clave: string, valor: string) => {
    setNotas(prev => ({ ...prev, [clave]: valor }));
  };

  // Toggle sección expandida
  const toggleSeccion = (clave: string) => {
    setSeccionesExpandidas(prev => ({ ...prev, [clave]: !prev[clave] }));
  };

  // Obtener stats del agente seleccionado
  const statsAgente = estadisticas.porAgente[agenteSeleccionado];

  // Obtener mejores mapas para el agente seleccionado
  const mapasAgente = partidas
    .filter(p => p.agente === agenteSeleccionado)
    .reduce((acc, p) => {
      if (!acc[p.mapa]) {
        acc[p.mapa] = { partidas: 0, victorias: 0, kda: 0, count: 0 };
      }
      acc[p.mapa].partidas++;
      if (p.resultado === 'Victoria') acc[p.mapa].victorias++;
      acc[p.mapa].kda += p.kda;
      acc[p.mapa].count++;
      return acc;
    }, {} as Record<string, { partidas: number; victorias: number; kda: number; count: number }>);

  const mapasOrdenados = Object.entries(mapasAgente)
    .map(([mapa, stats]) => ({
      mapa,
      partidas: stats.partidas,
      winrate: (stats.victorias / stats.partidas) * 100,
      kda: stats.kda / stats.count,
    }))
    .sort((a, b) => b.winrate - a.winrate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-cyan-400" />
          Agentes y Mapas
        </h1>
        <p className="text-zinc-400 mt-1">
          Rendimiento por agente y mapa basado en tus partidas
        </p>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="agentes" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="agentes" className="data-[state=active]:bg-zinc-800">
            <Users className="w-4 h-4 mr-2" />
            Agentes Foco
          </TabsTrigger>
          <TabsTrigger value="mapas" className="data-[state=active]:bg-zinc-800">
            <Map className="w-4 h-4 mr-2" />
            Mapas
          </TabsTrigger>
          <TabsTrigger value="notas" className="data-[state=active]:bg-zinc-800">
            <BookOpen className="w-4 h-4 mr-2" />
            Mis Notas
          </TabsTrigger>
        </TabsList>

        {/* Tab: Agentes */}
        <TabsContent value="agentes" className="space-y-6 mt-6">
          {/* Selector de agente */}
          <div className="flex gap-3 flex-wrap">
            {AGENTES_FOCO.map(agente => {
              const stats = estadisticas.porAgente[agente];
              const agenteData = AGENTES.find(a => a.nombre === agente);
              const seleccionado = agenteSeleccionado === agente;

              return (
                <button
                  key={agente}
                  onClick={() => setAgenteSeleccionado(agente)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200
                    ${seleccionado 
                      ? 'bg-zinc-800 border-cyan-500' 
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                    }
                  `}
                >
                  <div className="text-left">
                    <p className="font-semibold text-white">{agente}</p>
                    <p className="text-xs text-zinc-500">{agenteData?.rol}</p>
                  </div>
                  {stats && (
                    <div className="ml-2 text-right">
                      <p className={`text-sm font-bold ${stats.winrate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stats.winrate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-zinc-500">WR</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detalle del agente seleccionado */}
          {statsAgente && (
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Stats de {agenteSeleccionado}</h2>
                  <p className="text-zinc-400 text-sm">
                    {statsAgente.partidas} partidas registradas
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${statsAgente.kdaPromedio >= 1.2 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {statsAgente.kdaPromedio.toFixed(2)}
                    </p>
                    <p className="text-xs text-zinc-500">KDA</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${statsAgente.winrate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {statsAgente.winrate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-zinc-500">Winrate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-300">
                      {Math.round(statsAgente.acsPromedio)}
                    </p>
                    <p className="text-xs text-zinc-500">ACS</p>
                  </div>
                </div>
              </div>

              {/* Mapas recomendados para este agente */}
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-cyan-400" />
                Mejores Mapas para {agenteSeleccionado}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mapasOrdenados.slice(0, 6).map(({ mapa, partidas: p, winrate, kda }) => {
                  const esBueno = winrate >= 50;

                  return (
                    <div 
                      key={mapa}
                      className={`
                        p-4 rounded-lg border
                        ${esBueno 
                          ? 'bg-emerald-900/10 border-emerald-800/50' 
                          : 'bg-zinc-800/50 border-zinc-700'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{mapa}</span>
                        <span className={`font-semibold ${esBueno ? 'text-emerald-400' : 'text-red-400'}`}>
                          {winrate.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        {p} partidas • KDA {kda.toFixed(2)}
                      </p>
                      {esBueno && (
                        <p className="text-xs text-emerald-400 mt-2">
                          Recomendado - Buen rendimiento
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Secciones colapsables para setups */}
          <div className="space-y-4">
            {['Setups', 'Lineups', 'Posiciones', 'Rutinas'].map(seccion => (
              <div 
                key={seccion}
                className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleSeccion(`${agenteSeleccionado}-${seccion}`)}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {seccion === 'Setups' && <Zap className="w-5 h-5 text-yellow-400" />}
                    {seccion === 'Lineups' && <Target className="w-5 h-5 text-cyan-400" />}
                    {seccion === 'Posiciones' && <MapPin className="w-5 h-5 text-purple-400" />}
                    {seccion === 'Rutinas' && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                    <span className="font-semibold text-white">{seccion}</span>
                  </div>
                  {seccionesExpandidas[`${agenteSeleccionado}-${seccion}`] ? (
                    <ChevronUp className="w-5 h-5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-500" />
                  )}
                </button>

                {seccionesExpandidas[`${agenteSeleccionado}-${seccion}`] && (
                  <div className="p-4 border-t border-zinc-800">
                    <textarea
                      value={notas[`${agenteSeleccionado}-${seccion}`] || ''}
                      onChange={(e) => actualizarNota(`${agenteSeleccionado}-${seccion}`, e.target.value)}
                      placeholder={`Agrega tus notas de ${seccion.toLowerCase()} para ${agenteSeleccionado}...`}
                      className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-300 placeholder-zinc-500 resize-none focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                    />
                    <Button
                      onClick={guardarNotas}
                      size="sm"
                      className="mt-2 bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Guardar Notas
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Mapas */}
        <TabsContent value="mapas" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(estadisticas.porMapa)
              .sort((a, b) => b[1].partidas - a[1].partidas)
              .map(([mapa, stats]) => {
                const esBueno = stats.winrate >= 50;

                // Encontrar mejor agente para este mapa
                const agentesEnMapa = partidas
                  .filter(p => p.mapa === mapa)
                  .reduce((acc, p) => {
                    if (!acc[p.agente]) acc[p.agente] = { partidas: 0, victorias: 0 };
                    acc[p.agente].partidas++;
                    if (p.resultado === 'Victoria') acc[p.agente].victorias++;
                    return acc;
                  }, {} as Record<string, { partidas: number; victorias: number }>);

                const mejorAgente = Object.entries(agentesEnMapa)
                  .sort((a, b) => (b[1].victorias / b[1].partidas) - (a[1].victorias / a[1].partidas))[0];

                return (
                  <div 
                    key={mapa}
                    className={`
                      p-5 rounded-xl border
                      ${esBueno ? 'bg-emerald-900/10 border-emerald-800/50' : 'bg-zinc-900 border-zinc-800'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{mapa}</h3>
                      <span className={`text-lg font-bold ${esBueno ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stats.winrate.toFixed(1)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-2 bg-zinc-800/50 rounded">
                        <p className="text-lg font-semibold text-zinc-300">{stats.partidas}</p>
                        <p className="text-xs text-zinc-500">Partidas</p>
                      </div>
                      <div className="text-center p-2 bg-zinc-800/50 rounded">
                        <p className={`text-lg font-semibold ${stats.kdaPromedio >= 1.2 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {stats.kdaPromedio.toFixed(2)}
                        </p>
                        <p className="text-xs text-zinc-500">KDA</p>
                      </div>
                    </div>

                    {mejorAgente && (
                      <div className="pt-3 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-1">Mejor Agente:</p>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{mejorAgente[0]}</span>
                          <span className="text-emerald-400 text-sm">
                            {((mejorAgente[1].victorias / mejorAgente[1].partidas) * 100).toFixed(0)}% WR
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </TabsContent>

        {/* Tab: Notas */}
        <TabsContent value="notas" className="space-y-6 mt-6">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Todas Mis Notas
              </h3>
              <Button
                onClick={guardarNotas}
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Guardar Todo
              </Button>
            </div>

            {Object.keys(notas).length === 0 ? (
              <div className="text-center py-12">
                <Edit3 className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No hay notas aún</p>
                <p className="text-zinc-600 text-sm mt-1">
                  Ve a la pestaña Agentes Foco para agregar tus primeras notas
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(notas)
                  .filter(([_, contenido]) => contenido.trim())
                  .map(([clave, contenido]) => {
                    const [agente, seccion] = clave.split('-');
                    return (
                      <div key={clave} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-cyan-400 font-medium">{agente}</span>
                          <span className="text-zinc-600">/</span>
                          <span className="text-zinc-400 text-sm">{seccion}</span>
                        </div>
                        <p className="text-zinc-300 text-sm whitespace-pre-wrap">{contenido}</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
