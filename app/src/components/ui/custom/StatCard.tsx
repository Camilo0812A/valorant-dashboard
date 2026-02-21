/**
 * Componente de tarjeta de estadísticas
 * Muestra un valor numérico con título, icono y tendencia
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'same';
    value: string;
  };
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const colorVariants = {
  default: {
    bg: 'bg-zinc-900',
    border: 'border-zinc-800',
    iconBg: 'bg-zinc-800',
    iconColor: 'text-zinc-400',
  },
  success: {
    bg: 'bg-zinc-900',
    border: 'border-emerald-900/50',
    iconBg: 'bg-emerald-900/30',
    iconColor: 'text-emerald-400',
  },
  warning: {
    bg: 'bg-zinc-900',
    border: 'border-amber-900/50',
    iconBg: 'bg-amber-900/30',
    iconColor: 'text-amber-400',
  },
  danger: {
    bg: 'bg-zinc-900',
    border: 'border-red-900/50',
    iconBg: 'bg-red-900/30',
    iconColor: 'text-red-400',
  },
  info: {
    bg: 'bg-zinc-900',
    border: 'border-cyan-900/50',
    iconBg: 'bg-cyan-900/30',
    iconColor: 'text-cyan-400',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'default',
  className = '',
}: StatCardProps) {
  const colors = colorVariants[color];

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-zinc-500" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up':
        return 'text-emerald-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-zinc-500';
    }
  };

  return (
    <div
      className={`
        ${colors.bg} 
        border ${colors.border} 
        rounded-xl p-4 
        transition-all duration-200
        hover:border-zinc-700
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-zinc-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-zinc-500 text-xs mt-0.5">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon()}
              <span className={`text-xs font-medium ${getTrendColor()}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${colors.iconBg} ${colors.iconColor} p-2.5 rounded-lg`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
