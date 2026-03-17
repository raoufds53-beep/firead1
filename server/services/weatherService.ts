import type { WeatherData } from "@shared/schema";
import { randomUUID } from "crypto";

interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  rain?: {
    "1h": number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

export class WeatherService {
  private apiKey: string | undefined;
  private baseUrl = "https://api.openweathermap.org/data/2.5/weather";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENWEATHER_API_KEY;
  }

  async fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    if (!this.apiKey) {
      console.warn("OpenWeather API key not configured");
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data: OpenWeatherResponse = await response.json();

      return {
        id: randomUUID(),
        location: `${lat},${lon}`,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
        rainfall: data.rain?.["1h"] || 0,
        weatherCondition: data.weather[0]?.main || "Unknown",
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return null;
    }
  }

  async fetchWeatherByLocation(location: string): Promise<WeatherData | null> {
    if (!this.apiKey) {
      console.warn("OpenWeather API key not configured");
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?q=${location}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data: OpenWeatherResponse = await response.json();

      return {
        id: randomUUID(),
        location,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed * 3.6,
        rainfall: data.rain?.["1h"] || 0,
        weatherCondition: data.weather[0]?.main || "Unknown",
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return null;
    }
  }

  // Mock weather data generation for testing
  generateMockWeatherData(location: string): WeatherData {
    return {
      id: randomUUID(),
      location,
      temperature: 25 + Math.random() * 10,
      humidity: 40 + Math.random() * 50,
      windSpeed: 10 + Math.random() * 40,
      rainfall: Math.random() * 200,
      weatherCondition: ["Sunny", "Cloudy", "Rainy", "Stormy"][Math.floor(Math.random() * 4)],
      timestamp: Date.now(),
    };
  }
}

export const weatherService = new WeatherService();
