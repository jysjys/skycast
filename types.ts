
export enum WeatherCondition {
  CLEAR = 'Clear',
  CLOUDS = 'Clouds',
  RAIN = 'Rain',
  SNOW = 'Snow',
  THUNDERSTORM = 'Thunderstorm',
  DRIZZLE = 'Drizzle',
  MIST = 'Mist'
}

export interface CurrentWeather {
  city: string;
  temp: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  description: string;
  timestamp: number;
}

export interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
}

export interface SearchHistoryItem {
  id: string;
  city: string;
  timestamp: number;
}
