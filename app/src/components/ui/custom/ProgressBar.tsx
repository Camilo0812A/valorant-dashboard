/**
 * Componente de barra de progreso circular y lineal
 * Para mostrar métricas de habilidad y progreso
 */

// ProgressBar component - Linear and circular progress indicators

interface LinearProgressProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

// ============================================
// BARRA DE PROGRESO LINEAL
// ============================================

export function LinearProgress({
  value,
  max = 100,
  label,
  sublabel,
  color = '#06B6D4',
  size = 'md',
  showValue = true,
  className = '',
}: LinearProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: { bar: 'h-1.5', text: 'text-xs' },
    md: { bar: 'h-2.5', text: 'text-sm' },
    lg: { bar: 'h-4', text: 'text-base' },
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <div>
              <span className={`${sizeClasses[size].text} font-medium text-zinc-300`}>
                {label}
              </span>
              {sublabel && (
                <span className="text-xs text-zinc-500 ml-2">{sublabel}</span>
              )}
            </div>
          )}
          {showValue && (
            <span className={`${sizeClasses[size].text} font-semibold`} style={{ color }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${sizeClasses[size].bar}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

// ============================================
// BARRA DE PROGRESO CIRCULAR
// ============================================

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = '#06B6D4',
  label,
  sublabel,
  className = '',
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Determinar color basado en el porcentaje si no se especifica
  const getColor = () => {
    if (color) return color;
    if (percentage >= 80) return '#10B981';
    if (percentage >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const finalColor = getColor();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Círculo de fondo */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={finalColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Valor en el centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">
            {Math.round(percentage)}
          </span>
          <span className="text-xs text-zinc-500">%</span>
        </div>
      </div>
      {label && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-zinc-300">{label}</p>
          {sublabel && <p className="text-xs text-zinc-500">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}

// ============================================
// GRUPO DE MÉTRICAS
// ============================================

interface MetricGroupProps {
  metrics: {
    name: string;
    current: number;
    target: number;
    unit?: string;
  }[];
  className?: string;
}

export function MetricGroup({ metrics, className = '' }: MetricGroupProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {metrics.map((metric, index) => (
        <LinearProgress
          key={index}
          value={metric.current}
          max={metric.target}
          label={metric.name}
          sublabel={`Target: ${metric.target}${metric.unit || ''}`}
          color={metric.current >= metric.target ? '#10B981' : '#06B6D4'}
          size="md"
        />
      ))}
    </div>
  );
}
