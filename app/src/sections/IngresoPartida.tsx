/**
 * Sección Ingreso de Partida
 * Formulario completo para registrar partidas ranked manualmente
 * Esta es la única fuente de datos del dashboard
 */

import { useState } from 'react';
import { Plus, Save, RotateCcw, Trophy, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AGENTES, MAPAS, RANGOS } from '@/data/constants';
import type { Partida, Rol } from '@/types';

interface Props {
  onGuardar: (partida: Omit<Partida, 'id' | 'kd' | 'kda'>) => void;
}

// Estado inicial del formulario
const estadoInicial = {
  fecha: new Date().toISOString().split('T')[0],
  hora: new Date().toTimeString().slice(0, 5),
  episodio: '',
  acto: '',
  mapa: '',
  agente: '',
  rol: '' as Rol | '',
  rangoAntes: '',
  trsAntes: 0,
  deltaTRS: 0,
  resultado: '' as 'Victoria' | 'Derrota' | 'Empate' | '',
  kills: 0,
  deaths: 0,
  assists: 0,
  acs: 0,
  adr: 0,
  ddDelta: 0,
  kast: 0,
  hsPorcentaje: 0,
  primerasKills: 0,
  primerasMuertes: 0,
  multiKills: 0,
  ratingEconomico: 0,
};

export function IngresoPartida({ onGuardar }: Props) {
  const [formData, setFormData] = useState(estadoInicial);
  const [guardado, setGuardado] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  // Calcular KD y KDA en tiempo real para mostrar
  const kdCalculado = formData.deaths > 0 
    ? (formData.kills / formData.deaths).toFixed(2) 
    : formData.kills.toFixed(2);
  const kdaCalculado = formData.deaths > 0 
    ? ((formData.kills + formData.assists) / formData.deaths).toFixed(2) 
    : (formData.kills + formData.assists).toFixed(2);

  // Manejar cambios en inputs
  const handleChange = (campo: string, valor: string | number) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    setGuardado(false);
    setErrores([]);
  };

  // Validar formulario
  const validarFormulario = (): boolean => {
    const erroresValidacion: string[] = [];

    // Campos obligatorios
    const camposObligatorios = [
      { campo: 'fecha', nombre: 'Fecha' },
      { campo: 'hora', nombre: 'Hora' },
      { campo: 'episodio', nombre: 'Episodio' },
      { campo: 'acto', nombre: 'Acto' },
      { campo: 'mapa', nombre: 'Mapa' },
      { campo: 'agente', nombre: 'Agente' },
      { campo: 'rol', nombre: 'Rol' },
      { campo: 'rangoAntes', nombre: 'Rango antes' },
      { campo: 'resultado', nombre: 'Resultado' },
    ];

    camposObligatorios.forEach(({ campo, nombre }) => {
      if (!formData[campo as keyof typeof formData]) {
        erroresValidacion.push(`${nombre} es obligatorio`);
      }
    });

    // Validaciones numéricas
    if (formData.trsAntes < 0 || formData.trsAntes > 100) {
      erroresValidacion.push('TRS debe estar entre 0 y 100');
    }

    if (formData.kills < 0 || formData.deaths < 0 || formData.assists < 0) {
      erroresValidacion.push('Kills, deaths y assists no pueden ser negativos');
    }

    if (formData.hsPorcentaje < 0 || formData.hsPorcentaje > 100) {
      erroresValidacion.push('HS% debe estar entre 0 y 100');
    }

    if (formData.kast < 0 || formData.kast > 100) {
      erroresValidacion.push('KAST debe estar entre 0 y 100');
    }

    setErrores(erroresValidacion);
    return erroresValidacion.length === 0;
  };

  // Guardar partida
  const handleSubmit = () => {
    if (!validarFormulario()) return;

    onGuardar({
      fecha: formData.fecha,
      hora: formData.hora,
      episodio: formData.episodio,
      acto: formData.acto,
      mapa: formData.mapa,
      agente: formData.agente,
      rol: formData.rol as Rol,
      rangoAntes: formData.rangoAntes,
      trsAntes: Number(formData.trsAntes),
      deltaTRS: Number(formData.deltaTRS),
      resultado: formData.resultado as 'Victoria' | 'Derrota' | 'Empate',
      kills: Number(formData.kills),
      deaths: Number(formData.deaths),
      assists: Number(formData.assists),
      acs: Number(formData.acs),
      adr: Number(formData.adr),
      ddDelta: Number(formData.ddDelta),
      kast: Number(formData.kast),
      hsPorcentaje: Number(formData.hsPorcentaje),
      primerasKills: Number(formData.primerasKills),
      primerasMuertes: Number(formData.primerasMuertes),
      multiKills: Number(formData.multiKills),
      ratingEconomico: Number(formData.ratingEconomico),
    });

    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
    
    // Resetear formulario excepto fecha y hora
    setFormData({
      ...estadoInicial,
      fecha: formData.fecha,
      hora: formData.hora,
    });
  };

  // Resetear formulario
  const resetearFormulario = () => {
    if (confirm('¿Estás seguro de limpiar el formulario?')) {
      setFormData(estadoInicial);
      setErrores([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Plus className="w-7 h-7 text-cyan-400" />
          Ingreso de Partida
        </h1>
        <p className="text-zinc-400 mt-1">
          Registra tus partidas ranked manualmente. Esta es la fuente de datos del dashboard.
        </p>
      </div>

      {/* Mensaje de éxito */}
      {guardado && (
        <div className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-4 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">¡Partida guardada exitosamente!</span>
        </div>
      )}

      {/* Errores de validación */}
      {errores.length > 0 && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4">
          <p className="text-red-400 font-medium mb-2">Por favor corrige los siguientes errores:</p>
          <ul className="list-disc list-inside text-red-400 text-sm space-y-1">
            {errores.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Formulario */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-6">
        
        {/* Sección: Información General */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Fecha *</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Hora *</label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => handleChange('hora', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Episodio *</label>
              <input
                type="text"
                placeholder="Ej: 9"
                value={formData.episodio}
                onChange={(e) => handleChange('episodio', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Acto *</label>
              <input
                type="text"
                placeholder="Ej: 1"
                value={formData.acto}
                onChange={(e) => handleChange('acto', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Mapa *</label>
              <select
                value={formData.mapa}
                onChange={(e) => handleChange('mapa', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Seleccionar mapa</option>
                {MAPAS.map(m => (
                  <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Agente *</label>
              <select
                value={formData.agente}
                onChange={(e) => handleChange('agente', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Seleccionar agente</option>
                {AGENTES.map(a => (
                  <option key={a.nombre} value={a.nombre}>{a.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Rol *</label>
              <select
                value={formData.rol}
                onChange={(e) => handleChange('rol', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Seleccionar rol</option>
                <option value="Duelista">Duelista</option>
                <option value="Centinela">Centinela</option>
                <option value="Iniciador">Iniciador</option>
                <option value="Smokes">Smokes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección: Rango y Resultado */}
        <div className="border-t border-zinc-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Rango y Resultado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Rango antes *</label>
              <select
                value={formData.rangoAntes}
                onChange={(e) => handleChange('rangoAntes', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Seleccionar rango</option>
                {RANGOS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">TRS antes (0-100)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.trsAntes}
                onChange={(e) => handleChange('trsAntes', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Delta TRS (+/-)</label>
              <input
                type="number"
                value={formData.deltaTRS}
                onChange={(e) => handleChange('deltaTRS', parseInt(e.target.value) || 0)}
                className={`w-full border rounded-lg p-3 text-white focus:outline-none ${
                  formData.deltaTRS > 0 
                    ? 'bg-emerald-900/30 border-emerald-700' 
                    : formData.deltaTRS < 0 
                      ? 'bg-red-900/30 border-red-700' 
                      : 'bg-zinc-800 border-zinc-700'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Resultado *</label>
              <div className="flex gap-2">
                {(['Victoria', 'Derrota', 'Empate'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => handleChange('resultado', res)}
                    className={`flex-1 py-3 px-2 rounded-lg border transition-all ${
                      formData.resultado === res
                        ? res === 'Victoria'
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : res === 'Derrota'
                            ? 'bg-red-600 border-red-500 text-white'
                            : 'bg-zinc-600 border-zinc-500 text-white'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    {res === 'Victoria' && <TrendingUp className="w-4 h-4 mx-auto" />}
                    {res === 'Derrota' && <TrendingDown className="w-4 h-4 mx-auto" />}
                    {res === 'Empate' && <Minus className="w-4 h-4 mx-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Estadísticas de Rendimiento */}
        <div className="border-t border-zinc-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Estadísticas de Rendimiento
          </h3>
          
          {/* KDA */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Kills</label>
              <input
                type="number"
                min={0}
                value={formData.kills}
                onChange={(e) => handleChange('kills', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Deaths</label>
              <input
                type="number"
                min={0}
                value={formData.deaths}
                onChange={(e) => handleChange('deaths', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Assists</label>
              <input
                type="number"
                min={0}
                value={formData.assists}
                onChange={(e) => handleChange('assists', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* KD/KDA calculado */}
          <div className="bg-zinc-800/50 rounded-lg p-4 mb-4 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-zinc-500 text-sm">KD Calculado</p>
              <p className="text-2xl font-bold text-cyan-400">{kdCalculado}</p>
            </div>
            <div className="text-center">
              <p className="text-zinc-500 text-sm">KDA Calculado</p>
              <p className="text-2xl font-bold text-emerald-400">{kdaCalculado}</p>
            </div>
          </div>

          {/* Stats avanzadas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">ACS</label>
              <input
                type="number"
                min={0}
                value={formData.acs}
                onChange={(e) => handleChange('acs', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">ADR</label>
              <input
                type="number"
                min={0}
                value={formData.adr}
                onChange={(e) => handleChange('adr', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">DDΔ</label>
              <input
                type="number"
                value={formData.ddDelta}
                onChange={(e) => handleChange('ddDelta', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">KAST %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.kast}
                onChange={(e) => handleChange('kast', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">HS %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.hsPorcentaje}
                onChange={(e) => handleChange('hsPorcentaje', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Primeras Kills</label>
              <input
                type="number"
                min={0}
                value={formData.primerasKills}
                onChange={(e) => handleChange('primerasKills', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Primeras Muertes</label>
              <input
                type="number"
                min={0}
                value={formData.primerasMuertes}
                onChange={(e) => handleChange('primerasMuertes', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Multi-kills</label>
              <input
                type="number"
                min={0}
                value={formData.multiKills}
                onChange={(e) => handleChange('multiKills', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-zinc-400 mb-1">Rating Económico</label>
            <input
              type="number"
              value={formData.ratingEconomico}
              onChange={(e) => handleChange('ratingEconomico', parseInt(e.target.value) || 0)}
              className="w-full md:w-1/4 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-6"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Partida
          </Button>
          <Button
            onClick={resetearFormulario}
            variant="outline"
            className="border-zinc-700 text-zinc-400 hover:text-white"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}
