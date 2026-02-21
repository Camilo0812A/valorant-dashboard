/**
 * Hook personalizado para manejar localStorage de forma segura
 * 
 * Este hook encapsula toda la lógica de localStorage para que
 * en el futuro puedas cambiar fácilmente a otra solución de
 * persistencia (IndexedDB, backend, etc.) sin modificar los componentes.
 * 
 * Características:
 * - Maneja errores de JSON parse/stringify
 * - Funciona con SSR (server-side rendering)
 * - Sincroniza entre pestañas del navegador
 * - Tipado con TypeScript
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para persistir estado en localStorage
 * @param key - Clave para localStorage
 * @param initialValue - Valor inicial si no existe en storage
 * @returns [value, setValue, removeValue] - Estado y funciones de control
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Cargar valor desde localStorage al montar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        setStoredValue(parsed);
      }
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Función para actualizar el valor
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Permitir actualización funcional
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Guardar en estado
        setStoredValue(valueToStore);
        
        // Guardar en localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Función para eliminar el valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Escuchar cambios desde otras pestañas
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const parsed = JSON.parse(event.newValue);
          setStoredValue(parsed);
        } catch (error) {
          console.warn(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook específico para el checklist pre-game
 * Mantiene el estado entre sesiones
 */
export function useChecklistStorage() {
  return useLocalStorage('valorant-checklist', {
    lastReset: new Date().toISOString().split('T')[0],
    items: {},
  });
}

/**
 * Hook para el journal mental
 */
export function useJournalStorage() {
  return useLocalStorage('valorant-journal', {
    sessions: [],
    lastEntry: null,
  });
}

/**
 * Hook para notas de agentes/mapas
 */
export function useAgentNotesStorage() {
  return useLocalStorage<Record<string, string>>('valorant-agent-notes', {});
}

/**
 * Hook para configuración de red
 */
export function useNetworkStorage() {
  return useLocalStorage('valorant-network', {
    bogota: { avg: 45, min: 38, max: 62 },
    miami: { avg: 85, min: 72, max: 110 },
  });
}

/**
 * Hook para el plan de entrenamiento
 */
export function useTrainingStorage() {
  return useLocalStorage('valorant-training', {
    currentDay: new Date().toISOString().split('T')[0],
    completedTasks: [],
    streak: 0,
  });
}
