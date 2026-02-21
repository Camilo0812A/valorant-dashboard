/**
 * Componente de checklist interactivo
 * Permite marcar items como completados y persiste en localStorage
 */

import { useState, useEffect } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { ItemChecklist, ChecklistCategory } from '@/types';

interface ChecklistProps {
  items: ItemChecklist[];
  storageKey: string;
  onChange?: (completedCount: number, total: number) => void;
  className?: string;
}

interface ChecklistState {
  items: Record<string, boolean>;
  lastReset: string;
}

const etiquetasCategoria: Record<ChecklistCategory, string> = {
  warmup: 'Calentamiento',
  tech: 'Técnico',
  mental: 'Mental',
  config: 'Configuración',
};

const coloresCategoria: Record<ChecklistCategory, string> = {
  warmup: '#F59E0B',
  tech: '#3B82F6',
  mental: '#8B5CF6',
  config: '#10B981',
};

export function Checklist({ items, storageKey, onChange, className = '' }: ChecklistProps) {
  const [state, setState] = useState<ChecklistState>({
    items: {},
    lastReset: new Date().toISOString().split('T')[0],
  });

  // Cargar desde localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastReset !== today) {
        setState({
          items: {},
          lastReset: today,
        });
      } else {
        setState(parsed);
      }
    }
  }, [storageKey]);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
    if (onChange) {
      const completed = Object.values(state.items).filter(Boolean).length;
      onChange(completed, items.length);
    }
  }, [state, storageKey, items.length, onChange]);

  // Toggle item
  const toggleItem = (itemId: string) => {
    setState(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [itemId]: !prev.items[itemId],
      },
    }));
  };

  // Resetear checklist
  const resetChecklist = () => {
    setState({
      items: {},
      lastReset: new Date().toISOString().split('T')[0],
    });
  };

  // Agrupar items por categoría
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<ChecklistCategory, ItemChecklist[]>);

  // Calcular progreso
  const completedCount = Object.values(state.items).filter(Boolean).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Barra de progreso */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-zinc-400">Progreso</span>
            <span className="text-white font-medium">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={resetChecklist}
          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          title="Resetear checklist"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Items agrupados */}
      {(Object.keys(groupedItems) as ChecklistCategory[]).map(category => {
        const categoryItems = groupedItems[category];
        if (!categoryItems || categoryItems.length === 0) return null;

        return (
          <div key={category}>
            <h4 
              className="text-sm font-semibold mb-3 flex items-center gap-2"
              style={{ color: coloresCategoria[category] }}
            >
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: coloresCategoria[category] }}
              />
              {etiquetasCategoria[category]}
            </h4>
            <div className="space-y-2">
              {categoryItems
                .sort((a: ItemChecklist, b: ItemChecklist) => a.orden - b.orden)
                .map((item: ItemChecklist) => {
                  const isChecked = state.items[item.id] || false;
                  return (
                    <label
                      key={item.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg cursor-pointer
                        transition-all duration-200
                        ${isChecked 
                          ? 'bg-zinc-800/50 border border-zinc-700' 
                          : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
                        }
                      `}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center
                          transition-all duration-200
                          ${isChecked
                            ? 'bg-cyan-500 border-cyan-500'
                            : 'border-zinc-600 hover:border-zinc-500'
                          }
                        `}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <span 
                        className={`
                          text-sm flex-1
                          ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-300'}
                        `}
                      >
                        {item.texto}
                      </span>
                    </label>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// CHECKLIST SIMPLE (sin persistencia)
// ============================================

interface SimpleChecklistProps {
  items: { id: string; texto: string }[];
  checked: string[];
  onToggle: (id: string) => void;
  className?: string;
}

export function SimpleChecklist({ items, checked, onToggle, className = '' }: SimpleChecklistProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map(item => {
        const isChecked = checked.includes(item.id);
        return (
          <label
            key={item.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg cursor-pointer
              transition-all duration-200
              ${isChecked 
                ? 'bg-zinc-800/50 border border-zinc-700' 
                : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
              }
            `}
          >
            <button
              onClick={() => onToggle(item.id)}
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center
                transition-all duration-200
                ${isChecked
                  ? 'bg-cyan-500 border-cyan-500'
                  : 'border-zinc-600 hover:border-zinc-500'
                }
              `}
            >
              {isChecked && <Check className="w-3 h-3 text-white" />}
            </button>
            <span 
              className={`
                text-sm flex-1
                ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-300'}
              `}
            >
              {item.texto}
            </span>
          </label>
        );
      })}
    </div>
  );
}
