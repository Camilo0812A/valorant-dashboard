/**
 * Sección Historial de Partidas
 * Muestra todas las partidas registradas con opción de edición
 * y estadísticas agregadas calculadas desde el historial
 */

import { useState } from 'react';
import { 
  History, 
  Edit2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  User,
  Clock,
  Calendar,
  BarChart3,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UMBRALES } from '@/data/constants';
import type { Partida, EstadisticasAgregadas } from '@/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface Props {
  partidas: Partida[];
  estadisticas: EstadisticasAgregadas;
  onActualizar: (id: string, datos: Partial<Partida>) => void;
}

// Obtener color según valor y umbral
const getColorPorUmbral = (valor: number, tipo: keyof typeof UMBRALES) => {
  const umbrales = UMBRALES[tipo];
  if (valor >= umbrales.excelente) return 'text-emerald-400';
  if (valor >= umbrales.bueno) return 'text-yellow-400';
  return 'text-red-400';
};

export function HistorialPartidas({ partidas, estadisticas, onActualizar }: Props) {
  const [partidaEditando, setPartidaEditando] = useState<string | null>(null);
  const [datosEdicion, setDatosEdicion] = useState<Partial<Partida>>({});
  const [mostrarStats, setMostrarStats] = useState(true);

  // Iniciar edición
  const iniciarEdicion = (partida: Partida) => {
    setPartidaEditando(partida.id);
    setDatosEdicion({ ...partida });
  };

  // Guardar edición
  const guardarEdicion = () => {
    if (partidaEditando) {
      onActualizar(partidaEditando, datosEdicion);
      setPartidaEditando(null);
      setDatosEdicion({});
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setPartidaEditando(null);
    setDatosEdicion({});
  };

  // Preparar datos para gráficas
  const datosTendencia = [...partidas]
    .sort((a, b) => new Date(`${a.fecha}T${a.hora}`).getTime() - new Date(`${b.fecha}T${b.hora}`).getTime())
    .slice(-20)
    .map(p => ({
      fecha: `${p.fecha.slice(5)} ${p.hora.slice(0, 5)}`,
      kda: Number(p.kda.toFixed(2)),
      acs: p.acs,
      trs: p.trsAntes + p.deltaTRS,
    }));

  const datosPorMapa = Object.entries(estadisticas.porMapa)
    .sort((a, b) => b[1].partidas - a[1].partidas)
    .map(([mapa, stats]) => ({
      mapa,
      winrate: Number(stats.winrate.toFixed(1)),
      partidas: stats.partidas,
    }));

  const datosPorAgente = Object.entries(estadisticas.porAgente)
    .sort((a, b) => b[1].partidas - a[1].partidas)
    .slice(0, 6)
    .map(([agente, stats]) => ({
      agente,
      winrate: Number(stats.winrate.toFixed(1)),
      kda: Number(stats.kdaPromedio.toFixed(2)),
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <History className="w-7 h-7 text-cyan-400" />
              Historial de Partidas
            </h1>
            <p className="text-zinc-400 mt-1">
              {partidas.length} partidas registradas
            </p>
          </div>
          <Button
            onClick={() => setMostrarStats(!mostrarStats)}
            variant="outline"
            className="border-zinc-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {mostrarStats ? 'Ocultar Stats' : 'Ver Stats'}
          </Button>
        </div>
      </div>

      {/* Estadísticas Agregadas */}
      {mostrarStats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">Partidas</p>
              <p className="text-2xl font-bold text-white">{estadisticas.totalPartidas}</p>
              <p className="text-xs text-zinc-500">{estadisticas.victorias}V / {estadisticas.derrotas}D / {estadisticas.empates}E</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">Winrate</p>
              <p className={`text-2xl font-bold ${getColorPorUmbral(estadisticas.winrateGeneral, 'winrate')}`}>
                {estadisticas.winrateGeneral.toFixed(1)}%
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">KDA Prom.</p>
              <p className={`text-2xl font-bold ${getColorPorUmbral(estadisticas.promedioKDA, 'kda')}`}>
                {estadisticas.promedioKDA.toFixed(2)}
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">ACS Prom.</p>
              <p className={`text-2xl font-bold ${getColorPorUmbral(estadisticas.promedioACS, 'acs')}`}>
                {estadisticas.promedioACS.toFixed(0)}
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">HS% Prom.</p>
              <p className={`text-2xl font-bold ${getColorPorUmbral(estadisticas.promedioHS, 'hs')}`}>
                {estadisticas.promedioHS.toFixed(1)}%
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">KAST Prom.</p>
              <p className={`text-2xl font-bold ${getColorPorUmbral(estadisticas.promedioKAST, 'kast')}`}>
                {estadisticas.promedioKAST.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendencia KDA */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Tendencia KDA (Últimas 20)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosTendencia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="fecha" stroke="#666" fontSize={10} tickLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="kda" stroke="#06B6D4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Winrate por Mapa */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Winrate por Mapa</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosPorMapa}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="mapa" stroke="#666" fontSize={11} tickLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Bar dataKey="winrate" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rendimiento por Agente */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Rendimiento por Agente</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosPorAgente} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                    <XAxis type="number" stroke="#666" fontSize={12} tickLine={false} />
                    <YAxis type="category" dataKey="agente" stroke="#666" fontSize={11} tickLine={false} width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Bar dataKey="winrate" name="Winrate %" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="kda" name="KDA" fill="#06B6D4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rendimiento por Horario */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Rendimiento por Horario</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(estadisticas.porHorario).map(([horario, data]) => {
                  const nombres: Record<string, string> = {
                    manana: '🌅 Mañana (6-12)',
                    tarde: '☀️ Tarde (12-18)',
                    noche: '🌙 Noche (18-24)',
                    madrugada: '🌌 Madrugada (0-6)',
                  };
                  return (
                    <div key={horario} className="bg-zinc-800/50 rounded-lg p-4">
                      <p className="text-zinc-300 font-medium">{nombres[horario]}</p>
                      <p className="text-2xl font-bold text-emerald-400">{data.winrate.toFixed(1)}% WR</p>
                      <p className="text-sm text-zinc-500">{data.partidas} partidas • KDA {data.kda.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats por Rol */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Rendimiento por Rol</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(estadisticas.porRol).map(([rol, data]) => (
                <div key={rol} className="bg-zinc-800/50 rounded-lg p-4">
                  <p className="text-zinc-300 font-medium">{rol}</p>
                  <p className="text-xl font-bold text-cyan-400">{data.winrate.toFixed(1)}% WR</p>
                  <p className="text-sm text-zinc-500">{data.partidas} partidas • KDA {data.kdaPromedio.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Partidas */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-lg font-semibold text-white">Lista de Partidas</h3>
        </div>

        {partidas.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">No hay partidas registradas</p>
            <p className="text-zinc-600 text-sm mt-1">
              Ve a "Ingreso de Partida" para agregar tu primera partida
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {partidas.map((partida) => (
              <div key={partida.id} className="p-4 hover:bg-zinc-800/30 transition-colors">
                {partidaEditando === partida.id ? (
                  // Modo Edición
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-zinc-500">Kills</label>
                        <input
                          type="number"
                          value={datosEdicion.kills}
                          onChange={(e) => setDatosEdicion(prev => ({ ...prev, kills: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500">Deaths</label>
                        <input
                          type="number"
                          value={datosEdicion.deaths}
                          onChange={(e) => setDatosEdicion(prev => ({ ...prev, deaths: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500">Assists</label>
                        <input
                          type="number"
                          value={datosEdicion.assists}
                          onChange={(e) => setDatosEdicion(prev => ({ ...prev, assists: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500">ACS</label>
                        <input
                          type="number"
                          value={datosEdicion.acs}
                          onChange={(e) => setDatosEdicion(prev => ({ ...prev, acs: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={guardarEdicion} size="sm" className="bg-emerald-600">
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button onClick={cancelarEdicion} size="sm" variant="outline" className="border-zinc-700">
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Modo Vista
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {/* Resultado */}
                        <span className={`
                          px-2 py-1 rounded text-xs font-medium
                          ${partida.resultado === 'Victoria' ? 'bg-emerald-900/50 text-emerald-400' : ''}
                          ${partida.resultado === 'Derrota' ? 'bg-red-900/50 text-red-400' : ''}
                          ${partida.resultado === 'Empate' ? 'bg-zinc-800 text-zinc-400' : ''}
                        `}>
                          {partida.resultado === 'Victoria' && <TrendingUp className="w-3 h-3 inline mr-1" />}
                          {partida.resultado === 'Derrota' && <TrendingDown className="w-3 h-3 inline mr-1" />}
                          {partida.resultado === 'Empate' && <Minus className="w-3 h-3 inline mr-1" />}
                          {partida.resultado}
                        </span>
                        
                        {/* Fecha y hora */}
                        <span className="text-zinc-500 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {partida.fecha}
                          <Clock className="w-3 h-3 ml-2" />
                          {partida.hora}
                        </span>

                        {/* TRS */}
                        <span className={`text-sm ${partida.deltaTRS >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {partida.deltaTRS > 0 ? '+' : ''}{partida.deltaTRS} RR
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-zinc-300">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                          {partida.mapa}
                        </span>
                        <span className="flex items-center gap-1 text-zinc-300">
                          <User className="w-4 h-4 text-purple-400" />
                          {partida.agente}
                        </span>
                        <span className="text-zinc-500">{partida.rol}</span>
                        <span className="text-zinc-500">{partida.rangoAntes}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                        <span className="text-cyan-400 font-medium">
                          {partida.kills}/{partida.deaths}/{partida.assists} 
                          <span className="text-zinc-500 ml-1">(KDA: {partida.kda.toFixed(2)})</span>
                        </span>
                        <span className="text-zinc-400">ACS: {partida.acs}</span>
                        <span className="text-zinc-400">ADR: {partida.adr}</span>
                        <span className="text-zinc-400">HS: {partida.hsPorcentaje}%</span>
                        <span className="text-zinc-400">KAST: {partida.kast}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => iniciarEdicion(partida)}
                      className="p-2 text-zinc-500 hover:text-cyan-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
