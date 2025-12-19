
import React from 'react';
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning, Wind } from 'lucide-react';
import { WeatherCondition } from './types';

export const THEME_COLORS = {
  [WeatherCondition.CLEAR]: 'from-amber-600/20 via-orange-900/10 to-transparent',
  [WeatherCondition.CLOUDS]: 'from-slate-700/20 via-slate-900/10 to-transparent',
  [WeatherCondition.RAIN]: 'from-blue-800/20 via-blue-950/10 to-transparent',
  [WeatherCondition.SNOW]: 'from-cyan-300/10 via-blue-900/5 to-transparent',
  [WeatherCondition.THUNDERSTORM]: 'from-indigo-900/30 via-black to-transparent',
  [WeatherCondition.DRIZZLE]: 'from-cyan-700/15 via-slate-900/10 to-transparent',
  [WeatherCondition.MIST]: 'from-gray-500/15 via-gray-900/10 to-transparent',
};

export const WEATHER_ICONS: Record<WeatherCondition, React.ReactNode> = {
  [WeatherCondition.CLEAR]: <Sun className="w-full h-full text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />,
  [WeatherCondition.CLOUDS]: <Cloud className="w-full h-full text-slate-400 drop-shadow-[0_0_15px_rgba(148,163,184,0.3)]" />,
  [WeatherCondition.RAIN]: <CloudRain className="w-full h-full text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />,
  [WeatherCondition.SNOW]: <Snowflake className="w-full h-full text-cyan-200 drop-shadow-[0_0_15px_rgba(165,243,252,0.5)]" />,
  [WeatherCondition.THUNDERSTORM]: <CloudLightning className="w-full h-full text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />,
  [WeatherCondition.DRIZZLE]: <CloudRain className="w-full h-full text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />,
  [WeatherCondition.MIST]: <Wind className="w-full h-full text-slate-500 drop-shadow-[0_0_15px_rgba(100,116,139,0.3)]" />,
};
