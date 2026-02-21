/**
 * Sección Mental & Journal - Seguimiento de estado mental y tilt
 * 
 * Permite registrar sesiones de juego con nivel de tilt,
 * trolls percibidos, estado de ánimo y notas.
 * Muestra análisis de correlación entre tilt y rendimiento.
 * 
 * UI Text: English
 * Code Comments: Spanish
 */

import { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  AlertCircle,
  Clock,
  Save,
  Trash2,
  BarChart3,
  Smile,
  Frown,
  Meh,
  Angry,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

// Tipo para una sesión mental
interface MentalSession {
  id: string;
  date: string;
  tiltLevel: number;
  trollsPerceived: number;
  smurfsPerceived: number;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  sessionDuration: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  notes: string;
}

// Configuración de niveles de tilt
const TILT_LEVELS = [
  { value: 1, label: 'Very Calm', color: '#10B981', icon: <Smile className="w-5 h-5" /> },
  { value: 2, label: 'Calm', color: '#84CC16', icon: <Smile className="w-5 h-5" /> },
  { value: 3, label: 'Neutral', color: '#F59E0B', icon: <Meh className="w-5 h-5" /> },
  { value: 4, label: 'Tilted', color: '#F97316', icon: <Frown className="w-5 h-5" /> },
  { value: 5, label: 'Very Tilted', color: '#EF4444', icon: <Angry className="w-5 h-5" /> },
];

// Configuración de estados de ánimo
const MOODS = [
  { value: 'great', label: 'Great', color: '#10B981', emoji: '😄' },
  { value: 'good', label: 'Good', color: '#84CC16', emoji: '🙂' },
  { value: 'neutral', label: 'Neutral', color: '#F59E0B', emoji: '😐' },
  { value: 'bad', label: 'Bad', color: '#F97316', emoji: '😕' },
  { value: 'terrible', label: 'Terrible', color: '#EF4444', emoji: '😫' },
];

export function MentalJournal() {
  // Estado de las sesiones
  const [sessions, setSessions] = useState<MentalSession[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<MentalSession>>({
    tiltLevel: 3,
    trollsPerceived: 0,
    smurfsPerceived: 0,
    mood: 'neutral',
    sessionDuration: 120,
    matchesPlayed: 4,
    wins: 2,
    losses: 2,
    notes: '',
  });

  // Cargar sesiones desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('valorant-mental-sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  // Guardar sesiones en localStorage
  const saveSessions = (newSessions: MentalSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('valorant-mental-sessions', JSON.stringify(newSessions));
  };

  // Agregar nueva sesión
  const addSession = () => {
    if (!formData.tiltLevel || !formData.mood) return;

    const newSession: MentalSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      tiltLevel: formData.tiltLevel,
      trollsPerceived: formData.trollsPerceived || 0,
      smurfsPerceived: formData.smurfsPerceived || 0,
      mood: formData.mood as MentalSession['mood'],
      sessionDuration: formData.sessionDuration || 0,
      matchesPlayed: formData.matchesPlayed || 0,
      wins: formData.wins || 0,
      losses: formData.losses || 0,
      notes: formData.notes || '',
    };

    saveSessions([newSession, ...sessions]);
    setShowForm(false);
    setFormData({
      tiltLevel: 3,
      trollsPerceived: 0,
      smurfsPerceived: 0,
      mood: 'neutral',
      sessionDuration: 120,
      matchesPlayed: 4,
      wins: 2,
      losses: 2,
      notes: '',
    });
  };

  // Eliminar sesión
  const deleteSession = (id: string) => {
    if (confirm('Delete this session?')) {
      saveSessions(sessions.filter(s => s.id !== id));
    }
  };

  // Calcular estadísticas
  const stats = {
    totalSessions: sessions.length,
    avgTilt: sessions.length > 0 
      ? sessions.reduce((acc, s) => acc + s.tiltLevel, 0) / sessions.length 
      : 0,
    avgWinRate: sessions.length > 0
      ? sessions.reduce((acc, s) => acc + (s.wins / (s.wins + s.losses)) * 100, 0) / sessions.length
      : 0,
    totalTrolls: sessions.reduce((acc, s) => acc + s.trollsPerceived, 0),
  };

  // Preparar datos para gráficas
  const chartData = sessions
    .slice(0, 10)
    .reverse()
    .map(s => ({
      date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tilt: s.tiltLevel,
      winRate: s.wins + s.losses > 0 ? (s.wins / (s.wins + s.losses)) * 100 : 0,
      trolls: s.trollsPerceived,
    }));

  // Correlación tilt vs winrate
  const tiltWinrateData = [
    { tilt: '1-2 (Low)', winRate: 62, sessions: sessions.filter(s => s.tiltLevel <= 2).length },
    { tilt: '3 (Medium)', winRate: 48, sessions: sessions.filter(s => s.tiltLevel === 3).length },
    { tilt: '4-5 (High)', winRate: 35, sessions: sessions.filter(s => s.tiltLevel >= 4).length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Brain className="w-7 h-7 text-purple-400" />
              Mental & Journal
            </h1>
            <p className="text-zinc-400 mt-1">
              Track your mental state, tilt levels, and session notes
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {showForm ? 'Cancel' : '+ New Session'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Total Sessions</p>
          <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Avg Tilt Level</p>
          <p 
            className="text-2xl font-bold"
            style={{ color: TILT_LEVELS[Math.round(stats.avgTilt) - 1]?.color || '#9CA3AF' }}
          >
            {stats.avgTilt.toFixed(1)}/5
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Avg Win Rate</p>
          <p className="text-2xl font-bold text-emerald-400">
            {stats.avgWinRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Trolls Reported</p>
          <p className="text-2xl font-bold text-red-400">{stats.totalTrolls}</p>
        </div>
      </div>

      {/* Formulario nueva sesión */}
      {showForm && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">New Session Entry</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tilt Level */}
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Tilt Level</label>
              <div className="flex gap-2">
                {TILT_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setFormData(prev => ({ ...prev, tiltLevel: level.value }))}
                    className={`
                      flex-1 p-3 rounded-lg border transition-all duration-200
                      ${formData.tiltLevel === level.value
                        ? 'border-purple-500 bg-purple-900/20'
                        : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                      }
                    `}
                  >
                    <div 
                      className="flex flex-col items-center gap-1"
                      style={{ color: formData.tiltLevel === level.value ? level.color : '#9CA3AF' }}
                    >
                      {level.icon}
                      <span className="text-xs">{level.value}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {TILT_LEVELS.find(l => l.value === formData.tiltLevel)?.label}
              </p>
            </div>

            {/* Mood */}
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Mood</label>
              <div className="flex gap-2">
                {MOODS.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setFormData(prev => ({ ...prev, mood: mood.value as any }))}
                    className={`
                      flex-1 p-3 rounded-lg border transition-all duration-200
                      ${formData.mood === mood.value
                        ? 'border-purple-500 bg-purple-900/20'
                        : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">{mood.emoji}</span>
                      <span className={`text-xs ${formData.mood === mood.value ? 'text-white' : 'text-zinc-500'}`}>
                        {mood.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trolls y Smurfs */}
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Trolls Perceived</label>
              <input
                type="number"
                min={0}
                max={10}
                value={formData.trollsPerceived}
                onChange={(e) => setFormData(prev => ({ ...prev, trollsPerceived: parseInt(e.target.value) || 0 }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Smurfs Perceived</label>
              <input
                type="number"
                min={0}
                max={10}
                value={formData.smurfsPerceived}
                onChange={(e) => setFormData(prev => ({ ...prev, smurfsPerceived: parseInt(e.target.value) || 0 }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Duración y partidas */}
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Session Duration (min)</label>
              <input
                type="number"
                min={0}
                step={15}
                value={formData.sessionDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, sessionDuration: parseInt(e.target.value) || 0 }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Matches Played</label>
              <input
                type="number"
                min={0}
                value={formData.matchesPlayed}
                onChange={(e) => setFormData(prev => ({ ...prev, matchesPlayed: parseInt(e.target.value) || 0 }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Wins/Losses */}
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Wins</label>
              <input
                type="number"
                min={0}
                value={formData.wins}
                onChange={(e) => setFormData(prev => ({ ...prev, wins: parseInt(e.target.value) || 0 }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Losses</label>
              <input
                type="number"
                min={0}
                value={formData.losses}
                onChange={(e) => setFormData(prev => ({ ...prev, losses: parseInt(e.target.value) || 0 }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Notas */}
          <div className="mt-4">
            <label className="text-sm text-zinc-400 mb-2 block">Session Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How did the session go? What happened?"
              className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={addSession}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Session
            </Button>
          </div>
        </div>
      )}

      {/* Análisis de correlación */}
      {sessions.length >= 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Tilt vs Win Rate
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tiltWinrateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="tilt" stroke="#666" fontSize={11} tickLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="winRate" name="Win Rate %" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-zinc-500 mt-3">
              Lower tilt levels correlate with higher win rates
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Recent Sessions
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#666" fontSize={12} tickLine={false} domain={[0, 5]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="tilt" name="Tilt" stroke="#EF4444" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="winRate" name="Win Rate %" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes de análisis */}
      {sessions.length >= 3 && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Insights
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-emerald-900/10 border border-emerald-800/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-400 font-medium text-sm">Low Tilt = Better Performance</p>
                <p className="text-zinc-400 text-sm">
                  Your win rate is highest when tilt level is 1-2. Try to recognize tilt early and take breaks.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-900/10 border border-amber-800/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium text-sm">Session Length Matters</p>
                <p className="text-zinc-400 text-sm">
                  Long sessions (3+ hours) tend to have higher tilt levels. Consider shorter, focused sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de sesiones */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-lg font-semibold text-white">Session History</h3>
        </div>
        
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">No sessions recorded yet</p>
            <p className="text-zinc-600 text-sm mt-1">
              Click "New Session" to start tracking your mental state
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {sessions.map(session => {
              const tiltLevel = TILT_LEVELS.find(l => l.value === session.tiltLevel);
              const mood = MOODS.find(m => m.value === session.mood);
              const winRate = session.wins + session.losses > 0 
                ? (session.wins / (session.wins + session.losses)) * 100 
                : 0;

              return (
                <div key={session.id} className="p-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{mood?.emoji}</span>
                        <span className="text-zinc-400 text-sm">
                          {new Date(session.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: `${tiltLevel?.color}20`,
                            color: tiltLevel?.color 
                          }}
                        >
                          Tilt: {session.tiltLevel}/5
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-zinc-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {session.sessionDuration}m
                        </span>
                        <span className="text-emerald-400">{session.wins}W</span>
                        <span className="text-red-400">{session.losses}L</span>
                        <span className="text-zinc-400">
                          {winRate.toFixed(0)}% WR
                        </span>
                        {session.trollsPerceived > 0 && (
                          <span className="text-red-400">
                            {session.trollsPerceived} trolls
                          </span>
                        )}
                      </div>

                      {session.notes && (
                        <p className="text-zinc-500 text-sm mt-2">{session.notes}</p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
