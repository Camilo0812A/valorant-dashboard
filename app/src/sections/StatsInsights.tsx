/**
 * Sección Estadísticas - Análisis detallado del rendimiento
 * Basado únicamente en partidas ingresadas manualmente
 */

import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Target,
  Map,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { StatCard } from '@/components/ui/custom/StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UMBRALES } from '@/data/constants';
import type { EstadisticasAgregadas, Partida } from '@/types';

interface Props {
  estadisticas: EstadisticasAgregadas;
  partidas: Partida[];
}

// Colores para gráficas
const COLORES_PIE = ['#FF4655', '#8B5CF6', '#10B981', '#F59E0B'];

// Obtener color según umbral
const getColorPorUmbral = (valor: number, tipo: keyof typeof UMBRALES) => {
  const umbrales = UMBRALES[tipo];
  if (valor >= umbrales.excelente) return '#10B981';
  if (valor >= umbrales.bueno) return '#F59E0B';
  return '#EF4444';
};

export function StatsInsights({ estadisticas, partidas }: Props) {
  const [pestanaActiva, setPestanaActiva] = useState('general');

  if (partidas.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
        <p className="text-zinc-500 text-lg">No hay partidas registradas</p>
        <p className="text-zinc-600 mt-2">
          Ve a "Ingresar Partida" para comenzar a registrar tus estadísticas
        </p>
      </div>
    );
  }

  // Preparar datos para gráficas
  const datosTendencia = [...partidas]
    .sort((a, b) => new Date(`${a.fecha}T${a.hora}`).getTime() - new Date(`${b.fecha}T${b.hora}`).getTime())
    .slice(-30)
    .map((p, i) => ({
      partida: i + 1,
      kda: Number(p.kda.toFixed(2)),
      acs: p.acs,
      adr: p.adr,
      hs: p.hsPorcentaje,
    }));

  const datosPorMapa = Object.entries(estadisticas.porMapa)
    .sort((a, b) => b[1].partidas - a[1].partidas)
    .map(([mapa, stats]) => ({
      mapa,
      winrate: Number(stats.winrate.toFixed(1)),
      kda: Number(stats.kdaPromedio.toFixed(2)),
      partidas: stats.partidas,
    }));

  const datosPorAgente = Object.entries(estadisticas.porAgente)
    .sort((a, b) => b[1].partidas - a[1].partidas)
    .map(([agente, stats]) => ({
      agente,
      winrate: Number(stats.winrate.toFixed(1)),
      kda: Number(stats.kdaPromedio.toFixed(2)),
      acs: Math.round(stats.acsPromedio),
      partidas: stats.partidas,
    }));

  const datosPorRol = Object.entries(estadisticas.porRol).map(([rol, stats]) => ({
    nombre: rol,
    valor: stats.partidas,
    winrate: stats.winrate,
  }));

  return (
    <div className="space-y-6">
      {/* Tabs de navegación */}
      <Tabs value={pestanaActiva} onValueChange={setPestanaActiva} className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-zinc-800">
            <BarChart3 className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="agentes" className="data-[state=active]:bg-zinc-800">
            <Users className="w-4 h-4 mr-2" />
            Agentes
          </TabsTrigger>
          <TabsTrigger value="mapas" className="data-[state=active]:bg-zinc-800">
            <Map className="w-4 h-4 mr-2" />
            Mapas
          </TabsTrigger>
          <TabsTrigger value="tendencias" className="data-[state=active]:bg-zinc-800">
            <TrendingUp className="w-4 h-4 mr-2" />
            Tendencias
          </TabsTrigger>
        </TabsList>

        {/* Tab: General */}
        <TabsContent value="general" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="KDA Promedio"
              value={estadisticas.promedioKDA.toFixed(2)}
              subtitle="Todas las partidas"
              icon={<Target className="w-5 h-5" />}
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
              icon={<BarChart3 className="w-5 h-5" />}
              color={estadisticas.promedioACS >= 200 ? 'success' : 'warning'}
            />
          </div>

          {/* Stats adicionales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">ADR Promedio</p>
              <p className="text-xl font-bold text-white">{Math.round(estadisticas.promedioADR)}</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">KAST Promedio</p>
              <p className={`text-xl font-bold ${getColorPorUmbral(estadisticas.promedioKAST, 'kast')}`}>
                {estadisticas.promedioKAST.toFixed(1)}%
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">DDΔ Promedio</p>
              <p className="text-xl font-bold text-white">{Math.round(estadisticas.promedioDDDelta)}</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-400 text-sm">FK/FD Ratio</p>
              <p className={`text-xl font-bold ${estadisticas.ratioPrimerasKillsMuertes >= 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                {estadisticas.ratioPrimerasKillsMuertes.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Distribución por rol */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Partidas por Rol</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosPorRol}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="valor"
                  >
                    {datosPorRol.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORES_PIE[index % COLORES_PIE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Agentes */}
        <TabsContent value="agentes" className="space-y-6 mt-6">
          {/* Gráfica de rendimiento por agente */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Rendimiento por Agente</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosPorAgente} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                  <XAxis type="number" stroke="#666" fontSize={12} tickLine={false} />
                  <YAxis type="category" dataKey="agente" stroke="#666" fontSize={12} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="winrate" name="Winrate %" fill="#10B981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="kda" name="KDA" fill="#06B6D4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla de agentes */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">Detalle por Agente</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-zinc-400">Agente</th>
                    <th className="text-center p-3 text-xs font-medium text-zinc-400">Partidas</th>
                    <th className="text-center p-3 text-xs font-medium text-zinc-400">Winrate</th>
                    <th className="text-center p-3 text-xs font-medium text-zinc-400">KDA</th>
                    <th className="text-center p-3 text-xs font-medium text-zinc-400">ACS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {datosPorAgente.map((agente) => (
                    <tr key={agente.agente} className="hover:bg-zinc-800/30">
                      <td className="p-3 text-white font-medium">{agente.agente}</td>
                      <td className="p-3 text-center text-zinc-300">{agente.partidas}</td>
                      <td className="p-3 text-center">
                        <span className={getColorPorUmbral(agente.winrate, 'winrate')}>
                          {agente.winrate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={getColorPorUmbral(agente.kda, 'kda')}>
                          {agente.kda.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3 text-center text-zinc-300">{agente.acs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Mapas */}
        <TabsContent value="mapas" className="space-y-6 mt-6">
          {/* Gráfica de rendimiento por mapa */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Winrate por Mapa</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosPorMapa}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="mapa" stroke="#666" fontSize={12} tickLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="winrate" name="Winrate %" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla de mapas */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">Detalle por Mapa</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-zinc-400">Mapa</th>
                    <th className="text-center p-3 text-xs font-medium text-zinc-400">Partidas</th>
                    <th className="text-center p-3 text-xs font-medium text-zinc-400">Winrate</th>
                    <th className="text-center p-3 text-xs font-medium text-zinc-400">KDA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {datosPorMapa.map((mapa) => (
                    <tr key={mapa.mapa} className="hover:bg-zinc-800/30">
                      <td className="p-3 text-white font-medium">{mapa.mapa}</td>
                      <td className="p-3 text-center text-zinc-300">{mapa.partidas}</td>
                      <td className="p-3 text-center">
                        <span className={getColorPorUmbral(mapa.winrate, 'winrate')}>
                          {mapa.winrate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={getColorPorUmbral(mapa.kda, 'kda')}>
                          {mapa.kda.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mejores/peores mapas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Mejores Mapas
              </h3>
              <div className="space-y-3">
                {datosPorMapa
                  .filter(m => m.partidas >= 3)
                  .sort((a, b) => b.winrate - a.winrate)
                  .slice(0, 3)
                  .map((mapa, index) => (
                    <div 
                      key={mapa.mapa}
                      className="flex items-center justify-between p-3 bg-emerald-900/10 border border-emerald-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold">#{index + 1}</span>
                        <span className="text-white">{mapa.mapa}</span>
                      </div>
                      <span className="text-emerald-400 font-semibold">
                        {mapa.winrate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                Mapas a Mejorar
              </h3>
              <div className="space-y-3">
                {datosPorMapa
                  .filter(m => m.partidas >= 3)
                  .sort((a, b) => a.winrate - b.winrate)
                  .slice(0, 3)
                  .map((mapa, index) => (
                    <div 
                      key={mapa.mapa}
                      className="flex items-center justify-between p-3 bg-red-900/10 border border-red-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-red-400 font-bold">#{index + 1}</span>
                        <span className="text-white">{mapa.mapa}</span>
                      </div>
                      <span className="text-red-400 font-semibold">
                        {mapa.winrate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Tendencias */}
        <TabsContent value="tendencias" className="space-y-6 mt-6">
          {/* Gráfica de evolución */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Evolución de Rendimiento</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosTendencia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="partida" stroke="#666" fontSize={12} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#666" fontSize={12} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="kda" name="KDA" stroke="#06B6D4" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="acs" name="ACS" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="adr" name="ADR" stroke="#F59E0B" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tendencias de stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {datosTendencia.length >= 2 && (
              <>
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Tendencia KDA</h4>
                  <p className={`text-2xl font-bold ${
                    datosTendencia[datosTendencia.length - 1].kda >= datosTendencia[0].kda 
                      ? 'text-emerald-400' 
                      : 'text-red-400'
                  }`}>
                    {datosTendencia[datosTendencia.length - 1].kda >= datosTendencia[0].kda ? '+' : ''}
                    {(datosTendencia[datosTendencia.length - 1].kda - datosTendencia[0].kda).toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Últimas {datosTendencia.length} partidas</p>
                </div>
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Tendencia ACS</h4>
                  <p className={`text-2xl font-bold ${
                    datosTendencia[datosTendencia.length - 1].acs >= datosTendencia[0].acs 
                      ? 'text-emerald-400' 
                      : 'text-red-400'
                  }`}>
                    {datosTendencia[datosTendencia.length - 1].acs >= datosTendencia[0].acs ? '+' : ''}
                    {datosTendencia[datosTendencia.length - 1].acs - datosTendencia[0].acs}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Últimas {datosTendencia.length} partidas</p>
                </div>
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Tendencia HS%</h4>
                  <p className={`text-2xl font-bold ${
                    datosTendencia[datosTendencia.length - 1].hs >= datosTendencia[0].hs 
                      ? 'text-emerald-400' 
                      : 'text-red-400'
                  }`}>
                    {datosTendencia[datosTendencia.length - 1].hs >= datosTendencia[0].hs ? '+' : ''}
                    {(datosTendencia[datosTendencia.length - 1].hs - datosTendencia[0].hs).toFixed(1)}%
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Últimas {datosTendencia.length} partidas</p>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
