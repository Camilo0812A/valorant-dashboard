/**
 * Sección Network & Tech - Configuración de red y técnica
 * 
 * Permite registrar valores de ping a diferentes servidores
 * y muestra recomendaciones para optimizar la conexión.
 * 
 * UI Text: English
 * Code Comments: Spanish
 */

import { useState, useEffect } from 'react';
import {
  Wifi,
  Server,
  MapPin,
  Save,
  Check,
  AlertCircle,
  EthernetPort,
  Download,
  Monitor,
  Router,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Configuración de servidores
const SERVERS = {
  bogota: {
    name: 'Bogotá (LATAM)',
    location: 'Colombia',
    flag: '🇨🇴',
    recommended: true,
    description: 'Best for Cúcuta players - Low latency',
  },
  miami: {
    name: 'Miami (NA)',
    location: 'USA',
    flag: '🇺🇸',
    recommended: false,
    description: 'Alternative server - Higher ping but stable',
  },
};

// Checklist técnico
const TECH_CHECKLIST = [
  { id: 'ethernet', text: 'Ethernet cable connected', icon: EthernetPort },
  { id: 'downloads', text: 'Downloads paused / closed', icon: Download },
  { id: 'streaming', text: 'Streaming apps closed', icon: Monitor },
  { id: 'router', text: 'Router restarted recently', icon: Router },
  { id: 'game-mode', text: 'Windows Game Mode enabled', icon: Zap },
];

interface PingData {
  avg: number;
  min: number;
  max: number;
  packetLoss: number;
  jitter: number;
  lastTested: string;
}

interface NetworkState {
  bogota: PingData;
  miami: PingData;
  checklist: Record<string, boolean>;
}

const defaultPingData: PingData = {
  avg: 0,
  min: 0,
  max: 0,
  packetLoss: 0,
  jitter: 0,
  lastTested: '',
};

export function NetworkTech() {
  // Estado de la red
  const [networkState, setNetworkState] = useState<NetworkState>({
    bogota: { ...defaultPingData, avg: 45, min: 38, max: 62 },
    miami: { ...defaultPingData, avg: 85, min: 72, max: 110 },
    checklist: {},
  });

  // Estado para edición
  const [editingServer, setEditingServer] = useState<string | null>(null);
  const [editData, setEditData] = useState<PingData>(defaultPingData);

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('valorant-network-config');
    if (saved) {
      setNetworkState(JSON.parse(saved));
    }
  }, []);

  // Guardar en localStorage
  const saveNetworkState = (newState: NetworkState) => {
    setNetworkState(newState);
    localStorage.setItem('valorant-network-config', JSON.stringify(newState));
  };

  // Iniciar edición
  const startEdit = (server: string) => {
    setEditingServer(server);
    setEditData(networkState[server as keyof NetworkState] as PingData);
  };

  // Guardar edición
  const saveEdit = () => {
    if (!editingServer) return;
    
    const newState = {
      ...networkState,
      [editingServer]: {
        ...editData,
        lastTested: new Date().toISOString(),
      },
    };
    
    saveNetworkState(newState);
    setEditingServer(null);
  };

  // Toggle checklist item
  const toggleChecklistItem = (id: string) => {
    const newState = {
      ...networkState,
      checklist: {
        ...networkState.checklist,
        [id]: !networkState.checklist[id],
      },
    };
    saveNetworkState(newState);
  };

  // Obtener color según ping
  const getPingColor = (ping: number): string => {
    if (ping <= 50) return '#10B981'; // Verde - Excelente
    if (ping <= 80) return '#F59E0B'; // Amarillo - Aceptable
    return '#EF4444'; // Rojo - Malo
  };

  // Obtener calidad del ping
  const getPingQuality = (ping: number): string => {
    if (ping <= 50) return 'Excellent';
    if (ping <= 80) return 'Good';
    if (ping <= 120) return 'Fair';
    return 'Poor';
  };

  const completedChecks = Object.values(networkState.checklist).filter(Boolean).length;
  const totalChecks = TECH_CHECKLIST.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Wifi className="w-7 h-7 text-cyan-400" />
          Network & Tech
        </h1>
        <p className="text-zinc-400 mt-1">
          Monitor your ping and optimize your connection
        </p>
      </div>

      {/* Servidores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(SERVERS).map(([key, server]) => {
          const pingData = networkState[key as keyof NetworkState] as PingData;
          const isEditing = editingServer === key;
          const pingColor = getPingColor(pingData.avg);

          return (
            <div 
              key={key}
              className={`
                bg-zinc-900 rounded-xl border overflow-hidden
                ${server.recommended ? 'border-emerald-800/50' : 'border-zinc-800'}
              `}
            >
              {/* Header */}
              <div 
                className={`p-4 border-b ${server.recommended ? 'bg-emerald-900/10 border-emerald-800/30' : 'border-zinc-800'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{server.flag}</span>
                    <div>
                      <h3 className="font-semibold text-white">{server.name}</h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {server.location}
                      </p>
                    </div>
                  </div>
                  {server.recommended && (
                    <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded font-medium">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-zinc-500 text-sm mt-2">{server.description}</p>
              </div>

              {/* Ping Stats */}
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Avg Ping (ms)</label>
                        <input
                          type="number"
                          value={editData.avg}
                          onChange={(e) => setEditData(prev => ({ ...prev, avg: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Min Ping (ms)</label>
                        <input
                          type="number"
                          value={editData.min}
                          onChange={(e) => setEditData(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Max Ping (ms)</label>
                        <input
                          type="number"
                          value={editData.max}
                          onChange={(e) => setEditData(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Packet Loss (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editData.packetLoss}
                          onChange={(e) => setEditData(prev => ({ ...prev, packetLoss: parseFloat(e.target.value) || 0 }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button onClick={() => setEditingServer(null)} size="sm" variant="outline" className="border-zinc-700">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-zinc-400 text-sm">Average Ping</p>
                        <p className="text-3xl font-bold" style={{ color: pingColor }}>
                          {pingData.avg}ms
                        </p>
                        <p className="text-xs" style={{ color: pingColor }}>
                          {getPingQuality(pingData.avg)}
                        </p>
                      </div>
                      <Button 
                        onClick={() => startEdit(key)} 
                        variant="outline" 
                        size="sm"
                        className="border-zinc-700 text-zinc-400"
                      >
                        Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-2 bg-zinc-800/50 rounded">
                        <p className="text-lg font-semibold text-zinc-300">{pingData.min}</p>
                        <p className="text-xs text-zinc-500">Min</p>
                      </div>
                      <div className="text-center p-2 bg-zinc-800/50 rounded">
                        <p className="text-lg font-semibold text-zinc-300">{pingData.max}</p>
                        <p className="text-xs text-zinc-500">Max</p>
                      </div>
                      <div className="text-center p-2 bg-zinc-800/50 rounded">
                        <p className="text-lg font-semibold text-zinc-300">{pingData.packetLoss}%</p>
                        <p className="text-xs text-zinc-500">Loss</p>
                      </div>
                    </div>

                    {pingData.lastTested && (
                      <p className="text-zinc-600 text-xs mt-3">
                        Last updated: {new Date(pingData.lastTested).toLocaleDateString('en-US')}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recomendaciones */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          Connection Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-900/10 border border-emerald-800/50 rounded-lg">
            <h4 className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
              <span className="text-lg">🇨🇴</span>
              Bogotá Server
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                Best choice for Cúcuta players
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                Expected ping: 40-60ms
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                Use Ethernet for best stability
              </li>
            </ul>
          </div>

          <div className="p-4 bg-blue-900/10 border border-blue-800/50 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
              <span className="text-lg">🇺🇸</span>
              Miami Server
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                Higher ping (80-110ms)
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                Alternative if Bogotá is unstable
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                Good for late night queues
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Checklist técnico */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            Technical Checklist
          </h3>
          <span className="text-sm text-zinc-500">
            {completedChecks}/{totalChecks} completed
          </span>
        </div>

        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${(completedChecks / totalChecks) * 100}%` }}
          />
        </div>

        <div className="space-y-2">
          {TECH_CHECKLIST.map(item => {
            const Icon = item.icon;
            const isChecked = networkState.checklist[item.id];

            return (
              <label
                key={item.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg cursor-pointer
                  transition-all duration-200
                  ${isChecked 
                    ? 'bg-zinc-800/50 border border-zinc-700' 
                    : 'bg-zinc-800/30 border border-zinc-800 hover:border-zinc-700'
                  }
                `}
              >
                <button
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                    transition-all duration-200
                    ${isChecked
                      ? 'bg-purple-500 border-purple-500'
                      : 'border-zinc-600 hover:border-zinc-500'
                    }
                  `}
                >
                  {isChecked && <Check className="w-3 h-3 text-white" />}
                </button>
                <Icon className={`w-5 h-5 ${isChecked ? 'text-zinc-500' : 'text-zinc-400'}`} />
                <span 
                  className={`
                    text-sm flex-1
                    ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-300'}
                  `}
                >
                  {item.text}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Tips adicionales */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Additional Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">1</span>
              </div>
              <p className="text-zinc-400">
                <span className="text-white font-medium">Use Ethernet:</span> Always prefer cable over WiFi for gaming.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">2</span>
              </div>
              <p className="text-zinc-400">
                <span className="text-white font-medium">Close Background Apps:</span> Discord, Chrome, Spotify can affect performance.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">3</span>
              </div>
              <p className="text-zinc-400">
                <span className="text-white font-medium">Update Drivers:</span> Keep network and GPU drivers updated.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">4</span>
              </div>
              <p className="text-zinc-400">
                <span className="text-white font-medium">Disable Windows Updates:</span> Pause during gaming sessions.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">5</span>
              </div>
              <p className="text-zinc-400">
                <span className="text-white font-medium">QoS Settings:</span> Enable Quality of Service on your router for gaming.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">6</span>
              </div>
              <p className="text-zinc-400">
                <span className="text-white font-medium">DNS:</span> Try Google DNS (8.8.8.8) or Cloudflare (1.1.1.1).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
