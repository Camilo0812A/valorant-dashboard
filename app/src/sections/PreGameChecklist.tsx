/**
 * Sección Pre-game Checklist - Checklist antes de jugar
 * 
 * Lista de verificación configurable para prepararse antes
 * de sesiones de ranked. Persiste en localStorage.
 * 
 * UI Text: English
 * Code Comments: Spanish
 */

import { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Target,
  Wifi,
  Settings,
  Brain,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CHECKLIST_PRE_GAME_DEFAULT } from '@/data/constants';

// Tipo para items del checklist
interface ChecklistItem {
  id: string;
  text: string;
  category: 'warmup' | 'tech' | 'config' | 'mental';
  completed: boolean;
  order: number;
}

// Configuración de categorías
const categories = {
  warmup: { label: 'Warmup', icon: Target, color: '#F59E0B' },
  tech: { label: 'Technical', icon: Wifi, color: '#3B82F6' },
  config: { label: 'Configuration', icon: Settings, color: '#10B981' },
  mental: { label: 'Mental', icon: Brain, color: '#8B5CF6' },
};

export function PreGameChecklist() {
  // Estado del checklist
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [lastReset, setLastReset] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ChecklistItem['category']>('warmup');
  const [showAddForm, setShowAddForm] = useState(false);

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('valorant-pregame-checklist');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      
      // Resetear si es un nuevo día
      if (parsed.lastReset !== today) {
        setItems(CHECKLIST_PRE_GAME_DEFAULT.map((item: ChecklistItem) => ({ ...item, completed: false })));
        setLastReset(today);
      } else {
        setItems(parsed.items || CHECKLIST_PRE_GAME_DEFAULT);
        setLastReset(parsed.lastReset);
      }
    } else {
      setItems(CHECKLIST_PRE_GAME_DEFAULT);
      setLastReset(new Date().toISOString().split('T')[0]);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('valorant-pregame-checklist', JSON.stringify({
        items,
        lastReset,
      }));
    }
  }, [items, lastReset]);

  // Toggle item completado
  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // Resetear checklist
  const resetChecklist = () => {
    if (confirm('Reset all items? This will uncheck everything.')) {
      setItems(prev => prev.map(item => ({ ...item, completed: false })));
      setLastReset(new Date().toISOString().split('T')[0]);
    }
  };

  // Agregar nuevo item
  const addItem = () => {
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      category: newItemCategory,
      completed: false,
      order: items.length + 1,
    };

    setItems(prev => [...prev, newItem]);
    setNewItemText('');
    setShowAddForm(false);
  };

  // Eliminar item
  const deleteItem = (id: string) => {
    if (id.startsWith('custom-') && confirm('Delete this item?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Iniciar edición
  const startEdit = (item: ChecklistItem) => {
    setEditingItem(item.id);
    setEditText(item.text);
  };

  // Guardar edición
  const saveEdit = () => {
    if (!editText.trim()) return;
    
    setItems(prev => prev.map(item =>
      item.id === editingItem ? { ...item, text: editText.trim() } : item
    ));
    setEditingItem(null);
    setEditText('');
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingItem(null);
    setEditText('');
  };

  // Calcular progreso
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Agrupar por categoría
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<ChecklistItem['category'], ChecklistItem[]>);

  // Ordenar categorías
  const categoryOrder: ChecklistItem['category'][] = ['warmup', 'tech', 'config', 'mental'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ClipboardCheck className="w-7 h-7 text-cyan-400" />
              Pre-game Checklist
            </h1>
            <p className="text-zinc-400 mt-1">
              Complete these steps before starting ranked
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={resetChecklist}
              className="border-zinc-700 text-zinc-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Progreso */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-300 font-medium">Completion Progress</span>
          <span className="text-white font-bold">{completedCount}/{totalCount}</span>
        </div>
        <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-zinc-500 text-sm mt-2">
          {progress === 100 
            ? 'All set! You\'re ready to play.' 
            : `${Math.round(progress)}% completed - ${totalCount - completedCount} items remaining`
          }
        </p>
      </div>

      {/* Formulario para agregar item */}
      {showAddForm && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Item</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Enter checklist item..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as ChecklistItem['category'])}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
            >
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key}>{cat.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button onClick={addItem} className="bg-cyan-600 hover:bg-cyan-700">
                <Save className="w-4 h-4 mr-2" />
                Add
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="border-zinc-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Checklist agrupado */}
      <div className="space-y-6">
        {categoryOrder.map(category => {
          const categoryItems = groupedItems[category];
          if (!categoryItems || categoryItems.length === 0) return null;

          const config = categories[category];
          const CategoryIcon = config.icon;
          const categoryCompleted = categoryItems.filter(i => i.completed).length;

          return (
            <div key={category} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              {/* Header de categoría */}
              <div 
                className="p-4 border-b border-zinc-800 flex items-center justify-between"
                style={{ backgroundColor: `${config.color}10` }}
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon className="w-5 h-5" style={{ color: config.color }} />
                  <h3 className="font-semibold text-white">{config.label}</h3>
                  <span className="text-zinc-500 text-sm">
                    ({categoryCompleted}/{categoryItems.length})
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-2">
                {categoryItems
                  .sort((a, b) => a.order - b.order)
                  .map(item => (
                    <div
                      key={item.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg
                        transition-all duration-200
                        ${item.completed 
                          ? 'bg-zinc-800/50 border border-zinc-700' 
                          : 'bg-zinc-800/30 border border-zinc-800 hover:border-zinc-700'
                        }
                      `}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`
                          w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0
                          transition-all duration-200
                          ${item.completed
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-zinc-600 hover:border-zinc-500'
                          }
                        `}
                      >
                        {item.completed && <Check className="w-4 h-4 text-white" />}
                      </button>

                      {editingItem === item.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-cyan-500"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                          <button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-400">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span 
                            className={`
                              flex-1 text-sm
                              ${item.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}
                            `}
                          >
                            {item.text}
                          </span>
                          
                          {item.id.startsWith('custom-') && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => startEdit(item)}
                                className="p-1.5 text-zinc-500 hover:text-cyan-400 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje de completado */}
      {progress === 100 && (
        <div className="bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 rounded-xl p-6 border border-emerald-800/50 text-center">
          <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Ready to Climb!</h3>
          <p className="text-zinc-400">
            You've completed all pre-game checks. Good luck in your matches!
          </p>
        </div>
      )}
    </div>
  );
}
