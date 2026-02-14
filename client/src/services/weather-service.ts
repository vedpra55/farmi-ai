import axios from "@/lib/axios";
import { CurrentConditionsResponse, ForecastResponse } from "@/types/weather";

/**
 * Fetch current weather conditions for a given location.
 */
export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
  token?: string | null,
): Promise<CurrentConditionsResponse> {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get(
    `/weather/current?lat=${latitude}&lng=${longitude}`,
    { headers },
  );

  // @ts-ignore
  if (response.success && response.data) {
    // @ts-ignore
    return response.data;
  }
  // @ts-ignore
  throw new Error(response.message || "Failed to fetch current weather");
}

/**
 * Fetch weather forecast for a given location.
 */
export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  token?: string | null,
): Promise<ForecastResponse> {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get(
    `/weather/forecast?lat=${latitude}&lng=${longitude}`,
    { headers },
  );

  // @ts-ignore
  if (response.success && response.data) {
    // @ts-ignore
    return response.data;
  }
  // @ts-ignore
  throw new Error(response.message || "Failed to fetch weather forecast");
}
