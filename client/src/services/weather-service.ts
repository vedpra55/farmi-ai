import { CurrentConditionsResponse } from "@/types/weather";

const WEATHER_API_BASE = "https://weather.googleapis.com/v1";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Fetch current weather conditions for a given location.
 */
export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<CurrentConditionsResponse> {
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set");
  }

  const url = `${WEATHER_API_BASE}/currentConditions:lookup?key=${API_KEY}&location.latitude=${latitude}&location.longitude=${longitude}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Weather API error (${response.status}): ${error}`);
  }

  return response.json();
}
