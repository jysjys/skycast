
import { WeatherData, WeatherCondition, DailyForecast } from '../types';

/**
 * Weather API Service
 * To use a real API, sign up at https://openweathermap.org/api
 * and set your API_KEY in the environment.
 */
const API_KEY = 'your_openweathermap_api_key_here'; // Replace with process.env.WEATHER_API_KEY if available
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  // Simulating an API call for demonstration purposes if no real key is configured
  // In a production environment, you would use:
  // const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
  
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency

  // Mock data generation logic for robust UI development
  const conditions = Object.values(WeatherCondition);
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const baseTemp = Math.floor(Math.random() * 30) + 5;

  const forecast: DailyForecast[] = Array.from({ length: 7 }).map((_, i) => ({
    date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
    tempMin: baseTemp - Math.floor(Math.random() * 5),
    tempMax: baseTemp + Math.floor(Math.random() * 5),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
  }));

  return {
    current: {
      city: city.charAt(0).toUpperCase() + city.slice(1),
      temp: baseTemp,
      feelsLike: baseTemp + 2,
      minTemp: baseTemp - 3,
      maxTemp: baseTemp + 4,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 15) + 2,
      condition: randomCondition,
      description: `Scattered ${randomCondition.toLowerCase()}`,
      timestamp: Date.now(),
    },
    forecast,
  };
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  // Similar to fetchWeatherByCity, use reverse geocoding or direct lat/lon API
  return fetchWeatherByCity("Your Location");
};
