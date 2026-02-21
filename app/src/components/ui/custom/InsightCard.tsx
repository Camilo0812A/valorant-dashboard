/**
 * Componente de tarjeta de insight/análisis
 * Muestra recomendaciones y análisis automáticos
 */

import { Lightbulb, AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';
import type { Insight } from '@/types';

interface InsightCardProps {
  insight: Insight;
  className?: string;
}

const iconosTipo = {
  fortaleza: TrendingUp,
  debilidad: AlertTriangle,
  oportunidad: Lightbulb,
  alerta: AlertCircle,
};

const coloresTipo = {
  fortaleza: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: '#10B981',
    text: '#10B981',
    icon: '💪',
  },
  debilidad: {
    bg: 'rgba(239, 68, 68, 0.1)',
    border: '#EF4444',
    text: '#EF4444',
    icon: '⚠️',
  },
  oportunidad: {
    bg: 'rgba(59, 130, 246, 0.1)',
    border: '#3B82F6',
    text: '#3B82F6',
    icon: '💡',
  },
  alerta: {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: '#F59E0B',
    text: '#F59E0B',
    icon: '⚡',
  },
};

export function InsightCard({ insight, className = '' }: InsightCardProps) {
  const colores = coloresTipo[insight.tipo];
  const Icon = iconosTipo[insight.tipo] || Lightbulb;

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border p-4
        transition-all duration-200 hover:scale-[1.02]
        ${className}
      `}
      style={{
        backgroundColor: colores.bg,
        borderColor: colores.border,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${colores.border}40` }}
        >
          <Icon className="w-5 h-5" style={{ color: colores.text }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: colores.text }}
            >
              {insight.categoria}
            </span>
            <span className="text-zinc-600">•</span>
            <span
              className="text-xs capitalize"
              style={{ color: colores.text }}
            >
              {insight.tipo}
            </span>
          </div>

          <p className="text-white font-medium text-sm leading-relaxed">
            {insight.mensaje}
          </p>

          {insight.recomendacion && (
            <div className="mt-2 pt-2 border-t border-zinc-800/50">
              <p className="text-zinc-400 text-xs">
                <span className="text-zinc-500">Recomendación: </span>
                {insight.recomendacion}
              </p>
            </div>
          )}
        </div>
      </div>

      {insight.prioridad <= 3 && (
        <div
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: colores.text }}
          title={`Prioridad: ${insight.prioridad}`}
        />
      )}
    </div>
  );
}

// ============================================
// LISTA DE INSIGHTS
// ============================================

interface InsightListProps {
  insights: Insight[];
  maxItems?: number;
  className?: string;
}

export function InsightList({ insights, maxItems = 6, className = '' }: InsightListProps) {
  const displayedInsights = insights.slice(0, maxItems);

  if (insights.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Lightbulb className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">No hay insights disponibles aún.</p>
        <p className="text-zinc-600 text-xs mt-1">
          Juega más partidas para generar insights personalizados.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {displayedInsights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
      {insights.length > maxItems && (
        <p className="text-center text-zinc-500 text-xs pt-2">
          +{insights.length - maxItems} insights más
        </p>
      )}
    </div>
  );
}
