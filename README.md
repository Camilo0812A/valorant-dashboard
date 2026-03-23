# Valorant Improvement Dashboard

Dashboard personalizado para mejorar en Valorant, con seguimiento de estadísticas, plan de entrenamiento, análisis mental y más.

![Dashboard Preview](https://via.placeholder.com/800x400/0a0a0a/06B6D4?text=Valorant+Dashboard)

## Características

- **Overview**: Resumen general del jugador, metas y métricas de habilidad
- **Stats & Insights**: Estadísticas detalladas por agente y mapa con gráficas
- **Training Plan**: Plan de entrenamiento diario con checklist interactiva
- **Agents & Maps**: Plantillas para setups, lineups y notas personalizadas
- **Mental & Journal**: Seguimiento de tilt, estado de ánimo y sesiones
- **Pre-game Checklist**: Lista de verificación antes de jugar ranked
- **Network & Tech**: Monitoreo de ping y optimización de conexión

## Stack Tecnológico

- **React 18** + **Vite** - Framework y build tool
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **shadcn/ui** - Componentes UI accesibles
- **Recharts** - Gráficas y visualizaciones
- **Lucide React** - Iconos

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd valorant-dashboard

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (http://localhost:5173)
npm run build    # Build para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Ejecutar ESLint
```

## Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. El build se ejecuta automáticamente
3. Configuración por defecto funciona sin cambios

### Netlify

1. Conecta tu repositorio a Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Manual

```bash
npm run build
# Subir la carpeta 'dist' a tu hosting
```

## Configuración

### Datos del Jugador

Edita `src/data/constants.ts` para cambiar:

```typescript
export const PLAYER_CONFIG = {
  player: {
    riotId: 'hola0812A',    // Tu Riot ID
    tag: 'LAN',              // Tu tag de región
    region: 'LATAM',
    currentRank: 'Unranked',
    peakRank: 'Platinum 2',
    level: 89,
    playtimeHours: 450,
  },
  goals: {
    targetRank: 'Diamond',
    timeframe: '6 months',
    focusAgents: ['Chamber', 'Jett', 'Omen'],
    mainRole: 'Entry / Support',
  },
};
```

### Integración con Tracker.gg

Actualmente el dashboard usa datos mock. Para conectar con Tracker.gg real:

1. Implementa un backend proxy para evitar CORS
2. Actualiza `src/hooks/usePlayerData.ts`
3. Reemplaza las llamadas mock con fetch reales

```typescript
// Ejemplo de integración
const response = await fetch('/api/tracker/profile/hola0812A/LAN');
const data = await response.json();
```

## Estructura del Proyecto

```
src/
├── components/
│   └── ui/
│       ├── custom/          # Componentes personalizados
│       │   ├── StatCard.tsx
│       │   ├── ProgressBar.tsx
│       │   ├── InsightCard.tsx
│       │   └── Checklist.tsx
│       └── ...              # Componentes shadcn/ui
├── sections/                # Secciones principales
│   ├── Overview.tsx
│   ├── StatsInsights.tsx
│   ├── TrainingPlan.tsx
│   ├── AgentsMaps.tsx
│   ├── MentalJournal.tsx
│   ├── PreGameChecklist.tsx
│   └── NetworkTech.tsx
├── hooks/                   # Hooks personalizados
│   ├── useLocalStorage.ts
│   └── usePlayerData.ts
├── data/                    # Datos y constantes
│   ├── constants.ts
│   └── mockData.ts
├── types/                   # Tipos TypeScript
│   └── index.ts
├── utils/                   # Utilidades
│   └── formatters.ts
├── App.tsx                  # Componente principal
└── index.css                # Estilos globales
```

## Persistencia de Datos

Todos los datos personales se guardan en **localStorage**:

- `valorant-checklist` - Estado del checklist pre-game
- `valorant-journal` - Sesiones de journal mental
- `valorant-training-day` - Progreso del plan de entrenamiento
- `valorant-agent-notes` - Notas de agentes y mapas
- `valorant-network-config` - Configuración de ping
- `valorant-mental-sessions` - Historial de sesiones mentales
- `valorant-pregame-checklist` - Checklist personalizado

## Personalización

### Colores

Los colores principales se definen en `tailwind.config.js`:

```javascript
colors: {
  background: '#0a0a0a',
  surface: '#1a1a1a',
  border: '#333333',
  accent: '#06B6D4',      // Cyan
  accentSecondary: '#8B5CF6', // Purple
}
```

### Agentes Foco

Edita el array en `src/sections/AgentsMaps.tsx`:

```typescript
const FOCUS_AGENTS = ['Chamber', 'Jett', 'Omen'];
```

### Tareas de Entrenamiento

Modifica `DEFAULT_TRAINING_TASKS` en `src/data/constants.ts`.

## Licencia

MIT - Uso personal libre.

---

**Nota**: Este proyecto no está afiliado con Riot Games. Valorant es una marca registrada de Riot Games, Inc.
